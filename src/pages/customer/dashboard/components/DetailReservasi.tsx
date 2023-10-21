import { Dialog, DialogContent, DialogHeader, dialogSizeByClass } from "@/cn/components/ui/dialog"
import CardWithIcon from "@/components/CardWithIcon"
import { BadgeInfoIcon, TicketIcon, TvIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/cn/components/ui/table"
import { Skeleton } from "@/cn/components/ui/skeleton"
import { Reservasi, UserCustomer } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import ReservasiFormatter from "@/utils/ReservasiFormatter"

export default function DetailReservasi({
    data,
    user,
    show,
    loading,
    onOpenChange,
}: {
    data?: Reservasi,
    user: UserCustomer,
    show: boolean,
    loading: boolean,
    onOpenChange: (open: boolean) => void
}) {
    return <Dialog open={show} onOpenChange={onOpenChange} modal={true}>
    {loading ? (
        <DialogContent className={dialogSizeByClass("lg")}>
            <Skeleton className="w-full h-16 mb-2" />
            <Skeleton className="w-3/4 h-8 mb-2" />
            <Skeleton className="w-5/6 h-10" />
        </DialogContent>
    ) : (
        <DialogContent className={dialogSizeByClass("lg")}>
            <DialogHeader>Detail Pemesanan</DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <CardWithIcon className="col-span-1" item={{
                    icon: <TicketIcon className="w-full h-full" />,
                    title: "ID Booking",
                    content: data?.id_booking ?? <em>Belum dibuatkan</em>
                }} />
                <CardWithIcon className="col-span-1" item={{
                    icon: <BadgeInfoIcon className="w-full h-full" />,
                    title: "Status",
                    content: ReservasiFormatter.generateStatusBadge(data?.status ?? "")
                }} />
                <CardWithIcon className="col-span-1" item={{
                    icon: <TvIcon className="w-full h-full" />,
                    title: "Tanggal Pesan",
                    content: data?.arrival_date && Formatter.formatDate(new Date(data.created_at))
                }} />
            </div>
            <div>
                <h3 className="text-xl font-bold mb-2">Detail Pemesanan</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <h4 className="font-bold mb-2">Pemesan</h4>
                        <div className="mb-2">
                            <p className="text-sm text-muted-foreground">Nama</p>
                            <p className="font-bold">{user.nama}</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-bold">{user.email}</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-sm text-muted-foreground">Nomor Telepon</p>
                            <p className="font-bold">{user.no_telp}</p>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <h4 className="font-bold mb-2">Reservasi</h4>
                        <div className="mb-2">
                            <p className="text-sm text-muted-foreground">Tanggal menginap</p>
                            <p className="font-bold">{data && (
                                Formatter.formatDate(new Date(data.arrival_date)) + " - " + Formatter.formatDate(ReservasiFormatter.getTanggalDeparture(new Date(data.arrival_date), data.jumlah_malam ?? 0)
                            ))}</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-sm text-muted-foreground">Jumlah tamu</p>
                            <p className="font-bold">{data?.jumlah_dewasa} dewasa, {data?.jumlah_anak} anak</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-sm text-muted-foreground">Tanggal <em>down-payment</em></p>
                            <p className="font-bold">{data?.tanggal_dp ? Formatter.formatDateTime(new Date(data.tanggal_dp)) : <em>(Belum diverifikasi)</em>}</p>
                        </div>
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Kamar</h3>
                <Table className="mb-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[48px]">No.</TableHead>
                            <TableHead>Jenis Kamar</TableHead>
                            <TableHead>Kapasitas</TableHead>
                            <TableHead>Harga per Malam</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.reservasi_rooms?.map((it, i) => (
                            <TableRow key={i}>
                                <TableCell className="text-center">{i + 1}</TableCell>
                                <TableCell>{it.jenis_kamar?.nama}{it.no_kamar && <strong> ({it.no_kamar})</strong>}</TableCell>
                                <TableCell>{it.jenis_kamar?.kapasitas} dewasa</TableCell>
                                <TableCell>{Formatter.formatCurrency(it.harga_per_malam)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <h3 className="text-xl font-bold mb-2">Layanan Berbayar</h3>
                <Table className="mb-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[48px]">No.</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Harga</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.reservasi_layanan ? data.reservasi_layanan.map((it, i) => (
                            <TableRow key={i}>
                                <TableCell className="text-center">{i + 1}</TableCell>
                                <TableCell>{it.layanan_tambahan?.nama}</TableCell>
                                <TableCell>{Formatter.formatDateTime(new Date(it.tanggal_pakai))}</TableCell>
                                <TableCell>{Formatter.formatCurrency(it.total)}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">Tidak ada data</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

            {data?.invoice && <>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">Invoice <span className="font-normal text-lg">#{data.invoice.no_invoice}</span></h3>
                    <span className="text-muted-foreground text-sm">Dicetak pada <strong>{Formatter.formatDateTime(new Date(data.invoice.created_at))}</strong></span>
                </div>
                <Table className="mb-4">
                    <TableBody>
                        <TableRow>
                            <TableHead className="w-[35%]">Tanggal Check In</TableHead>
                            <TableCell className="w-[65%]">{Formatter.formatDateTime(new Date(data.checked_in!!))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Tanggal Check Out</TableHead>
                            <TableCell>{Formatter.formatDateTime(new Date(data.checked_out!!))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Total Kamar</TableHead>
                            <TableCell>{Formatter.formatCurrency(data.invoice.total_kamar)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Total Layanan</TableHead>
                            <TableCell>{Formatter.formatCurrency(data.invoice.total_layanan)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Pajak Layanan (10%)</TableHead>
                            <TableCell>{Formatter.formatCurrency(data.invoice.pajak_layanan)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Total</TableHead>
                            <TableCell>{Formatter.formatCurrency(data.invoice.grand_total)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </>}

                <p className="text-sm text-muted-foreground">* Data ini bersifat rahasia dan tidak untuk disebarluaskan</p>
            </div>

        </DialogContent>
    )}
</Dialog>
}