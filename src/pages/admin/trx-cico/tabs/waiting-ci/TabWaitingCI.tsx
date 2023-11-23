import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"
import { Badge } from "@/cn/components/ui/badge"
import { Checkbox } from "@/cn/components/ui/checkbox"
import DataTable from "@/components/DataTable"
import { ApiResponse, CICOListResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import { ClipboardListIcon, InfoIcon, LogInIcon, RefreshCwIcon } from "lucide-react"
import { useEffect, useState } from "react"
import ModalCheckIn from "./components/ModalCheckIn"
import ModalDetailReservasi from "@/components/modals/ModalDetailReservasi"
import { Button } from "@/cn/components/ui/button"


export default function TabWaitingCI() {
    const [list, setList] = useState<Reservasi[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const [showModalCheckIn, setShowModalCheckIn] = useState(false)
    const [currentReservasi, setCurrentReservasi] = useState<Reservasi>()
    const [showDialog, setShowDialog] = useState(false)
    const [detailReservasi, setDetailReservasi] = useState<Reservasi>()
    const [detailLoading, setDetailLoading] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        const params = new URLSearchParams({
            show_tomorrow: showAll ? "true" : "false"
        })
        await apiAuthenticated.get<ApiResponse<CICOListResponse>>(`/pegawai/fo/checkin?${params.toString()}`).then((res) => {
            const data = res.data
            setList(data.data.reservasi)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const getDetailReservasi = (reservasi: Reservasi) => {
        setDetailLoading(true)
        setShowDialog(true)
        apiAuthenticated.get<ApiResponse<Reservasi>>(`pegawai/reservasi/${reservasi.id_customer}/${reservasi.id}`).then((res) => {
            const data = res.data
            setDetailReservasi(data.data)
            setDetailLoading(false)
        })
    }

    const checkIn = async (row: Reservasi) => {
        setCurrentReservasi(row)
        setShowModalCheckIn(true)
    }

    useEffect(() => {
        fetchData()
    }, [showAll])

    return <>
        <div className="grid lg:grid-cols-3 gap-4 mb-4">
            <div className="col-span-3 lg:col-span-2">
                <Alert variant="destructive">
                    <InfoIcon className="w-4 h-4" />
                    <AlertTitle>
                        Perhatian
                    </AlertTitle>
                    <AlertDescription>
                        <div>Sebisa mungkin tamu check in setelah waktu check out (jam 12 siang) atau setelahnya.</div>
                        <div>Kecuali jika tamu meminta check in lebih awal di permintaan tambahan, usahakan diakomodasi.</div>
                        <div className="font-bold">Jika tidak diminta di permintaan tambahan, check in paling awal jam 12.00.</div>
                    </AlertDescription>
                </Alert>
            </div>
            <div className="col-span-3 lg:col-span-1">
                <p>Jika ada tamu yang meminta check in lebih awal:</p>
                <div className="flex items-center space-x-2 mb-2">
                    <Checkbox id="terms" onCheckedChange={(cc) => cc ? setShowAll(true) : setShowAll(false)} value={+showAll} disabled={isLoading} />
                    <label
                        htmlFor="terms"
                        className="cursor-pointer"
                    >
                        Tampilkan semua yang check in hari ini
                    </label>
                </div>
                <div className="text-sm text-muted-foreground">
                    Jika tidak dicentang:
                    <p><strong>Jika &lt; 12.00</strong>: list check in kemarin yang akan tampil</p>
                    <p><strong>Jika &gt;= 12.00</strong>: list check in hari ini yang akan tampil</p>
                </div>
            </div>
        </div>

        <div className="text-end">
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
                    cell: (row) => (
                        <div>
                            <p>{row.reservasi_rooms?.length} kamar</p>
                            <p>{row.jumlah_dewasa} dewasa &bull; {row.jumlah_anak} anak-anak</p>
                        </div>
                    )
                },
            ]}

            isLoading={isLoading}

            actions={[[
                {
                    action: <><LogInIcon className="w-4 h-4 me-2" /> Check In</>,
                    onClick: (row) => checkIn(row)
                },
                {
                    action: <><ClipboardListIcon className="w-4 h-4 me-2" /> Lihat Detail</>,
                    onClick: (item) => getDetailReservasi(item)
                }
            ]]}
        />

        <ModalCheckIn open={showModalCheckIn} onOpenChange={setShowModalCheckIn} idCustomer={currentReservasi?.id_customer} idReservasi={currentReservasi?.id} onSubmittedHandler={() => fetchData()} />

        <ModalDetailReservasi show={showDialog} onOpenChange={setShowDialog} data={detailReservasi} loading={detailLoading} />
    </>
}