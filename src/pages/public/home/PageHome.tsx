import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import 'swiper/css/effect-creative';

import { EffectCreative, Navigation } from "swiper/modules"

import CoverImage from "@/assets/images/cover-image.jpg"
import { Card, CardContent } from "@/cn/components/ui/card";

export default function PageHome() {
    return <>
        <section className="h-[80vh] w-full relative">
            <img src={CoverImage} className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-br-3xl rounded-bl-3xl shadow-lg object-cover" />
            <div className="absolute left-0 w-full z-10 bottom-28">
                <div className="container">
                    <h2 className="text-6xl mb-2 font-bold text-primary-foreground"><mark>Grand Atma</mark> Hotel</h2>
                    <h3 className="text-4xl text-primary-foreground">tempat <mark>ternyaman</mark> Anda di Yogyakarta.</h3>
                </div>
            </div>
            <div className="absolute left-0 w-full h-96 bottom-0 bg-gradient-to-t from-[#0000005d] to-transparent rounded-br-3xl rounded-bl-3xl"></div>
            {/* a card 50% below this section to reserve room */}
            <div className="absolute left-0 w-full md:h-32 md:-bottom-16">
                <div className="container h-full">
                    <Card className="w-full h-full rounded-3xl shadow-lg">
                        <CardContent className="flex flex-row items-center justify-between py-4">
                            123
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
        <section className="container py-8 relative">
            <div className="z-10 mx-auto max-w-screen-2xl my-4 md:my-8">
                {/* <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-hidden bg-surface-1 shadow-2xl md:w-[calc(50%+32px)]"></div> */}
                <div className="shadow-lg p-5 md:p-10 md:w-1/2">
                    <div className="mt-8 text-5xl font-bold">Jogja...</div>
                    <div className="my-2 mt-4 text-2xl">terbuat dari rindu, pulang, dan angkringan.</div>
                    <div className="mt-6">
                        <a className="inline-block rounded-lg bg-primary px-6 py-5 font-bold duration-200 hover:bg-primary-shade hover:no-underline active:rounded-xl text-primary-foreground" href="/get-started">Get Started</a>
                    </div>
                </div>
            </div>
            <Swiper
                grabCursor={true}
                effect={'creative'}
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
                className="!z-20 mt-8 max-w-[740px] md:!absolute md:bottom-12 md:right-6 md:top-4 md:mt-0 md:w-1/2 lg:right-8 lg:top-12 xl:right-10"
                modules={[EffectCreative, Navigation]}
            >
                <SwiperSlide className="bg-secondary">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsfGVufDB8fDB8fHww" className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsfGVufDB8fDB8fHww" className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsfGVufDB8fDB8fHww" className="w-full h-full object-cover" />
                </SwiperSlide>
            </Swiper>
        </section>
    </>
}