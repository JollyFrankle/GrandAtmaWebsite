import { Dialog, DialogContent, DialogTitle, dialogSizeByClass } from "@/cn/components/ui/dialog"
import { Skeleton } from "@/cn/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/cn/components/ui/table"
import { ApiResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import { useEffect, useState } from "react"

export interface CatatanKeuanganResponse {
    reservasi: Reservasi,
    kamar: {
        id: number,
        jenis_kamar: string,
        amount: number,
        harga: number
    }[],
    pajak_layanan_perc: number,
}

export default function ModalCK({
    open,
    reservasi,
    onOpenChange
}: {
    open: boolean,
    reservasi?: Reservasi,
    onOpenChange: (open: boolean) => void
}) {
    const [loading, setLoading] = useState(false)
    const [detail, setDetail] = useState<CatatanKeuanganResponse>()
    const [total, setTotal] = useState(0)
    const [dibayar, setDibayar] = useState(0)

    const fetchDetail = () => {
        if (!reservasi) {
            return
        }
        setLoading(true)
        apiAuthenticated.get<ApiResponse<CatatanKeuanganResponse>>(`pegawai/fo/catatan-keuangan/${reservasi?.id}`).then((res) => {
            const data = res.data
            setDetail(data.data)
            setLoading(false)

            const newTotal = (data.data.reservasi.total ?? 0) + (data.data.reservasi.reservasi_layanan?.reduce((prev, curr) => prev + (curr.total), 0) ?? 0) + ((data.data.pajak_layanan_perc ?? 0) * (data.data.reservasi.reservasi_layanan?.reduce((prev, curr) => prev + (curr.total), 0) ?? 0))
            setTotal(newTotal)

            const newDibayar = (data.data.reservasi.jumlah_dp ?? 0) + (data.data.reservasi.reservasi_cico?.deposit ?? 0)
            setDibayar(newDibayar)
        })
    }

    useEffect(() => {
        if (open) {
            fetchDetail()
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            {loading ? (
                <DialogContent className={dialogSizeByClass("lg")}>
                    <Skeleton className="w-full h-16 mb-2" />
                    <Skeleton className="w-3/4 h-8 mb-2" />
                    <Skeleton className="w-5/6 h-10" />
                </DialogContent>
            ) : (
                <DialogContent className={dialogSizeByClass("lg")}>
                    <DialogTitle className="mb-4">Catatan Keuangan</DialogTitle>

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
                            {(reservasi?.id_sm) && (
                                <TableRow>
                                    <TableHead>PIC S&M</TableHead>
                                    <TableCell>{reservasi?.user_pegawai?.nama} ({reservasi?.user_pegawai?.email})</TableCell>
                                </TableRow>
                            )}
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
                            {detail?.kamar.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.jenis_kamar}</TableCell>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>{detail?.reservasi.jumlah_malam}</TableCell>
                                    <TableCell>{Formatter.formatCurrency(item.harga)}</TableCell>
                                    <TableCell>{Formatter.formatCurrency(item.harga * item.amount * detail?.reservasi.jumlah_malam!!)}</TableCell>
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
                                    <div>{Formatter.formatCurrency(detail?.reservasi.total ?? 0)}</div>
                                    <div>{Formatter.formatCurrency(detail?.reservasi.jumlah_dp ?? 0)}</div>
                                    <div>{Formatter.formatCurrency((detail?.reservasi.total ?? 0) - (detail?.reservasi.jumlah_dp ?? 0))}</div>
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
                            {(detail?.reservasi.reservasi_layanan?.length ?? 0) > 0 ? detail?.reservasi.reservasi_layanan?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.layanan_tambahan?.nama}</TableCell>
                                    <TableCell>{Formatter.formatDateTimeShort(new Date(item.tanggal_pakai))}</TableCell>
                                    <TableCell>{item.qty} {item.layanan_tambahan?.satuan}</TableCell>
                                    <TableCell>{Formatter.formatCurrency(item.total / item.qty)}</TableCell>
                                    <TableCell>{Formatter.formatCurrency(item.total)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">Tidak ada</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableBody className="border-t-2">
                            <TableRow>
                                <TableCell colSpan={4} className="text-right">
                                    <div>Total</div>
                                </TableCell>
                                <TableCell className="font-bold">
                                    <div>{Formatter.formatCurrency(detail?.reservasi.reservasi_layanan?.reduce((prev, curr) => prev + (curr.total), 0) ?? 0)}</div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <h4 className="text-xl font-bold mt-4 mb-2">Rincian Total</h4>
                    <ul className="list-none border rounded-lg overflow-auto shadow">
                        <li className="p-4">
                            <div className="flex justify-between">
                                <div>Total Harga Kamar</div>
                                <div className="font-bold">
                                    {Formatter.formatCurrency(detail?.reservasi.total ?? 0)}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total Harga Layanan Berbayar</div>
                                <div className="font-bold">
                                    {Formatter.formatCurrency(detail?.reservasi.reservasi_layanan?.reduce((prev, curr) => prev + (curr.total), 0) ?? 0)}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>Pajak Layanan Berbayar ({Formatter.formatPercent(detail?.pajak_layanan_perc ?? 0)})</div>
                                <div className="font-bold">{Formatter.formatCurrency((detail?.pajak_layanan_perc ?? 0) * (detail?.reservasi.reservasi_layanan?.reduce((prev, curr) => prev + (curr.total), 0) ?? 0))}</div>
                            </div>
                        </li>
                        <li className="p-1 -mt-[1px] flex justify-between bg-secondary"></li>
                        <li className="p-4">
                            {/* <div className="font-bold">Biaya Lain</div> */}
                            <div className="flex justify-between">
                                <div>Uang Muka</div>
                                <div className="font-bold">{Formatter.formatCurrency(detail?.reservasi.jumlah_dp ?? 0)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Deposit Check-in</div>
                                <div className="font-bold">{Formatter.formatCurrency(detail?.reservasi.reservasi_cico?.deposit ?? 0)}</div>
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

                </DialogContent>
            )}
        </Dialog>
    )
}