import { Table, TableBody, TableCell, TableHead, TableRow } from "@/cn/components/ui/table";
import { Reservasi } from "@/utils/ApiModels";


export default function DetailCustomerMini({
    reservasi
}: {
    reservasi?: Reservasi
}) {
    return (
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
    )
}