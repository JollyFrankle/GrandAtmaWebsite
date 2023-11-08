import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/cn/components/ui/table"
import CardWithIcon from "@/components/CardWithIcon"
import { Reservasi } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import ReservasiFormatter from "@/utils/ReservasiFormatter"
import { BadgeInfoIcon, TicketIcon, TvIcon } from "lucide-react"


export default function DetailReservasi({
    data,
}: {
    data?: Reservasi
}) {
    return <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <CardWithIcon className="col-span-1" item={{
                icon: <TicketIcon className="w-full h-full" />,
                title: "ID Booking",
                content: data?.id_booking ?? <em>Belum dibuatkan</em>
            }} />
            <CardWithIcon className="col-span-1" item={{
                icon: <BadgeInfoIcon className="w-full h-full" />,
                title: "Status",
                content: ReservasiFormatter.generateStatusBadge(data?.status ?? "", data?.tanggal_dl_booking)
            }} />
            <CardWithIcon className="col-span-1" item={{
                icon: <TvIcon className="w-full h-full" />,
                title: "Tanggal Pemesanan",
                content: data?.created_at && Formatter.formatDate(new Date(data.created_at))
            }} />
        </div>
        <div>
            <div className="lg:grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <h4 className="font-bold mb-2">Pemesan</h4>
                    <div className="mb-2">
                        <p className="text-sm text-muted-foreground">Nama</p>
                        <p className="font-bold">{data?.user_customer?.nama}</p>
                    </div>
                    <div className="mb-2" hidden={!data?.user_customer?.nama_institusi}>
                        <p className="text-sm text-muted-foreground">Nama Institusi</p>
                        <p className="font-bold">{data?.user_customer?.nama_institusi}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-bold">{data?.user_customer?.email}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-sm text-muted-foreground">Nomor Telepon</p>
                        <p className="font-bold">{data?.user_customer?.no_telp}</p>
                    </div>
                </div>
                <div className="col-span-1">
                    <h4 className="font-bold mb-2">Reservasi</h4>
                    <div className="mb-2">
                        <p className="text-sm text-muted-foreground">Tanggal menginap</p>
                        <p className="font-bold">{data && (
                            Formatter.formatDate(new Date(data.arrival_date)) + " - " + Formatter.formatDate(new Date(data.departure_date)) + " (" + data.jumlah_malam + " malam)"
                        )}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-sm text-muted-foreground">Jumlah tamu</p>
                        <p className="font-bold">{data?.jumlah_dewasa} dewasa, {data?.jumlah_anak} anak ({data?.reservasi_rooms?.length ?? 0} kamar)</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-sm text-muted-foreground">Tanggal <em>down-payment</em></p>
                        <p className="font-bold">{data?.tanggal_dp ? Formatter.formatDateTime(new Date(data.tanggal_dp)) : <em>(Belum diverifikasi)</em>}</p>
                    </div>
                    <div className="mb-2" hidden={!data?.user_pegawai?.nama}>
                        <p className="text-sm text-muted-foreground">Penanggungjawab S&M</p>
                        <p className="font-bold">{data?.user_pegawai?.nama} (#{data?.id_sm})</p>
                    </div>
                </div>
            </div>

            {data?.permintaan_tambahan && <>
                <p className="text-sm text-muted-foreground">Permintaan tambahan</p>
                <p className="font-bold whitespace-pre mb-4">{data.permintaan_tambahan}</p>
            </>}

            <h4 className="text-xl font-bold mt-4 mb-2">Kamar</h4>
            <Table className="mb-4 min-w-[600px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[48px]">No.</TableHead>
                        <TableHead>Jenis Kamar</TableHead>
                        <TableHead>No. Kamar</TableHead>
                        <TableHead>Jumlah Malam</TableHead>
                        <TableHead>Harga per Malam</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.reservasi_rooms?.map((it, i) => (
                        <TableRow key={i}>
                            <TableCell className="text-center">{i + 1}</TableCell>
                            <TableCell>{it.jenis_kamar?.nama}</TableCell>
                            <TableCell>{it.no_kamar ? <strong>{it.no_kamar}</strong> : "-"}</TableCell>
                            <TableCell>{data.jumlah_malam} malam</TableCell>
                            <TableCell>{Formatter.formatCurrency(it.harga_per_malam)}</TableCell>
                            <TableCell>{Formatter.formatCurrency(it.harga_per_malam * data.jumlah_malam)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h4 className="text-xl font-bold mb-2">Layanan Berbayar</h4>
            <Table className="mb-4 min-w-[600px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[48px]">No.</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Tanggal</TableHead>
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
                            <TableCell>{Formatter.formatDateTime(new Date(it.tanggal_pakai))}</TableCell>
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
    </>
}