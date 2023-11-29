import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/cn/components/ui/table";
import { ApiResponse, CICOListResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import Formatter from "@/utils/Formatter";
import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert";
import { ArrowRightIcon, InfoIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/cn/components/ui/button";
import InlineLink from "@/components/InlineLink";


export default function FOListCICOToday() {
    const [listCI, setListCI] = useState<Reservasi[]>([])
    const [listCO, setListCO] = useState<Reservasi[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [tanggalCI, setTanggalCI] = useState<Date>()
    const [tanggalCO, setTanggalCO] = useState<Date>()
    const [tanggalMinCI, setTanggalMinCI] = useState<Date>()

    const fetchDataCI = async () => {
        setIsLoading(true)
        await apiAuthenticated.get<ApiResponse<CICOListResponse>>("/pegawai/fo/checkin").then((res) => {
            const data = res.data
            setListCI(data.data.reservasi)
            setTanggalCI(new Date(data.data.min_date))
        })
    }

    const fetchDataCO = async () => {
        setIsLoading(true)
        await apiAuthenticated.get<ApiResponse<CICOListResponse>>("/pegawai/fo/checkout").then((res) => {
            const data = res.data
            setListCO(data.data.reservasi)
            setTanggalCO(new Date(data.data.max_date))
        })
    }

    const refreshAll = () => {
        Promise.all([fetchDataCI(), fetchDataCO()]).finally(() => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        refreshAll()

        const now = new Date()
        const minCI = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0)
        setTanggalMinCI(minCI)
    }, [])

    return <>
    <div className="text-center mb-2">
        <Button onClick={refreshAll}>
            <RefreshCwIcon className="w-4 h-4 me-2" />Refresh Data
        </Button>
    </div>
        <h4 className="text-xl font-bold text-center">Check In Hari Ini</h4>
        <p className="text-center mb-2">Mulai {tanggalCI && Formatter.formatDateTime(tanggalCI)}</p>
        <Table className="mb-4">
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
                ) : listCI?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={2} className="text-center">
                            Tidak ada data
                        </TableCell>
                    </TableRow>
                ) : listCI?.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-bold">{item.id_booking}</TableCell>
                        <TableCell>{item.user_customer?.nama}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        <InlineLink to="/admin/trx-cico?tab=waiting-ci" className="w-full text-center mb-4">Lakukan Check In <ArrowRightIcon calcMode="w-4 h-4 ms-2" /></InlineLink>

        <h4 className="text-xl font-bold text-center">Check Out Hari Ini</h4>
        <p className="text-center mb-2">Maks. {tanggalCO && Formatter.formatDateTime(tanggalCO)}</p>
        {/* {tanggalCO?.getTime() < } */}
        <Table className="mb-4">
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
                ) : listCO?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={2} className="text-center">
                            Tidak ada data
                        </TableCell>
                    </TableRow>
                ) : listCO?.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-bold">{item.id_booking}</TableCell>
                        <TableCell>{item.user_customer?.nama}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        <InlineLink to="/admin/trx-cico?tab=current" className="w-full text-center mb-4">Lihat Semua Tamu Menginap <ArrowRightIcon calcMode="w-4 h-4 ms-2" /></InlineLink>

        {tanggalCI && tanggalMinCI && tanggalCI?.getTime() < tanggalMinCI?.getTime() && (
            <Alert variant="destructive">
                <InfoIcon className="w-4 h-4" />
                <AlertTitle>
                    Perhatian
                </AlertTitle>
                <AlertDescription>
                    <div>Masih menampilkan data check in untuk kemarin.</div>
                    <div>Data hari ini akan tampil mulai 12.00.</div>
                </AlertDescription>
            </Alert>
        )}
    </>
}