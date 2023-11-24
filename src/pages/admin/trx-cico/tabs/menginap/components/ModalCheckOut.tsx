import { Dialog, DialogContent, DialogTitle, dialogSizeByClass } from "@/cn/components/ui/dialog"
import { Skeleton } from "@/cn/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/cn/components/ui/table"
import { ApiResponse, BASE_URL, Invoice, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import { useEffect, useState } from "react"
import { CatatanKeuanganResponse } from "./ModalCK"
import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"
import { BanknoteIcon, InfoIcon, KeyRoundIcon } from "lucide-react"
import IconInput from "@/components/IconInput"
import { Button } from "@/cn/components/ui/button"
import ModalSaveConfirm from "@/components/modals/ModalSaveConfirm"
import { toast } from "react-toastify"
import { Checkbox } from "@/cn/components/ui/checkbox"

export default function ModalCheckOut({
    open,
    reservasi,
    onOpenChange,
    onSubmittedHandler
}: {
    open: boolean,
    reservasi?: Reservasi,
    onOpenChange: (open: boolean) => void,
    onSubmittedHandler: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
    const [detailCK, setDetailCK] = useState<CatatanKeuanganResponse>()
    const [total, setTotal] = useState(0)
    const [dibayar, setDibayar] = useState(0)
    const [inputUang, setInputUang] = useState("")
    const [checkKonfirmasi, setCheckKonfirmasi] = useState(false)

    const fetchDetail = () => {
        if (!reservasi) {
            return
        }
        setLoading(true)
        apiAuthenticated.get<ApiResponse<CatatanKeuanganResponse>>(`pegawai/fo/catatan-keuangan/${reservasi?.id}`).then((res) => {
            const data = res.data
            setDetailCK(data.data)
            setLoading(false)

            const newTotal = (data.data.reservasi.total ?? 0) + (data.data.reservasi.reservasi_layanan?.reduce((prev, curr) => prev + (curr.total), 0) ?? 0) + ((data.data.pajak_layanan_perc ?? 0) * (data.data.reservasi.reservasi_layanan?.reduce((prev, curr) => prev + (curr.total), 0) ?? 0))
            setTotal(newTotal)

            const newDibayar = (data.data.reservasi.jumlah_dp ?? 0) + (data.data.reservasi.reservasi_cico?.deposit ?? 0)
            setDibayar(newDibayar)

            // Kalau masih di masa depan, maka harus konfirmasi
            if (new Date(data.data.reservasi.departure_date) > new Date()) {
                setCheckKonfirmasi(false) // reset check konfirmasi
            } else {
                setCheckKonfirmasi(true)
            }
        })
    }

    const showConfirmModalBeforeSaving = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setOpenModalConfirm(true)
    }

    const saveData = () => {
        apiAuthenticated.post<ApiResponse<{ reservasi: Reservasi, invoice: Invoice }>>(`/pegawai/fo/checkout/${reservasi?.id}`, {
            total_dibayar: (total - dibayar) > 0 ? +inputUang : -inputUang
        }).then((res) => {
            const data = res.data
            toast.success(data.message)

            // Buka invoice
            const b64Id = btoa([data.data.reservasi.id, data.data.invoice.no_invoice].join(","))
            // open in new tab
            window.open(`${BASE_URL}/public/pdf/invoice/${b64Id}`, "_blank")

            onOpenChange(false)
            onSubmittedHandler()
        })
    }

    useEffect(() => {
        if (open) {
            fetchDetail()
            setInputUang("")
        }
    }, [open])

    return <>
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            {loading ? (
                <DialogContent className={dialogSizeByClass("lg")}>
                    <Skeleton className="w-full h-16 mb-2" />
                    <Skeleton className="w-3/4 h-8 mb-2" />
                    <Skeleton className="w-5/6 h-10" />
                </DialogContent>
            ) : (
                <DialogContent className={dialogSizeByClass("lg")}>
                    <DialogTitle className="mb-4">Check Out</DialogTitle>

                    <Alert className="mb-2">
                        <InfoIcon className="w-4 h-4" />
                        <AlertTitle>
                            Informasi
                        </AlertTitle>
                        <AlertDescription>
                            <div>Pastikan semua kunci kamar telah diterima sebelum melakukan pelunasan pembayaran dan check out!</div>
                        </AlertDescription>
                    </Alert>
                    <Table className="mb-4 -mx-4">
                        <TableBody>
                            <TableRow>
                                <TableHead>ID Booking</TableHead>
                                <TableCell>{reservasi?.id_booking}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableCell>{reservasi?.user_customer?.nama}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <h4 className="text-xl font-bold mt-4 mb-2">Kamar</h4>
                    <Table className="mb-4">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Jenis Kamar</TableHead>
                                <TableHead>Jumlah Kamar</TableHead>
                                <TableHead>Jumlah Malam</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {detailCK?.kamar.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.jenis_kamar}</TableCell>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>{detailCK?.reservasi.jumlah_malam}</TableCell>
                                    <TableCell>{Formatter.formatCurrency(item.harga)}</TableCell>
                                    <TableCell>{Formatter.formatCurrency(item.harga * item.amount * detailCK?.reservasi.jumlah_malam!!)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableBody className="border-t-2">
                            <TableRow>
                                <TableCell colSpan={4} className="text-right">
                                    <div>Total</div>
                                    <div>Uang Muka (DP)</div>
                                    <div>Kekurangan</div>
                                </TableCell>
                                <TableCell className="font-bold">
                                    <div>{Formatter.formatCurrency(detailCK?.reservasi.total ?? 0)}</div>
                                    <div>{Formatter.formatCurrency(detailCK?.reservasi.jumlah_dp ?? 0)}</div>
                                    <div>{Formatter.formatCurrency((detailCK?.reservasi.total ?? 0) - (detailCK?.reservasi.jumlah_dp ?? 0))}</div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <h4 className="text-xl font-bold mt-4 mb-2">Layanan Berbayar</h4>
                    <Table className="mb-4">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Layanan</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Jumlah</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(detailCK?.reservasi.reservasi_layanan?.length ?? 0) > 0 ? detailCK?.reservasi.reservasi_layanan?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.layanan_tambahan?.nama}</TableCell>
                                    <TableCell>{Formatter.formatDateTimeShort(new Date(item.tanggal_pakai))}</TableCell>
                                    <TableCell>{item.qty} {item.layanan_tambahan?.satuan}</TableCell>
                                    <TableCell>{Formatter.formatCurrency(item.total / item.qty)}</TableCell>
                                    <TableCell>{Formatter.formatCurrency(item.total)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Tidak ada</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableBody className="border-t-2">
                            <TableRow>
                                <TableCell colSpan={4} className="text-right">
                                    <div>Total</div>
                                </TableCell>
                                <TableCell className="font-bold">
                                    <div>{Formatter.formatCurrency(detailCK?.reservasi.reservasi_layanan?.reduce((prev, curr) => prev + (curr.total), 0) ?? 0)}</div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <h4 className="text-xl font-bold mt-4 mb-2">Rincian</h4>
                    <ul className="list-none mb-6 border rounded-lg overflow-auto shadow">
                        <li className="p-4">
                            <div className="flex justify-between">
                                <div>Total Harga Kamar</div>
                                <div className="font-bold">
                                    {Formatter.formatCurrency(detailCK?.reservasi.total ?? 0)}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total Harga Layanan Berbayar</div>
                                <div className="font-bold">
                                    {Formatter.formatCurrency(detailCK?.reservasi.reservasi_layanan?.reduce((prev, curr) => prev + (curr.total), 0) ?? 0)}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>Pajak Layanan Berbayar ({Formatter.formatPercent(detailCK?.pajak_layanan_perc ?? 0)})</div>
                                <div className="font-bold">{Formatter.formatCurrency((detailCK?.pajak_layanan_perc ?? 0) * (detailCK?.reservasi.reservasi_layanan?.reduce((prev, curr) => prev + (curr.total), 0) ?? 0))}</div>
                            </div>
                        </li>
                        <li className="p-1 -mt-[1px] flex justify-between bg-secondary"></li>
                        <li className="p-4">
                            {/* <div className="font-bold">Biaya Lain</div> */}
                            <div className="flex justify-between">
                                <div>Uang Muka</div>
                                <div className="font-bold">{Formatter.formatCurrency(detailCK?.reservasi.jumlah_dp ?? 0)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Deposit Check-in</div>
                                <div className="font-bold">{Formatter.formatCurrency(detailCK?.reservasi.reservasi_cico?.deposit ?? 0)}</div>
                            </div>
                        </li>
                        <li className="p-1 flex justify-between bg-secondary"></li>
                        <li className="p-4">
                            <div className="flex justify-between">
                                <div className="font-bold">Total Harga</div>
                                <div className="font-bold">{Formatter.formatCurrency(total)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="font-bold">Total Dibayar</div>
                                <div className="font-bold">{Formatter.formatCurrency(dibayar)}</div>
                            </div>
                            {(total - dibayar) > 0 ? (
                                <div className="flex justify-between text-red-600">
                                    <div className="font-bold">Total Kekurangan</div>
                                    <div className="font-bold">{Formatter.formatCurrency(total - dibayar)}</div>
                                </div>
                            ) : (
                                <div className="flex justify-between text-green-600">
                                    <div className="font-bold">Pengembalian Check Out</div>
                                    <div className="font-bold">{Formatter.formatCurrency(dibayar - total)}</div>
                                </div>
                            )}
                        </li>
                    </ul>

                    <form onSubmit={showConfirmModalBeforeSaving}>
                        <h4 className="text-xl font-bold mt-4 mb-2">Penyesuaian Pembayaran</h4>
                        <Alert className="mb-4">
                            <InfoIcon className="w-4 h-4" />
                            <AlertTitle>
                                Informasi
                            </AlertTitle>
                            <AlertDescription>
                                <div>Untuk memastikan uang yang dibayar/dikembalikan sesuai, silakan isikan input di bawah ini sesuai instruksi.</div>
                            </AlertDescription>
                        </Alert>
                        {(total - dibayar) > 0 ? <>
                            <div className="flex items-center text-red-600 text-lg mb-2">
                                <div className="w-48 shrink-0">Total Kekurangan:</div>
                                <div className="font-bold">{Formatter.formatCurrency(total - dibayar)}</div>
                            </div>

                            <div className="flex items-center mb-4 text-lg">
                                <div className="w-48 shrink-0">Uang yang dibayar:</div>
                                <div className="w-full">
                                    <IconInput
                                        size="lg"
                                        icon={<BanknoteIcon className="w-6 h-6" />}
                                        type="number"
                                        placeholder="Masukkan jumlah uang yang dibayar"
                                        value={inputUang}
                                        className="mb-1"
                                        min={0}
                                        onValueChange={(val) => setInputUang(val)}
                                    />
                                    <p className="text-sm text-muted-foreground">Terbaca: <strong>{Formatter.formatCurrency(+inputUang)}</strong></p>
                                </div>
                            </div>
                        </> : <>
                            <div className="flex items-center text-green-600 text-lg mb-2">
                                <div className="w-48 shrink-0">Total Dikembalikan:</div>
                                <div className="font-bold">{Formatter.formatCurrency(dibayar - total)}</div>
                            </div>

                            <div className="flex items-center mb-4 text-lg">
                                <div className="w-48 shrink-0">Uang yang dikembalikan:</div>
                                <div className="w-full">
                                    <IconInput
                                        size="lg"
                                        icon={<BanknoteIcon className="w-6 h-6" />}
                                        type="number"
                                        placeholder="Masukkan jumlah uang yang dikembalikan"
                                        value={inputUang}
                                        className="mb-1"
                                        min={0}
                                        onValueChange={(val) => setInputUang(val)}
                                    />
                                    <p className="text-sm text-muted-foreground">Terbaca: <strong>{Formatter.formatCurrency(+inputUang)}</strong></p>
                                </div>
                            </div>
                        </>}

                        {detailCK && new Date(detailCK.reservasi.departure_date) > new Date() && (
                            <Alert variant="destructive" className="mb-4">
                                <InfoIcon className="w-4 h-4" />
                                <AlertTitle>
                                    Peringatan!
                                </AlertTitle>
                                <AlertDescription>
                                    <div>Tanggal check out reservasi ini <strong>masih lebih awal dari tanggal seharusnya</strong>. Apakah Anda yakin customer ini benar-benar ingin melakukan check out?</div>
                                    <div className="flex items-center space-x-2 mt-2 text-foreground">
                                        <Checkbox id="konfirmasi-co" onCheckedChange={(cc) => setCheckKonfirmasi(cc === true)} value={+checkKonfirmasi} />
                                        <label
                                            htmlFor="konfirmasi-co"
                                            className="cursor-pointer"
                                        >
                                            Customer ini benar-benar telah meminta check out lebih awal dari tanggal seharusnya
                                        </label>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button className="w-full" type="submit" size="lg" disabled={+inputUang === 0 || !checkKonfirmasi}>
                            <KeyRoundIcon className="w-5 h-5 me-2" /> Check Out
                        </Button>
                    </form>

                </DialogContent>
            )}
        </Dialog>

        <ModalSaveConfirm open={openModalConfirm} onOpenChange={setOpenModalConfirm} onConfirmed={saveData} btnText="Check out">
            Apakah Anda yakin ingin melakukan check out untuk <strong>{reservasi?.id_booking}</strong> (customer: {reservasi?.user_customer?.nama})?
        </ModalSaveConfirm>
    </>
}