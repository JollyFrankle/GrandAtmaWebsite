import { Badge } from "@/cn/components/ui/badge"
import { Button } from "@/cn/components/ui/button"
import DataTable from "@/components/DataTable"
import ModalDetailReservasi from "@/components/modals/ModalDetailReservasi"
import { ApiResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import { CalendarClockIcon, ClipboardListIcon, HelpingHandIcon, LogOutIcon, RefreshCwIcon, WalletIcon } from "lucide-react"
import { useEffect, useState } from "react"
import ModalPLB from "./components/ModalPLB"
import ModalCK from "./components/ModalCK"
import ModalCheckOut from "./components/ModalCheckOut"
import ModalPerpanjang from "./components/ModalPerpanjang"


export default function TabMenginap() {
    const [list, setList] = useState<Reservasi[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [detailReservasi, setDetailReservasi] = useState<Reservasi>()
    const [detailLoading, setDetailLoading] = useState(false)
    const [lastFetch, setLastFetch] = useState("Belum pernah")

    const [currentReservasi, setCurrentReservasi] = useState<Reservasi>()
    const [openModalPLB, setOpenModalPLB] = useState(false)
    const [openModalCK, setOpenModalCK] = useState(false)
    const [openModalCO, setOpenModalCO] = useState(false)
    const [openModalPerpanjang, setOpenModalPerpanjang] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        await apiAuthenticated.get<ApiResponse<Reservasi[]>>(`/pegawai/fo/menginap`).then((res) => {
            const data = res.data
            setList(data.data)
            setLastFetch(Formatter.formatDateTime(new Date()))
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const getDetailReservasi = (reservasi: Reservasi) => {
        setDetailLoading(true)
        setOpenModalDetail(true)
        apiAuthenticated.get<ApiResponse<Reservasi>>(`pegawai/reservasi/${reservasi.id_customer}/${reservasi.id}`).then((res) => {
            const data = res.data
            setDetailReservasi(data.data)
            setDetailLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return <>
        <div className="md:flex justify-between items-center text-center md:text-start">
            <div>
                Data terakhir diambil pada <strong>{lastFetch}</strong>
            </div>
            <Button onClick={() => fetchData()} disabled={isLoading}><RefreshCwIcon className="w-4 h-4 me-2" /> Refresh</Button>
        </div>

        <DataTable<Reservasi>
            data={list}
            columns={[
                {
                    field: "id_booking",
                    header: "Booking ID",
                    enableSorting: true,
                    cell: (row) => row.id_booking ? (
                        <span className="text-lg font-bold">{row.id_booking}</span>
                    ) : (
                        <span className="text-muted-foreground">Belum digenerate</span>
                    )
                },
                {
                    field: "id_customer",
                    header: "Customer",
                    cell: (row) => <>
                        <div className="font-bold">{row.user_customer?.nama}</div>
                        <div className="text-muted-foreground">{row.user_customer?.email}</div>
                    </>,
                    accessorFn: (row) => (row.user_customer?.nama ?? "") + (row.user_customer?.email ?? "")
                },
                {
                    field: "user_customer",
                    header: "Jenis Customer",
                    enableSorting: true,
                    cell: (row) => <div className="text-center">
                        {row.user_customer?.type === 'g' ? (
                            <Badge variant="danger">Group</Badge>
                        ) : (
                            <Badge variant="default">Personal</Badge>
                        )}
                    </div>,
                    accessorFn: (row) => row.user_customer?.type === 'g' ? 1 : 0
                },
                {
                    field: "arrival_date",
                    header: "Tanggal Menginap",
                    enableSorting: true,
                    cell: (row) => <>
                        <div className="font-bold">{Formatter.formatDate(new Date(row.arrival_date))} - {Formatter.formatDate(new Date(row.departure_date))}</div>
                        <div>{row.jumlah_malam} malam</div>
                    </>
                },
                {
                    field: "jumlah_malam",
                    header: "Jumlah Tamu",
                    enableSorting: false,
                    cell: (row) => <div>{row.jumlah_dewasa} dewasa &bull; {row.jumlah_anak} anak-anak</div>
                },
            ]}

            isLoading={isLoading}

            actions={[[
                {
                    action: <><HelpingHandIcon className="w-4 h-4 me-2" /> Pesan Layanan Berbayar</>,
                    onClick: (item) => {
                        setCurrentReservasi(item)
                        setOpenModalPLB(true)
                    }
                },
                {
                    action: <><WalletIcon className="w-4 h-4 me-2" /> Catatan Keuangan</>,
                    onClick: (item) => {
                        setCurrentReservasi(item)
                        setOpenModalCK(true)
                    }
                },
                {
                    action: <><ClipboardListIcon className="w-4 h-4 me-2" /> Lihat Detail</>,
                    onClick: (item) => getDetailReservasi(item)
                }
            ], [
                {
                    action: <><CalendarClockIcon className="w-4 h-4 me-2" /> Perpanjang</>,
                    onClick: (row) => {
                        setCurrentReservasi(row)
                        setOpenModalPerpanjang(true)
                    }
                },
                {
                    action: <><LogOutIcon className="w-4 h-4 me-2" /> Check Out</>,
                    onClick: (row) => {
                        setCurrentReservasi(row)
                        setOpenModalCO(true)
                    }
                },
            ]]}
        />

        <ModalDetailReservasi show={openModalDetail} onOpenChange={setOpenModalDetail} data={detailReservasi} loading={detailLoading} />

        <ModalPLB open={openModalPLB} onOpenChange={setOpenModalPLB} reservasi={currentReservasi} onSubmittedHandler={() => fetchData()} />

        <ModalCK open={openModalCK} onOpenChange={setOpenModalCK} reservasi={currentReservasi} />

        <ModalCheckOut open={openModalCO} onOpenChange={setOpenModalCO} reservasi={currentReservasi} onSubmittedHandler={() => fetchData()} />

        <ModalPerpanjang open={openModalPerpanjang} onOpenChange={setOpenModalPerpanjang} reservasi={currentReservasi} onSubmittedHandler={() => fetchData()} />
    </>
}