import DataTable, { ColumnRules, RowActions } from "@/components/DataTable"
import { ApiResponse, Reservasi, UserCustomer, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import ReservasiFormatter from "@/utils/ReservasiFormatter"
import { CircleDollarSignIcon, CircleSlashIcon, ClipboardListIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ModalDelete from "../modals/ModalDelete"
import { Card, CardContent } from "@/cn/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"

type Status = "upcoming" | "completed" | "cancelled"

function getColumns(idCustomer?: number) {
    const columns: ColumnRules<Reservasi>[] = [
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
            field: "arrival_date",
            header: "Tanggal Menginap",
            enableSorting: true,
            cell(row) {
                return Formatter.formatDate(new Date(row.arrival_date)) + " - " + Formatter.formatDate(new Date(row.departure_date))
            },
        },
        {
            field: "jumlah_malam",
            header: "Detail",
            enableSorting: false,
            cell: (row) => (
                <div>
                    <p>{row.jumlah_malam} malam</p>
                    <p>{row.jumlah_dewasa} dewasa &bull; {row.jumlah_anak} anak-anak</p>
                </div>
            )
        },
        {
            field: "total",
            header: "Total Harga Kamar",
            enableSorting: true,
            cell: (row) => Formatter.formatCurrency(row.total)
        },
        {
            field: "status",
            header: "Status",
            enableSorting: true,
            cell: (row) => ReservasiFormatter.generateStatusBadge(row.status, row.tanggal_dl_booking),
        },
    ]

    if (idCustomer) {
        // Role pegawai
        // Add a column in 3rd index
        columns.splice(3, 0,
            {
                field: "id_sm",
                header: "Penanggungjawab S&M",
                cell: (row) => <>{row?.user_pegawai?.nama}</>
            }
        )
    }

    return columns
}

function getActions(status?: Status, onDetailClick?: (id: number) => void, onCancelClick?: (item: Reservasi) => void) {
    const actions: RowActions<Reservasi>[][] = [[
        {
            action: <><ClipboardListIcon className="w-4 h-4 me-2" /> Lihat Detail</>,
            onClick: (item) => onDetailClick?.(item.id)
        }
    ]]

    if (status === "upcoming") {
        actions[0].push({
            action: <><CircleSlashIcon className="w-4 h-4 me-2" /> Batalkan</>,
            onClick: (item) => onCancelClick?.(item),
            enabled: (item) => new Date(item.arrival_date) > new Date()
        })
    }

    return actions
}

export default function ListReservasi({
    idCustomer,
    // idPegawai,
    onUserFetched,
    status,
    onDetailClick
}: {
    idCustomer?: number,
    // idPegawai?: number,
    status?: Status,
    onUserFetched?: (user: UserCustomer) => void,
    onDetailClick?: (id: number) => void
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [reservations, setReservations] = useState<Reservasi[]>([])
    const [columns, setColumns] = useState<ColumnRules<Reservasi>[]>([])
    const [actions, setActions] = useState<RowActions<Reservasi>[][]>([])
    const [currentData, setCurrentData] = useState<Reservasi>()
    const [showCancelDialog, setShowCancelDialog] = useState(false)

    const openCancelDialog = (item: Reservasi) => {
        setCurrentData(item)
        setShowCancelDialog(true)
    }

    const cancelReservation = () => {
        if (!idCustomer) {
            apiAuthenticated.delete<ApiResponse<Reservasi>>(`customer/reservasi/${currentData?.id}`).then((res) => {
                const data = res.data
                toast.success(data.message)
                fetchReservations()
            }).catch((err) => {
                console.log(err)
                toast.error("Gagal membatalkan reservasi.")
            }).finally(() => {
                setShowCancelDialog(false)
            })
        } else {
            apiAuthenticated.delete<ApiResponse<Reservasi>>(`pegawai/reservasi/${idCustomer}/${currentData?.id}`).then((res) => {
                const data = res.data
                toast.success(data.message)
                fetchReservations()
            }).catch((err) => {
                console.log(err)
                toast.error("Gagal membatalkan reservasi.")
            }).finally(() => {
                setShowCancelDialog(false)
            })
        }
    }

    useEffect(() => {
        setActions(getActions(status, onDetailClick, openCancelDialog))
        setColumns(getColumns(idCustomer))
    }, [status])

    const fetchReservations = () => {
        const queryParam = new URLSearchParams({ status: status ?? "" }).toString()
        setIsLoading(true)
        if (!idCustomer) {
            // Role is customer
            apiAuthenticated.get<ApiResponse<Reservasi[]>>(`customer/reservasi?${queryParam}`).then((res) => {
                const data = res.data
                setReservations(data.data)
            }).catch((err) => {
                console.log(err)
                toast.error("Gagal memuat data reservasi.")
            }).finally(() => {
                setIsLoading(false)
            })
        } else {
            // Role is pegawai
            apiAuthenticated.get<ApiResponse<{ list: Reservasi[], customer: UserCustomer }>>(`pegawai/reservasi/${idCustomer}?${queryParam}`).then((res) => {
                const data = res.data
                setReservations(data.data.list)
                onUserFetched?.(data.data.customer)
            }).catch((err) => {
                console.log(err)
                toast.error("Gagal memuat data reservasi.")
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    useEffect(() => {
        fetchReservations()
    }, [])

    return <>
        <DataTable<Reservasi> data={reservations} columns={columns} isLoading={isLoading} actions={actions} />

        <ModalDelete open={showCancelDialog} onOpenChange={setShowCancelDialog} onConfirmed={cancelReservation} title="Batalkan Reservasi" deleteButton={<><CircleSlashIcon className="h-4 w-4 me-2" /> Batalkan Reservasi</>}>
            <p className="mb-4">Apakah Anda yakin ingin membatalkan reservasi berikut:</p>
            <Card className="mb-4">
                <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Booking ID:</p>
                    <p className="font-bold text-lg">{currentData?.id_booking}</p>
                </CardContent>
            </Card>
            {/* {currentData?.arrival_date} {new Date(new Date().setDate(new Date().getDate() + 7)).toJSON()} */}
            {currentData && new Date(currentData.arrival_date) > new Date(new Date().setDate(new Date().getDate() + 7)) ? (
                <Alert>
                    <CircleDollarSignIcon className="w-4 h-4 stroke-green-600" />
                    <AlertTitle className="text-green-600">
                        Anda akan mendapat <em>refund</em>.
                    </AlertTitle>
                    <AlertDescription>
                        <p><em>Refund</em> diberikan sebesar 100% dari total harga kamar.</p>
                        <p>Untuk tata cara melakukan <em>refund</em>, silakan hubungi kami.</p>
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert variant="destructive">
                    <CircleDollarSignIcon className="w-4 h-4 " />
                    <AlertTitle>
                        Anda tidak akan mendapat <em>refund</em>.
                    </AlertTitle>
                    <AlertDescription>
                        <p>Uang Anda tidak akan kembali karena reservasi ini kurang dari 1 (satu) minggu sebelum tanggal <em>check-in</em>.</p>
                    </AlertDescription>
                </Alert>
            )}
        </ModalDelete>
    </>
}