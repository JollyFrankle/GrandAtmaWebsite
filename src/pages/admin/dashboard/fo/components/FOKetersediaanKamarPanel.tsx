import { Button } from "@/cn/components/ui/button"
import LoadingSpinner from "@/components/LoadingSpinner"
import ModalDetailReservasi from "@/components/modals/ModalDetailReservasi"
import { ApiResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import { useEffect, useState } from "react"


interface KamarAvailibility {
    no_kamar: string,
    reservasi: Reservasi | null,
    status: 'TSD' | 'TRS' | 'COT' | 'UNV'
}

export default function FOKetersediaanKamarPanel({
    noLantai
}: {
    noLantai?: string
}) {
    const [list, setList] = useState<KamarAvailibility[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout>()
    const [detailReservasi, setDetailReservasi] = useState<Reservasi>()
    const [showDialog, setShowDialog] = useState(false)
    const [detailLoading, setDetailLoading] = useState(false)

    const fetchData = () => {
        const query = new URLSearchParams({ no_lantai: noLantai ?? '' })

        setIsLoading(true)
        apiAuthenticated.get<ApiResponse<KamarAvailibility[]>>(`pegawai/fo/ketersediaan?${query.toString()}`).then((res) => {
            const data = res.data
            setList(data.data)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const getDetailReservasi = (reservasi: Reservasi | null) => {
        if (reservasi) {
            setDetailLoading(true)
            setShowDialog(true)
            apiAuthenticated.get<ApiResponse<Reservasi>>(`pegawai/reservasi/${reservasi.id_customer}/${reservasi.id}`).then((res) => {
                const data = res.data
                setDetailReservasi(data.data)
                setDetailLoading(false)
            })
        }
    }

    useEffect(() => {
        fetchData()
    }, [noLantai])

    useEffect(() => {
        if (refreshInterval) {
            clearInterval(refreshInterval)
        }
        const interval = setInterval(() => {
            fetchData()
        }, 10000)
        setRefreshInterval(interval)
        return () => {
            clearInterval(interval)
        }
    }, [noLantai])

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4 text-center">
                {isLoading ? (
                    <div className="col-span-6 text-center">
                        <LoadingSpinner />
                        Memuat...
                    </div>
                ) : list.map((item) => {
                    const className = item.status === 'TSD' ? 'bg-green-500 text-white' : item.status === 'TRS' ? 'bg-yellow-500' : item.status === 'COT' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                    return (
                        <Button key={item.no_kamar} className={`${className} p-4 rounded block h-full`} variant="ghost" onClick={() => getDetailReservasi(item.reservasi)} style={{ height: "6rem" }}>
                            <div className="font-bold text-lg">{item.no_kamar}</div>
                            {item.status !== "UNV" && item.reservasi && <>
                                <div className="text-sm truncate">{item.reservasi.user_customer?.nama}</div>
                                <div className="text-sm">CO: {Formatter.formatDateShort(new Date(item.reservasi.departure_date))}</div>
                            </>}
                            {item.status === "UNV" && item.reservasi && <>
                                <div className="text-sm">Perawatan hingga</div>
                                <div className="text-sm">{Formatter.formatDateShort(new Date(item.reservasi.departure_date))}</div>
                            </>}
                        </Button>
                    )
                })}
            </div>

            <ModalDetailReservasi show={showDialog} onOpenChange={setShowDialog} data={detailReservasi} loading={detailLoading} />
        </>
    )
}