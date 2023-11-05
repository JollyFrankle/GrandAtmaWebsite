import AuthHelper from "@/utils/AuthHelper"
import DataTable from "@/components/DataTable"
import axios, { AxiosError } from "axios"
import { ApiResponse, BASE_URL, Reservasi, UserCustomer } from "@/utils/ApiModels"
import { useEffect, useState } from "react"
import Formatter from "@/utils/Formatter"
import ReservasiFormatter from "@/utils/ReservasiFormatter"
import { PlusIcon } from "lucide-react"
import { Button } from "@/cn/components/ui/button"
import usePageTitle from "@/hooks/usePageTitle"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import ModalDetailReservasi from "@/pages/customer/dashboard/components/ModalDetailReservasi"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/cn/components/ui/table"


export default function PageReservasiCG() {
    const params = useParams<{ id: string }>()
    const { id: idC } = params

    const [userP] = useState(AuthHelper.getUserPegawai()!!)
    const [reservations, setReservations] = useState<Reservasi[]>([])
    const [user, setUser] = useState<UserCustomer>()
    const [showDialog, setShowDialog] = useState(false)
    const [detailReservasi, setDetailReservasi] = useState<Reservasi>()
    const [detailLoading, setDetailLoading] = useState(false)
    const navigate = useNavigate()

    usePageTitle("Riwayat Reservasi - Grand Atma Hotel")

    const fetchTableData = () => {
        axios.get(`${BASE_URL}/pegawai/reservasi/${idC}`, {
            headers: {
                Authorization: `Bearer ${AuthHelper.getToken()}`
            }
        }).then((res) => {
            const data = res.data as ApiResponse<{ list: Reservasi[], customer: UserCustomer }>
            setReservations(data.data.list)
            setUser(data.data.customer)
        }).catch((err) => {
            console.log(err)
            toast("Gagal memuat data reservasi.", {
                type: "error"
            })
        })
    }

    const getDetailReservasi = (idRes: number) => {
        setDetailLoading(true)
        setShowDialog(true)
        axios.get(`${BASE_URL}/pegawai/reservasi/${idC}/${idRes}`, {
            headers: {
                Authorization: `Bearer ${AuthHelper.getToken()}`
            }
        }).then((res) => {
            const data = res.data as ApiResponse<Reservasi>
            setDetailReservasi(data.data)
            setDetailLoading(false)
        }).catch((err: AxiosError) => {
            console.log(err)
        })
    }

    useEffect(() => {
        if(AuthHelper.authorize(["sm"])) {
            fetchTableData()
        } else {
            toast("Anda tidak memiliki akses ke halaman ini. Kejadian ini telah dilaporkan.", {
                type: "error"
            })
            navigate("/admin/")
        }
    }, [])

    return <>
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Riwayat Reservasi</h1>
            <Button disabled>
                <PlusIcon className="w-4 h-4 me-2" /> Tambah
            </Button>
        </div>

        {user && <>
            <p>Menampilkan riwayat reservasi untuk:</p>
            <Table className="w-fit">
                <TableBody>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableCell>{user?.nama}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead>Nama Institusi</TableHead>
                        <TableCell>{user?.nama_institusi}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableCell>{user?.email}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead>Nomor Telepon</TableHead>
                        <TableCell>{user?.no_telp}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>}

        <DataTable<Reservasi> data={reservations} columns={[
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
                field: "id_sm",
                header: "Penanggungjawab S&M",
                cell: (row) => <>{row?.user_pegawai?.nama} {row?.id_sm === userP.id && (<strong>(Anda)</strong>) }</>
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
                cell: (row) => ReservasiFormatter.generateStatusBadge(row.status),
            },
        ]} actions={[[
            {
                action: "Lihat Detail",
                onClick: (item) => {
                    getDetailReservasi(item.id)
                }
            }
        ]]} />

        <ModalDetailReservasi show={showDialog} onOpenChange={setShowDialog} data={detailReservasi} loading={detailLoading} />
    </>
}