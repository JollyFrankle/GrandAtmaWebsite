import AuthHelper from "@/utils/AuthHelper"
import DataTable from "@/components/DataTable"
import axios, { AxiosError } from "axios"
import { ApiResponse, BASE_URL, Reservasi } from "@/utils/ApiModels"
import { useEffect, useState } from "react"
import Formatter from "@/utils/Formatter"
import ModalDetailReservasi from "./components/ModalDetailReservasi"
import ReservasiFormatter from "@/utils/ReservasiFormatter"
import { BookmarkCheckIcon, UserIcon } from "lucide-react"
import { Button } from "@/cn/components/ui/button"
import { Link } from "react-router-dom"
import usePageTitle from "@/hooks/usePageTitle"
import { toast } from "react-toastify"


export default function PageCustomerDashboard() {
    const user = AuthHelper.getUserCustomer()!!
    const [reservations, setReservations] = useState<Reservasi[]>([])
    const [showDialog, setShowDialog] = useState(false)
    const [detailReservasi, setDetailReservasi] = useState<Reservasi>()
    const [detailLoading, setDetailLoading] = useState(false)

    usePageTitle("Dashboard - Grand Atma Hotel")

    const fetchReservations = () => {
        axios.get(`${BASE_URL}/customer/reservasi`, {
            headers: {
                Authorization: `Bearer ${AuthHelper.getToken()}`
            }
        }).then((res) => {
            const data = res.data as ApiResponse<Reservasi[]>
            setReservations(data.data)
        }).catch((err) => {
            console.log(err)
            toast("Gagal memuat data reservasi.", {
                type: "error"
            })
        })
    }

    const getDetailReservasi = (id: number) => {
        setDetailLoading(true)
        setShowDialog(true)
        axios.get(`${BASE_URL}/customer/reservasi/${id}`, {
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
        fetchReservations()
    }, [])

    return <>
        <section className="mt-24 py-8">
            <div className="container relative">
                <BookmarkCheckIcon className="w-48 h-48 opacity-10 absolute right-0 -bottom-24 -z-10" />
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-2xl">Selamat datang,</p>
                        <h2 className="text-4xl font-bold">{user.nama}</h2>
                    </div>
                    <Button asChild>
                        <Link to="/customer/profile">
                            <UserIcon className="h-4 w-4 me-2" /> Profil Anda
                        </Link>
                    </Button>
                </div>

                <hr className="mb-6" />

                <h3 className="text-3xl font-bold"><mark>Reservasi</mark> Anda</h3>

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
                            return Formatter.formatDate(new Date(row.arrival_date)) + " - " + Formatter.formatDate(ReservasiFormatter.getTanggalDeparture(new Date(row.arrival_date), row.jumlah_malam ?? 0))
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
            </div>
        </section>

        <ModalDetailReservasi show={showDialog} onOpenChange={setShowDialog} data={detailReservasi} loading={detailLoading} user={user} />
    </>
}