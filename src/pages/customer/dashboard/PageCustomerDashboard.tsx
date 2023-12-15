import AuthHelper from "@/utils/AuthHelper"
import { ApiResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import { useState } from "react"
import ModalDetailReservasi from "../../../components/modals/ModalDetailReservasi"
import { BookmarkCheckIcon, BookmarkPlusIcon, UserIcon } from "lucide-react"
import { Button } from "@/cn/components/ui/button"
import { Link } from "react-router-dom"
import usePageTitle from "@/hooks/usePageTitle"
import ReservasiHistoryTab from "../../../components/reservasi/ReservasiHistoryTab"


export default function PageCustomerDashboard() {
    const user = AuthHelper.getUserCustomer()!
    const [showDialog, setShowDialog] = useState(false)
    const [detailReservasi, setDetailReservasi] = useState<Reservasi>()
    const [detailLoading, setDetailLoading] = useState(false)

    usePageTitle("Dashboard – Grand Atma Hotel")

    const getDetailReservasi = (item: Reservasi) => {
        setDetailLoading(true)
        setShowDialog(true)
        apiAuthenticated.get<ApiResponse<Reservasi>>(`customer/reservasi/${item.id}`).then((res) => {
            const data = res.data
            setDetailReservasi(data.data)
            setDetailLoading(false)
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

                <div className="flex items-center mb-4 justify-between">
                    <h3 className="text-3xl font-bold"><mark>Reservasi</mark> Anda</h3>
                    <Button asChild>
                        <Link to="/search">
                            <BookmarkPlusIcon className="h-4 w-4 me-2" /> Buat Reservasi
                        </Link>
                    </Button>
                </div>

                <ReservasiHistoryTab onDetailClick={getDetailReservasi} />
            </div>
        </section>

        <ModalDetailReservasi show={showDialog} onOpenChange={setShowDialog} data={detailReservasi} loading={detailLoading} />
    </>
}