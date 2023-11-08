import DataTable, { ColumnRules, RowActions } from "@/components/DataTable"
import { ApiResponse, Reservasi, UserCustomer, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import ReservasiFormatter from "@/utils/ReservasiFormatter"
import { CircleSlashIcon, ClipboardListIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

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
            onClick: (item) => onCancelClick?.(item)
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

    useEffect(() => {
        setActions(getActions(status, onDetailClick, () => toast.error("Not yet implemented")))
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

    return (
        <DataTable<Reservasi> data={reservations} columns={columns} isLoading={isLoading} actions={actions} />
    )
}