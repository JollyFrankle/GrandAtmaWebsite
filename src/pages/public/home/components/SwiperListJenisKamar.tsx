import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

import { Navigation, EffectCoverflow } from "swiper/modules"
import { Card, CardContent, CardFooter, CardHeader } from "@/cn/components/ui/card";
import { Button } from "@/cn/components/ui/button";
import { Link } from "react-router-dom";
import { Grid2X2Icon, StarIcon, UserIcon } from "lucide-react";
import axios from "axios";

import Featured1 from "@/assets/images/pph_featured-1.png"
import { ApiResponse, BASE_URL, JenisKamar, getImage } from "@/utils/ApiModels";
import Formatter from "@/utils/Formatter";
import { Skeleton } from "@/cn/components/ui/skeleton";

export default function SwiperListJenisKamar() {
    const [data, setData] = useState<Partial<JenisKamar>[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = () => {
        axios.get(BASE_URL + "/public/jenis-kamar").then((res) => {
            const data = res.data as ApiResponse<Partial<JenisKamar>[]>
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
                    <img src={getImage(it.gambar!!)} className="w-full h-60 object-cover" />
                    <CardHeader className="flex flex-row justify-between items-center">
                        <h3 className="text-lg font-bold">{it.nama}</h3>
                        <div className="flex items-center">
                            <StarIcon className="w-4 h-4 me-1 text-orange-400" />
                            {Formatter.formatNumber(it.rating!!)}
                        </div>

                    </CardHeader>
                    <CardContent className="flex flex-col justify-between h-full">
                        <p className="text-muted-foreground">{it.short_desc}</p>
                        <div className="flex justify-between items-center">
                            <Button className="text-sm p-0" variant="link" asChild>
                                <Link to="/docs">
                                    Selengkapnya
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Grid2X2Icon className="w-4 h-4 me-1" />
                            {Formatter.formatNumber(it.ukuran!!)} meter<sup>2</sup>
                        </div>
                        <div className="flex items-center">
                            <UserIcon className="w-4 h-4 me-1" />
                            {it.kapasitas} Dewasa
                        </div>
                    </CardFooter>
                </Card>
            </SwiperSlide>
        )) : [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full max-w-sm h-96" />
        ))}
    </Swiper>
}