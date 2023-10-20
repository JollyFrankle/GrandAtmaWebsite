import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/autoplay'

import { Navigation, EffectCoverflow, Autoplay } from "swiper/modules"
import axios from "axios";

import { ApiResponse, BASE_URL, LayananTambahan, getImage } from "@/utils/ApiModels";
import { Skeleton } from "@/cn/components/ui/skeleton";

export default function SwiperListLayananTambahan({
    className
}: {
    className?: string
}) {
    const [data, setData] = useState<LayananTambahan[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = () => {
        axios.get(BASE_URL + "/public/layanan-tambahan").then((res) => {
            const data = res.data as ApiResponse<LayananTambahan[]>
            setData(data.data)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return <Swiper
        className={className}
        navigation={true}
        spaceBetween={32}
        coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        }}
        modules={[EffectCoverflow, Navigation, Autoplay]}
        grabCursor={true}
        autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
        }}
    >
        {!isLoading ? data.map((it, _) => (
            <SwiperSlide className="relative card rounded-3xl overflow-hidden" key={it.id}>
                <img src={getImage(it.gambar)} className="absolute top-0 left-0 w-full h-full object-cover -z-10" />
                <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                    <span className="inline-block bg-accent-foreground text-accent px-3 py-1 text-xl font-bold">{it.nama}</span>
                    <div className="text-lg mt-2 text-background">{it.short_desc}</div>
                </div>
                <div className="absolute left-0 w-full h-96 bottom-0 bg-gradient-to-t from-[#00000088] to-transparent rounded-br-3xl rounded-bl-3xl"></div>
            </SwiperSlide>
        )) : [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full max-w-sm h-96" />
        ))}
    </Swiper>
}