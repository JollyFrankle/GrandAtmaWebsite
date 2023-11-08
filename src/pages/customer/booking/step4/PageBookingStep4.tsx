import { ApiResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import { AxiosError } from "axios"
import { ClipboardListIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/cn/components/ui/button"
import GeneralLoadingDialog from "@/components/GeneralLoadingDialog"
import DetailReservasi from "../../dashboard/components/DetailReservasi"

export default function PageBookingStep4() {
    const params = useParams<{ id: string }>()
    const { id } = params

    const [detail, setDetail] = useState<Reservasi>()
    const [isLoading, setIsLoading] = useState(true)

    const getDetailReservasi = async () => {
        return apiAuthenticated.get<ApiResponse<Reservasi>>(`customer/reservasi/${id}`).then((res) => {
            const data = res.data.data
            setDetail(data)
        }).catch((err: AxiosError) => {
            console.log(err)
        })
    }

    useEffect(() => {
        Promise.all([getDetailReservasi()]).finally(() => {
            setIsLoading(false)
        })
    }, [])

    return <>
        <section className="container py-8 flex flex-col-reverse lg:flex-row gap-6 mb-4">
            <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Anda Sudah Selesai!</h2>
                <p className="text-secondary-foreground">Terima kasih telah melakukan reservasi di Grand Atma Hotel. Berikut adalah detail reservasi Anda.</p>

                <DetailReservasi data={detail} />

                <div className="md:flex flex-end mt-4">
                    <Button className="text-lg h-14 px-6" asChild>
                        <Link to="/customer">
                            Kembali ke Dashboard <ClipboardListIcon className="w-6 h-6 ms-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

        <GeneralLoadingDialog show={isLoading} />
    </>
}