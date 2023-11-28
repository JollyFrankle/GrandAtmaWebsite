import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert";
import { Badge } from "@/cn/components/ui/badge";
import { Button } from "@/cn/components/ui/button";
import { Dialog, DialogContent, DialogTitle, dialogSizeByClass } from "@/cn/components/ui/dialog";
import { Skeleton } from "@/cn/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/cn/components/ui/table";
import ModalSaveConfirm from "@/components/modals/ModalSaveConfirm";
import { ApiResponse, KamarAvailibility, Reservasi, ReservasiRoom, apiAuthenticated } from "@/utils/ApiModels";
import Formatter from "@/utils/Formatter";
import { BanknoteIcon, CreditCardIcon, InfoIcon, KeyRoundIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import ModalPilihKamarCI from "./ModalPilihKamarCI";
import { toast } from "react-toastify";
import IconInput from "@/components/IconInput";
import { Checkbox } from "@/cn/components/ui/checkbox";

export interface CheckInKamar {
    id_rr: number,
    no_kamar: string,
    new_id_jk: number | null
}

export default function ModalCheckIn({
    open,
    idCustomer,
    idReservasi,
    onOpenChange,
    onSubmittedHandler
}: {
    open: boolean
    idCustomer?: number
    idReservasi?: number
    onOpenChange: (open: boolean) => void
    onSubmittedHandler: () => void
}) {
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
    const [data, setData] = useState<Reservasi>()
    const [loading, setLoading] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [kamarTerpilih, setKamarTerpilih] = useState<CheckInKamar[]>([])
    const [currentRR, setCurrentRR] = useState<ReservasiRoom>()
    const [openModalPK, setOpenModalPK] = useState(false)
    const [deposit, setDeposit] = useState("")
    const [fileIdentitas, setFileIdentitas] = useState<File>()
    const [checkSudahBenar, setCheckSudahBenar] = useState(false)

    const showConfirmModalBeforeSaving = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setOpenModalConfirm(true)
    }

    const saveData = () => {
        setOpenModalConfirm(false)
        if (+deposit < 300000) {
            toast.error("Deposit minimal Rp300.000.")
            return
        } else if (+deposit > 300000) {
            toast.error("Deposit maksimal Rp300.000.")
            return
        } else if (!fileIdentitas) {
            toast.error("Bukti identitas belum diunggah.")
            return
        } else if (kamarTerpilih.filter((it) => it.no_kamar === "").length > 0) {
            toast.error("Ada kamar yang belum dipilih.")
            return
        } else if (!checkSudahBenar) {
            toast.error("Centang bahwa semua data sudah benar.")
            return
        }

        setBtnDisabled(true)
        // #CIOC-MultipartRequest - used in CheckInOutController.ts
        const formData = new FormData()
        formData.append("deposit", deposit)
        formData.append("kamar", JSON.stringify(kamarTerpilih))
        formData.append("gambar_identitas", fileIdentitas as Blob)
        apiAuthenticated.post<ApiResponse<Reservasi>>(`pegawai/fo/checkin/${idReservasi}`, formData).then((res) => {
            const data = res.data
            toast.success(data.message)
            onOpenChange(false)
            onSubmittedHandler()
        }).finally(() => {
            setBtnDisabled(false)
            setCheckSudahBenar(false)
        })
    }

    const getDetailReservasi = () => {
        setLoading(true)
        apiAuthenticated.get<ApiResponse<Reservasi>>(`pegawai/reservasi/${idCustomer}/${idReservasi}`).then((res) => {
            const data = res.data
            setData(data.data)
            const kamarTerpilih: CheckInKamar[] = []
            for (const rr of data.data.reservasi_rooms!!) {
                kamarTerpilih.push({
                    id_rr: rr.id,
                    no_kamar: rr.no_kamar ?? "",
                    new_id_jk: null
                })
            }
            setKamarTerpilih(kamarTerpilih)
        }).finally(() => {
            setLoading(false)
        })
    }

    const pilihKamar = (rr: ReservasiRoom) => () => {
        setCurrentRR(rr)
        setOpenModalPK(true)
    }

    const onKamarSelected = (item: KamarAvailibility) => {
        const kamarSudahDipilih = kamarTerpilih.find((it) => it.no_kamar === item.no_kamar)
        if (kamarSudahDipilih) {
            toast.error("Kamar sudah dipilih.")
            return
        }
        if (item.status !== "TSD") {
            toast.error("Kamar tidak tersedia.")
            return
        }
        setKamarTerpilih((prev) => {
            const kt = kamarTerpilih.find((it) => it.id_rr === currentRR?.id)
            if (kt) {
                kt.no_kamar = item.no_kamar
                kt.new_id_jk = item.jenis_kamar.id
            }
            return prev
        })
        setOpenModalPK(false)
    }

    const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 8 * 1024 * 1024) {
                toast.error("Ukuran file terlalu besar. Maksimal 8 MB.")
                return
            } else if (!file.type.startsWith("image/")) {
                toast.error("File yang diunggah harus berupa gambar.")
                return
            } else {
                setFileIdentitas(file)
            }
            e.target.value = ""
        }
    }

    useEffect(() => {
        if (open) {
            getDetailReservasi()
            setFileIdentitas(undefined)
            setDeposit("")
            setCheckSudahBenar(false)
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
                    <form onSubmit={showConfirmModalBeforeSaving}>
                        <DialogTitle>Check In</DialogTitle>

                        <h4 className="text-lg font-bold mt-4 mb-2">Detail Singkat</h4>
                        <Alert>
                            <InfoIcon className="w-4 h-4" />
                            <AlertTitle>
                                Instruksi
                            </AlertTitle>
                            <AlertDescription>
                                Cocokkan identitas di bawah dengan identitas tamu yang bersangkutan.
                            </AlertDescription>
                        </Alert>
                        <Table className="mb-4 -mx-4">
                            <TableBody>
                                <TableRow>
                                    <TableHead>ID Booking</TableHead>
                                    <TableCell>{data?.id_booking}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableCell>{data?.user_customer?.nama}</TableCell>
                                </TableRow>
                                {(data?.id_sm) && (
                                    <TableRow>
                                        <TableHead>PIC S&M</TableHead>
                                        <TableCell>{data?.user_pegawai?.nama} ({data?.user_pegawai?.email})</TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableHead>Nomor Identitas</TableHead>
                                    <TableCell>{data?.user_customer?.jenis_identitas?.toUpperCase()} &ndash; {data?.user_customer?.no_identitas}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Jumlah tamu</TableHead>
                                    <TableCell>{data?.jumlah_dewasa} dewasa, {data?.jumlah_anak} anak</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Tanggal Check Out</TableHead>
                                    <TableCell>{data?.departure_date && Formatter.formatDate(new Date(data?.departure_date))} ({data?.jumlah_malam} malam)</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <h4 className="text-lg font-bold mb-2">Permintaan Tambahan</h4>
                        <Alert className="mb-2">
                            <InfoIcon className="w-4 h-4" />
                            <AlertTitle>
                                Instruksi
                            </AlertTitle>
                            <AlertDescription>
                                Usahakan permintaan tambahan dapat dipenuhi. Jika tidak, informasikan kepada tamu.
                            </AlertDescription>
                        </Alert>
                        <div className="whitespace-pre-wrap">{data?.permintaan_tambahan ?? <em>Tidak ada permintaan tambahan</em>}</div>

                        <h4 className="text-lg font-bold mt-4 mb-2">Kamar</h4>
                        <Alert className="mb-2">
                            <InfoIcon className="w-4 h-4" />
                            <AlertTitle>
                                Informasi
                            </AlertTitle>
                            <AlertDescription>
                                Tamu dapat memilih kamar tertentu (misal kamar dengan nomor 101) atau memilih kamar di tempat tertentu (misal kamar di lantai 1). Jika tamu tidak memilih kamar, maka pilihkan kamar yang tersedia.
                            </AlertDescription>
                        </Alert>
                        <Table className="mb-4 min-w-[600px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[48px]">No.</TableHead>
                                    <TableHead>Jenis Kamar</TableHead>
                                    <TableHead>No. Kamar</TableHead>
                                    <TableHead style={{ width: "9rem" }}>Tindakan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.reservasi_rooms?.map((it, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="text-center">{i + 1}</TableCell>
                                        <TableCell>{it.jenis_kamar?.nama}</TableCell>
                                        <TableCell>{kamarTerpilih[i].no_kamar === "" ? (
                                            <span className="text-muted-foreground">Belum dipilih</span>
                                        ) : (
                                            <Badge variant="success" className="text-base">{kamarTerpilih[i].no_kamar}</Badge>
                                        )}</TableCell>
                                        <TableCell>
                                            <Button variant="secondary" type="button" className="-my-2" onClick={pilihKamar(it)}>Pilih Kamar</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <h4 className="text-lg font-bold mb-2">Layanan Berbayar</h4>
                        <Alert className="mb-2">
                            <InfoIcon className="w-4 h-4" />
                            <AlertTitle>
                                Informasi
                            </AlertTitle>
                            <AlertDescription>
                                Jika ada "Extra Bed", segera siapkan extra bed tersebut di kamar yang bersangkutan.
                            </AlertDescription>
                        </Alert>
                        <Table className="mb-4 min-w-[600px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[48px]">No.</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Kuantitas</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.reservasi_layanan?.length ? data.reservasi_layanan.map((it, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="text-center">{i + 1}</TableCell>
                                        <TableCell>{it.layanan_tambahan?.nama}</TableCell>
                                        <TableCell>{it.qty} {it.layanan_tambahan?.satuan}</TableCell>
                                        <TableCell>{Formatter.formatCurrency(it.total / it.qty)}</TableCell>
                                        <TableCell>{Formatter.formatCurrency(it.total)}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">Tidak ada data</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <h4 className="text-lg font-bold mb-2">Deposit & Bukti Identitas</h4>
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <Alert className="mb-2">
                                    <InfoIcon className="w-4 h-4" />
                                    <AlertTitle>
                                        Informasi
                                    </AlertTitle>
                                    <AlertDescription>
                                        <div>Deposit minimum Rp300.000 dan maksimum Rp300.000 juga.</div>
                                        <div>Silakan scan kartu identitas kemudian upload pada uploader di bawah ini.</div>
                                    </AlertDescription>
                                </Alert>
                                <div>
                                    <IconInput
                                        icon={<BanknoteIcon className="w-6 h-6" />}
                                        type="number"
                                        required
                                        min={300000}
                                        max={300000}
                                        value={deposit}
                                        onValueChange={setDeposit}
                                        disabled={btnDisabled}
                                        label="Deposit" />
                                </div>
                                <div>
                                    {fileIdentitas ? (
                                        <div className="mt-2 mb-4">
                                            <Button className="w-full" onClick={() => setFileIdentitas(undefined)} variant="outline" type="button">
                                                Hapus Bukti Identitas <Trash2Icon className="w-4 h-4 ms-2" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <IconInput
                                            className="mb-4"
                                            icon={<CreditCardIcon className="w-6 h-6" />}
                                            type="file"
                                            accept="image/jpeg,image/png"
                                            label="Bukti identitas"
                                            onChange={onFileSelected} />
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 mb-4">
                                    <Checkbox id="cbVerif" checked={checkSudahBenar} onCheckedChange={(checked) => setCheckSudahBenar(checked === true)} disabled={btnDisabled} />
                                    <label htmlFor="cbVerif" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Semua data yang dimasukkan sudah benar dan saya bertanggung jawab atas data yang dimasukkan.
                                    </label>
                                </div>

                                <Button className="w-full" type="submit" size="lg" disabled={!checkSudahBenar || btnDisabled}>
                                    <KeyRoundIcon className="w-5 h-5 me-2" /> Check In
                                </Button>
                            </div>
                            <div className="col-span-1 rounded shadow overflow-auto aspect-square bg-secondary">
                                {fileIdentitas && (
                                    <img src={URL.createObjectURL(fileIdentitas)} className="w-full h-full object-contain" />
                                )}
                            </div>
                        </div>
                    </form>
                </DialogContent>
            )}
        </Dialog>

        <ModalSaveConfirm open={openModalConfirm} onOpenChange={setOpenModalConfirm} onConfirmed={saveData} />

        <ModalPilihKamarCI
            open={openModalPK}
            onOpenChange={setOpenModalPK}
            idJenisKamar={currentRR?.id_jenis_kamar}
            onSelected={onKamarSelected}
            currentlySelectedKamars={kamarTerpilih}
        />
    </>
}