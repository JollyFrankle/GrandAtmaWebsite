import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

export default function PageHome() {
    return <Swiper
        style={{ height: '80vh'}}
        loop={true}
    >
        <SwiperSlide>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <h1 className="text-4xl font-bold">shadcn/ui</h1>
                        <p className="text-xl">A collection of accessible, reusable, and composable React components for building interactive user interfaces.</p>
                    </div>
                    <div className="col-12 col-md-6">
                        {/* <img src="https://raw.githubusercontent.com/shadcn/ui/main/docs/assets/hero.svg" alt="shadcn/ui" /> */}
                    </div>
                </div>
            </div>
        </SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
    </Swiper>
}