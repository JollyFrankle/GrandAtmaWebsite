import { Swiper, SwiperSlide } from "swiper/react"
import { Card, CardContent } from "@/cn/components/ui/card";
import ReservationDatePicker from "./components/ReservationDatePicker";
import { Button } from "@/cn/components/ui/button";
import GuestAmountPicker from "./components/GuestAmountPicker";
import InputWithIcon from "./components/InputWithIcon";
import { BabyIcon, BedIcon, CalendarIcon, SearchIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useToast } from "@/cn/components/ui/use-toast";

import "swiper/css"
import 'swiper/css/effect-creative';
import 'swiper/css/navigation';
import { EffectCreative, Navigation } from "swiper/modules"

import CoverImage from "@/assets/images/cover-image.jpg"
import Tugu from "@/assets/images/tugu-crop.png"
import Featured1 from "@/assets/images/pph_featured-1.png"
import Featured2 from "@/assets/images/pph_featured-2.png"
import Featured3 from "@/assets/images/pph_featured-3.jpg"
import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import SwiperListJenisKamar from "./components/SwiperListJenisKamar";
import ListFasilitasNormal from "./components/ListFasilitasNormal";
import SwiperListLayananTambahan from "./components/SwiperListLayananTambahan";

export default function PageHome() {
    const [inDate, setInDate] = useState<DateRange | undefined>(undefined)
    const [inDewasa, setInDewasa] = useState<string>()
    const [inAnak, setInAnak] = useState<string>()

    const { toast } = useToast()

    const onSubmit = () => {
        toast({
            title: "Berhasil!",
            description: "Kamar berhasil dipesan.",
            duration: 5000,
            variant: "destructive",
        })
    }

    usePageTitle("Grand Atma Hotel - Tempat Ternyaman Anda di Yogyakarta")
    return <>
        <section className="h-[80vh] w-full relative">
            <img src={CoverImage} className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-b-3xl shadow-lg object-cover" />
            <div className="absolute left-0 w-full z-10 bottom-32">
                <div className="container">
                    <h2 className="text-6xl inline-block px-3 py-1 -ms-3 mb-2 font-bold bg-accent-foreground text-accent"><span className="font-black">Grand Atma</span> Hotel</h2>
                    <h3 className="text-4xl text-primary-foreground">tempat <mark>ternyaman</mark> Anda di Yogyakarta.</h3>
                </div>
            </div>
            <div className="absolute left-0 w-full h-96 bottom-0 bg-gradient-to-t from-[#0000005d] to-transparent rounded-b-3xl"></div>
        </section>

        <section className="relative">
            <div className="lg:h-48 -mt-24">
                <div className="container h-full">
                    <Card className="w-full h-full rounded-3xl shadow-lg">
                        <CardContent className="py-6 h-full text-center">
                            <p className="mb-3 text-xl md:text-start">
                                <mark className="font-bold"><em>Sugeng rawuh!</em></mark> Rencanakan liburan Anda selanjutnya ditemani kami!
                            </p>
                            <div className="grid grid-cols-12 grid-flow-row gap-4 items-center">
                                <InputWithIcon icon={<CalendarIcon />} className="col-span-12 lg:col-span-4">
                                    <ReservationDatePicker className="ps-9" value={inDate} onChange={setInDate} />
                                </InputWithIcon>
                                <InputWithIcon icon={<UserIcon />} className="col-span-12 md:col-span-4 lg:col-span-2">
                                    <GuestAmountPicker className="ps-9" placeholder="Jumlah dewasa" onChange={setInDewasa} suffix="dewasa" max={10} />
                                </InputWithIcon>
                                <InputWithIcon icon={<BabyIcon />} className="col-span-12 md:col-span-4 lg:col-span-2">
                                    <GuestAmountPicker className="ps-9" placeholder="Jumlah anak" onChange={setInAnak} suffix="anak" max={10} />
                                </InputWithIcon>
                                <InputWithIcon icon={<BedIcon />} className="col-span-12 md:col-span-4 lg:col-span-2">
                                    <GuestAmountPicker className="ps-9" placeholder="Jumlah kamar" onChange={setInAnak} suffix="kamar" max={5} />
                                </InputWithIcon>
                                <Button className="col-span-12 lg:col-span-2 text-lg h-14" onClick={onSubmit}>
                                    <SearchIcon className="w-4 h-4 me-2" />
                                    Cari Kamar
                                </Button>
                            </div>
                            <div className="mt-3 text-md md:text-end">
                                Ingin memesan kamar untuk lebih dari 10 orang?
                                <Button variant="link" className="p-0 ms-2 text-md" asChild>
                                    <Link to="/docs">Hubungi kami</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <section>
            <div className="container relative py-10">
                <div className="shadow-xl md:my-12 p-5 px-14 md:py-10 md:px-20 md:w-1/2 relative">
                    <img src={Tugu} className="h-full absolute left-0 top-0 pointer-events-none opacity-75" />
                    <div className="text-center md:text-start">
                        <div className="md:py-24"></div>
                        <div className="my-2 text-muted-foreground md:flex items-center">
                            <span className="whitespace-nowrap">SALAM MANAJEMEN</span>
                            <hr className="ms-3 w-full hidden md:block" />
                        </div>
                        <div className="text-2xl">Selamat datang di</div>
                        <div className="my-2 text-5xl font-bold">Yogyakarta</div>
                        <div className="my-2 mt-4 text-2xl">Dengan gembira kami menyambut Anda di kota budaya ini! Mari menjelajahi kota budaya ini ditemani <mark>Grand Atma Hotel</mark>, hotel berbintang 4 di jantung kota Yogyakarta.</div>
                        <div className="text-orange-400 md:text-end select-none">
                            ★★★★
                        </div>
                    </div>
                </div>
                <Swiper
                    grabCursor={true}
                    effect={'creative'}
                    spaceBetween={24}
                    creativeEffect={{
                        prev: {
                            shadow: true,
                            translate: [0, 0, -400],
                        },
                        next: {
                            translate: ['100%', 0, 0],
                        },
                    }}
                    navigation={true}
                    modules={[EffectCreative, Navigation]}
                    className="overflow-visible !z-20 mt-8 max-w-[740px] md:!absolute md:bottom-12 md:right-6 md:top-4 md:mt-0 md:w-1/2 lg:right-8 lg:top-12 xl:right-10"
                >
                    <SwiperSlide className="shadow-lg">
                        <img src={Featured1} className="w-full h-full object-cover" />
                    </SwiperSlide>
                    <SwiperSlide className="shadow-lg">
                        <img src={Featured2} className="w-full h-full object-cover" />
                    </SwiperSlide>
                    <SwiperSlide className="shadow-lg">
                        <img src={Featured3} className="w-full h-full object-cover" />
                    </SwiperSlide>
                </Swiper>
            </div>
        </section>

        <section className="py-8 rounded-3xl shadow-lg bg-secondary text-secondary-foreground relative">
            <div className="container">
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-3"><mark>Akomodasi</mark> Eksklusif</h2>
                    <p className="text-lg mb-8">Grand Atma Hotel menyediakan 150 kamar dengan berbagai jenis dan ukuran untuk keperluan Anda.</p>
                </div>
                <SwiperListJenisKamar />
            </div>
        </section>

        <section className="py-10">
            <div className="container">
                <h2 className="text-4xl font-bold mb-3">Yang Kami <mark>Tawarkan</mark></h2>
                <div className=" grid grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-4">
                        <p className="text-lg mb-4">Setiap kamar sudah dilengkapi fasilitas dan layanan standard antara lain:</p>
                        <ListFasilitasNormal />
                    </div>
                    <div className="col-span-12 md:col-span-8 relative">
                        <SwiperListLayananTambahan className="md:absolute top-0 bottom-0 left-0 right-0" />
                    </div>
                </div>
            </div>
        </section>
    </>
}