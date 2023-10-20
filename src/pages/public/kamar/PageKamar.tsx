import { useToast } from "@/cn/components/ui/use-toast";
import { ApiResponse, BASE_URL, JenisKamar, getImage } from "@/utils/ApiModels";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RoomSearch from "../_layout/components/RoomSearch";
import InfoPentingRow from "./components/InfoPentingRow";
import { Skeleton } from "@/cn/components/ui/skeleton";


export default function PageKamar() {
    const params = useParams<{ id: string }>()
    const { id } = params

    const [data, setData] = useState<JenisKamar>()
    const [isLoading, setIsLoading] = useState(true)

    const { toast } = useToast()

    const fetchData = () => {
        axios.get(BASE_URL + "/public/jenis-kamar/" + id).then((res) => {
            const data = res.data as ApiResponse<JenisKamar>
            setData(data.data)
            setIsLoading(false)
        }).catch((err) => {
            toast({
                title: "Error",
                content: err,
                variant: "destructive"
            })
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return <>
        <section className="h-[80vh] w-full relative">
            {isLoading ? (
                <Skeleton className="w-full h-full bg-gray-300" />
            ) : (
                <img src={getImage(data?.gambar!!)} className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-b-3xl shadow-lg object-cover" />
            )}
            <div className="absolute left-0 w-full z-10 bottom-32">
                <div className="container">
                    {isLoading ? (
                        <>
                            <Skeleton className="w-[250px] h-10 mb-3" />
                            <Skeleton className="w-[400px] h-16" />
                        </>
                    ) : (
                        <>
                            <h3 className="text-4xl text-primary-foreground">Jenis kamar</h3>
                            <h2 className="text-6xl inline-block px-3 py-1 -ms-3 mb-2 font-bold text-background">{data?.nama}</h2>
                        </>
                    )}
                </div>
            </div>
            <div className="absolute left-0 w-full h-96 bottom-0 bg-gradient-to-t from-[#0000005d] to-transparent rounded-b-3xl"></div>
        </section>

        <section className="relative">
            <div className="lg:h-48 -mt-24">
                <div className="container h-full">
                    <RoomSearch />
                </div>
            </div>
        </section>

    {!isLoading ? (
        <section className="container py-10">
            <div className=" border-s-8 border-accent-foreground ps-8 text-2xl leading-10 mb-6">
                {data?.short_desc}
            </div>
            <InfoPentingRow data={data} className="my-8 text-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <h3 className="text-2xl font-bold mb-3">Rincian Kamar</h3>
                    <ul className="list-disc ms-5 text-lg">
                        {data?.rincian.map((it, i) => (
                            <li key={i}>{it}</li>
                        ))}
                    </ul>
                </div>
                <div className="col-span-1">
                    <h3 className="text-2xl font-bold mb-3">Fasilitas</h3>
                    <ul className="list-disc ms-5 text-lg">
                        {data?.fasilitas && Object.keys(data?.fasilitas).map((it, i) => (
                            <li key={i} className="mb-3">
                                <p className="font-bold">{it}</p>
                                <p className="text-muted-foreground">{data?.fasilitas[it]}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    ) : (
        <section className="container py-10 text-center text-muted-foreground text-xl">
            Memuat...
        </section>
    )}
    </>
}