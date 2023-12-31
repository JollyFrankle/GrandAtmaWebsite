import DataTable, { ColumnRules, RowActions } from "@/components/DataTable"
import { ApiResponse, BASE_URL, Reservasi, UserCustomer, UserPegawai, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import ReservasiFormatter, { CancelableStatus } from "@/utils/ReservasiFormatter"
import { CircleDollarSignIcon, CircleSlashIcon, ClipboardListIcon, FileTextIcon, ReceiptIcon, StepForwardIcon } from "lucide-react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { toast } from "react-toastify"
import ModalDelete from "../modals/ModalDelete"
import { Card, CardContent } from "@/cn/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"
import { useNavigate } from "react-router-dom"
import AuthHelper from "@/utils/AuthHelper"

type Status = "upcoming" | "completed" | "cancelled"

export interface ListReservasiRef {
    fetchReservations: () => void
}

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
            cell: (row) => <>
                <div className="font-bold">{Formatter.formatDate(new Date(row.arrival_date))} - {Formatter.formatDate(new Date(row.departure_date))}</div>
                <div>{row.jumlah_malam} malam</div>
            </>
        },
        {
            field: "jumlah_malam",
            header: "Detail",
            enableSorting: false,
            cell: (row) => <>{row.jumlah_dewasa} dewasa &bull; {row.jumlah_anak} anak-anak</>
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
            cell: (row) => <div className="text-center">{ReservasiFormatter.generateStatusBadge(row.status, row.tanggal_dl_booking)}</div>,
        },
    ]

    if (idCustomer) {
        // Role pegawai
        columns.splice(3, 0,
            {
                field: "id_sm",
                header: "Penanggungjawab S&M",
                cell: (row) => <>{row?.user_pegawai?.nama}</>,
                accessorFn: (row) => row?.user_pegawai?.nama ?? ""
            }
        )

        if (idCustomer === -1) {
            // Get all reservasi
            columns.splice(1, 0,
                {
                    field: "id_customer",
                    header: "Customer",
                    cell: (row) => <>{row?.user_customer?.nama}</>,
                    accessorFn: (row) => row?.user_customer?.nama ?? ""
                }
            )
        }
    }

    return columns
}

function getActions(
    status?: Status,
    userSM?: UserPegawai,
    onDetailClick?: (item: Reservasi) => void,
    onCancelClick?: (item: Reservasi) => void,
    onContinueClick?: (item: Reservasi) => void
) {
    const actions: RowActions<Reservasi>[][] = [[
        {
            action: <><ClipboardListIcon className="w-4 h-4 me-2" /> Lihat Detail</>,
            onClick: (item) => onDetailClick?.(item)
        }
    ]]

    if (status === "upcoming") {
        actions[0].push({
            action: <><CircleSlashIcon className="w-4 h-4 me-2" /> Batalkan</>,
            onClick: (item) => onCancelClick?.(item),
            enabled: (item) => {
                const cancellable = ReservasiFormatter.isReservasiCancelable(item)
                const isCancellable = cancellable === CancelableStatus.YES_REFUND || cancellable === CancelableStatus.NO_REFUND || cancellable === CancelableStatus.NO_CONSEQUENCE
                console.log(userSM, item)
                return userSM ? userSM.id === item.id_sm && isCancellable : isCancellable
            }
        })
        actions[0].push({
            action: <><StepForwardIcon className="w-4 h-4 me-2" /> Lanjutkan</>,
            onClick: (item) => onContinueClick?.(item),
            enabled: (item) => {
                const continuable = item.status.startsWith("pending-")
                return userSM ? userSM.id === item.id_sm && continuable : continuable
            }
        })
    }

    if (["upcoming", "completed"].includes(status ?? "")) {
        actions[0].push({
            action: <><FileTextIcon className="w-4 h-4 me-2" /> Tanda Terima</>,
            onClick: (item) => {
                const b64Id = btoa([item.id, item.id_customer, item.id_booking].join(","))
                // open in new tab
                window.open(`${BASE_URL}/public/pdf/tanda-terima/${b64Id}`, "_blank")
            },
            enabled: (item) => !item.status.startsWith("pending-")
        })
    }

    if (["completed"].includes(status ?? "")) {
        actions[0].push({
            action: <><ReceiptIcon className="w-4 h-4 me-2" /> Nota Lunas</>,
            onClick: (item) => {
                const b64Id = btoa([item.id, item.invoice?.no_invoice].join(","))
                // open in new tab
                window.open(`${BASE_URL}/public/pdf/invoice/${b64Id}`, "_blank")
            }
        })
    }

    return actions
}

const ListReservasi = forwardRef(({
    idCustomer,
    onUserFetched,
    status,
    onDetailClick
}: {
    idCustomer?: number,
    status?: Status,
    onUserFetched?: (user: UserCustomer | null) => void,
    onDetailClick?: (reservasi: Reservasi) => void
}, ref: React.Ref<ListReservasiRef | undefined>) => {
    const [isLoading, setIsLoading] = useState(false)
    const [reservations, setReservations] = useState<Reservasi[]>([])
    const [columns, setColumns] = useState<ColumnRules<Reservasi>[]>([])
    const [actions, setActions] = useState<RowActions<Reservasi>[][]>([])
    const [currentData, setCurrentData] = useState<Reservasi>()
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [userSM, setUserSM] = useState<UserPegawai>()

    const navigate = useNavigate()

    const continueReservation = (item: Reservasi) => {
        const step = item.status.split("-")[1]
        navigate(`/booking/${item.id_customer}/${item.id}/step-${step}`)
    }

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
            }).finally(() => {
                setShowCancelDialog(false)
            })
        } else {
            apiAuthenticated.delete<ApiResponse<Reservasi>>(`pegawai/reservasi/${currentData?.id_customer}/${currentData?.id}`).then((res) => {
                const data = res.data
                toast.success(data.message)
                fetchReservations()
            }).finally(() => {
                setShowCancelDialog(false)
            })
        }
    }

    useEffect(() => {
        setActions(getActions(status, userSM, onDetailClick, openCancelDialog, continueReservation))
        setColumns(getColumns(idCustomer))
    }, [status, userSM])

    useEffect(() => {
        setUserSM(AuthHelper.getUserPegawai() ?? undefined)
    }, [])

    const fetchReservations = () => {
        const queryParam = new URLSearchParams({ status: status ?? "" }).toString()
        setIsLoading(true)
        if (!idCustomer) {
            // Role is customer
            apiAuthenticated.get<ApiResponse<Reservasi[]>>(`customer/reservasi?${queryParam}`).then((res) => {
                const data = res.data
                setReservations(data.data)
            }).finally(() => {
                setIsLoading(false)
            })
        } else {
            // Role is pegawai
            apiAuthenticated.get<ApiResponse<{ list: Reservasi[], customer: UserCustomer }>>(`pegawai/reservasi/${idCustomer}?${queryParam}`).then((res) => {
                const data = res.data
                setReservations(data.data.list)
                onUserFetched?.(data.data.customer)
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    useImperativeHandle(ref, () => ({
        fetchReservations
    }))

    useEffect(() => {
        fetchReservations()
    }, [])

    return <>
        <DataTable<Reservasi> data={reservations} columns={columns} isLoading={isLoading} actions={actions} />

        <ModalDelete open={showCancelDialog} onOpenChange={setShowCancelDialog} onConfirmed={cancelReservation} title="Batalkan Reservasi" deleteButton={<><CircleSlashIcon className="h-4 w-4 me-2" /> Batalkan Reservasi</>}>
            <p className="mb-4">Apakah Anda yakin ingin membatalkan reservasi berikut</p>
            {currentData?.id_booking && (
                <Card className="mb-4">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Booking ID:</p>
                        <p className="font-bold text-lg">{currentData?.id_booking}</p>
                    </CardContent>
                </Card>
            )}
            {/* {currentData?.arrival_date} {new Date(new Date().setDate(new Date().getDate() + 7)).toJSON()} */}
            {currentData && (currentData.status.startsWith("pending-") ? (
                <Alert>
                    <CircleDollarSignIcon className="w-4 h-4" />
                    <AlertTitle>
                        Reservasi ini belum diselesaikan
                    </AlertTitle>
                    <AlertDescription>
                        <p>Anda dapat menghapus reservasi ini tanpa konsekuensi.</p>
                    </AlertDescription>
                </Alert>
            ) : new Date(currentData.arrival_date) > new Date(new Date().setDate(new Date().getDate() + 7)) ? (
                <Alert>
                    <CircleDollarSignIcon className="w-4 h-4 stroke-green-600" />
                    <AlertTitle className="text-green-600">
                        {idCustomer ? "Customer ini" : "Anda"} akan mendapat <em>refund</em>.
                    </AlertTitle>
                    <AlertDescription>
                        <p><em>Refund</em> diberikan sebesar 100% dari total harga kamar.</p>
                        <p>Untuk tata cara melakukan <em>refund</em>, silakan {idCustomer ? "dikonfirmasi dengan customer" : "hubungi kami"} paling lambat 3 hari setelah Anda mengonfirmasi pembatalan.</p>
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert variant="destructive">
                    <CircleDollarSignIcon className="w-4 h-4 " />
                    <AlertTitle>
                        {idCustomer ? "Customer ini" : "Anda"} tidak akan mendapat <em>refund</em>.
                    </AlertTitle>
                    <AlertDescription>
                        <p>Uang tidak akan dikembalikan karena pembatalan dilakukan kurang dari 1 (satu) minggu sebelum tanggal <em>check-in</em>.</p>
                    </AlertDescription>
                </Alert>
            ))}
        </ModalDelete>
    </>
})

export default ListReservasi