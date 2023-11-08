import AuthHelper from "@/utils/AuthHelper"
import { AxiosError } from "axios"
import { ApiResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import { useState } from "react"
import ModalDetailReservasi from "./components/ModalDetailReservasi"
import { BookmarkCheckIcon, UserIcon } from "lucide-react"
import { Button } from "@/cn/components/ui/button"
import { Link } from "react-router-dom"
import usePageTitle from "@/hooks/usePageTitle"
import ReservasiHistoryTab from "./components/ReservasiHistoryTab"


export default function PageCustomerDashboard() {
    const user = AuthHelper.getUserCustomer()!!
    const [showDialog, setShowDialog] = useState(false)
    const [detailReservasi, setDetailReservasi] = useState<Reservasi>()
    const [detailLoading, setDetailLoading] = useState(false)

    usePageTitle("Dashboard - Grand Atma Hotel")

    const getDetailReservasi = (id: number) => {
        setDetailLoading(true)
        setShowDialog(true)
        apiAuthenticated.get<ApiResponse<Reservasi>>(`customer/reservasi/${id}`).then((res) => {
            const data = res.data
            setDetailReservasi(data.data)
            setDetailLoading(false)
        }).catch((err: AxiosError) => {
            console.log(err)
        })
    }

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

                <h3 className="text-3xl font-bold mb-4"><mark>Reservasi</mark> Anda</h3>

                <ReservasiHistoryTab onDetailClick={getDetailReservasi} />
            </div>
        </section>

        <ModalDetailReservasi show={showDialog} onOpenChange={setShowDialog} data={detailReservasi} loading={detailLoading} />
    </>
}