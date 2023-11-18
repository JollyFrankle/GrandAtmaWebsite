import { ApiResponse, Kamar, apiAuthenticated } from "@/utils/ApiModels"
import { useEffect, useState } from "react"


interface AvailibilityResponse {
    kamar: Kamar,
    status: 'TSD' | 'TRS' | 'COT' | 'UNV'
}

export default function FOKetersediaanKamarPanel({

}: {

    }) {
    const [list, setList] = useState<AvailibilityResponse[]>([])

    const fetchData = () => {
        apiAuthenticated.get<ApiResponse<AvailibilityResponse[]>>(`pegawai/fo/ketersediaan`).then((res) => {
            const data = res.data
            console.log(data)
            setList(data.data)
        })
    }

    useEffect(() => {
        fetchData()
    }, [])
    return <div className="grid grid-cols-6 gap-4 mt-4 text-center">
        {list.map((item) => {
            const className = item.status === 'TSD' ? 'bg-green-500 text-white' : item.status === 'TRS' ? 'bg-yellow-500' : item.status === 'COT' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
            return (
                <div className={`${className} p-4 rounded`}>{item.kamar.no_kamar}</div>
            )
        })}
    </div>
}