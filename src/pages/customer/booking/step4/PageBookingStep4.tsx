import { ApiResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import { AxiosError } from "axios"
import { ClipboardListIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/cn/components/ui/button"
import GeneralLoadingDialog from "@/components/GeneralLoadingDialog"
import DetailReservasi from "../../../../components/reservasi/DetailReservasi"
import AuthHelper from "@/utils/AuthHelper"

const urls = {
    getDetail: '',
    urlDashboard: ''
}

export default function PageBookingStep4() {
    const params = useParams<{ idR: string, idC: string }>()
    const { idR, idC } = params

    const [detail, setDetail] = useState<Reservasi>()
    const [isLoading, setIsLoading] = useState(true)

    const getDetailReservasi = async () => {
        return apiAuthenticated.get<ApiResponse<Reservasi>>(urls.getDetail).then((res) => {
            const data = res.data.data
            setDetail(data)
        }).catch((err: AxiosError) => {
            console.log(err)
        })
    }

    useEffect(() => {
        if (AuthHelper.getUserCustomer()) {
            urls.getDetail = `customer/reservasi/${idR}`
            urls.urlDashboard = "/customer"
        } else if (AuthHelper.getUserPegawai()) {
            urls.getDetail = `pegawai/reservasi/${idC}/${idR}`
            urls.urlDashboard = `/admin/cg/${idC}`
        }
        Promise.all([getDetailReservasi()]).finally(() => {
            setIsLoading(false)
        })
    }, [])

    return <>
        <section className="container py-8 flex flex-col-reverse lg:flex-row gap-6 mb-4">
            <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Pemesanan Kamar Diterima!</h2>
                <p className="text-muted-foreground mb-4">Terima kasih telah melakukan reservasi di Grand Atma Hotel. Berikut adalah detail reservasi Anda.</p>

                <DetailReservasi data={detail} />

                <div className="md:flex flex-end mt-4">
                    <Button className="text-lg h-14 px-6" asChild>
                        <Link to={urls.urlDashboard}>
                            Kembali ke Dashboard <ClipboardListIcon className="w-6 h-6 ms-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

        <GeneralLoadingDialog show={isLoading} />
    </>
}