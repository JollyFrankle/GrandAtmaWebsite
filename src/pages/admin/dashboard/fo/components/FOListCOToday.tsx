import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/cn/components/ui/table";
import { ApiResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function FOListCOToday() {
    const [list, setList] = useState<Reservasi[]>([])
    const [isLoading, setIsLoading] = useState(false)


    const fetchData = () => {
        setIsLoading(true)
        apiAuthenticated.get<ApiResponse<Reservasi[]>>("/pegawai/fo/checkout").then((res) => {
            const data = res.data
            setList(data.data)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return <>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID Booking</TableHead>
                    <TableHead>Nama Tamu</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={2} className="text-center">
                            <LoadingSpinner />
                        </TableCell>
                    </TableRow>
                ) : list?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={2} className="text-center">
                            Tidak ada data
                        </TableCell>
                    </TableRow>
                ) : list?.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.id_booking}</TableCell>
                        <TableCell>{item.user_customer?.nama}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>
}