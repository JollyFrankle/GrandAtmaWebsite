import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

import { Navigation, EffectCoverflow } from "swiper/modules"
import { Card, CardContent, CardFooter, CardHeader } from "@/cn/components/ui/card";
import { Grid2X2Icon, StarIcon, UserIcon } from "lucide-react";

import { ApiResponse, JenisKamar, apiPublic, getImage } from "@/utils/ApiModels";
import Formatter from "@/utils/Formatter";
import { Skeleton } from "@/cn/components/ui/skeleton";
import InlineLink from "@/components/InlineLink";

export default function SwiperListJenisKamar() {
    const [data, setData] = useState<Partial<JenisKamar>[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = () => {
        apiPublic.get<ApiResponse<Partial<JenisKamar>[]>>("public/jenis-kamar").then((res) => {
            const data = res.data
            setData(data.data)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return <Swiper
        className="overflow-visible mb-4"
        slidesPerView={"auto"}
        navigation={true}
        spaceBetween={32}
        coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        }}
        modules={[EffectCoverflow, Navigation]}
        grabCursor={true}
    >
        {!isLoading ? data.map((it, _) => (
            <SwiperSlide className="w-full max-w-sm" key={it.id}>
                <Card className="h-full overflow-auto">
                    <img src={getImage(it.gambar)} className="w-full h-60 object-cover" />
                    <CardHeader className="flex flex-row justify-between items-center">
                        <h3 className="text-lg font-bold">{it.nama}</h3>
                        <div className="flex items-center">
                            <StarIcon className="w-4 h-4 me-1 text-orange-400" />
                            {Formatter.formatNumber(it.rating!)}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-2">{it.short_desc}</p>
                        <InlineLink to={`/kamar/${it.id}`} className="text-sm">Selengkapnya</InlineLink>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Grid2X2Icon className="w-4 h-4 me-1" />
                            {Formatter.formatNumber(it.ukuran!)} meter<sup>2</sup>
                        </div>
                        <div className="flex items-center">
                            <UserIcon className="w-4 h-4 me-1" />
                            {it.kapasitas} Dewasa
                        </div>
                    </CardFooter>
                </Card>
            </SwiperSlide>
        )) : [...Array(5)].map((_, i) => (
            <SwiperSlide key={i} className="w-full max-w-sm h-96">
                <Skeleton className="w-full h-full" />
            </SwiperSlide>
        ))}
    </Swiper>
}