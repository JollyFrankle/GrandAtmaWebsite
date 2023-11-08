import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import "./LayoutBookingHeader.css"

import AbstractBG from "@/assets/images/abstract-bg.jpg"
import { useEffect, useState } from "react";
import { ApiErrorResponse, ApiResponse, apiAuthenticated } from "@/utils/ApiModels";
import { toast } from "react-toastify";
import Formatter from "@/utils/Formatter";
import { Skeleton } from "@/cn/components/ui/skeleton";


export default function LayoutBookingHeader() {
    const params = useParams<{ id: string }>()
    const { id } = params

    const [minimize, setMinimized] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [deadline, setDeadline] = useState<Date>(new Date());
    const [deadlineHMS, setDeadlineHMS] = useState({
        h: 0,
        m: 0,
        s: 0
    });
    const [ready, setReady] = useState(false);

    const navigate = useNavigate()

    const getDeadline = () => {
        apiAuthenticated.get<ApiResponse<{ deadline: string, stage: number }>>(`customer/booking/${id}/deadline`).then((res) => {
            const data = res.data
            const deadline = new Date(data.data.deadline)
            setDeadline(deadline)

            // Navigate to the correct stage
            navigate(`/customer/booking/${id}/step-${data.data.stage}`)

            setReady(true)
        }).catch((err) => {
            if (err.response?.data) {
                const data = err.response.data as ApiErrorResponse
                toast.error(data.message)

                // if (data.errors?.ECODE === "RESERVASI_EXPIRED") {
                    navigate("/login")
                // }
            } else {
                toast.error("Terjadi kesalahan saat mengambil data")
            }
        })
    }

    const getDeadlineHMS = () => {
        const now = new Date()
        const diff = deadline.getTime() - now.getTime()
        const h = Math.floor(diff / 1000 / 60 / 60)
        const m = Math.floor(diff / 1000 / 60 % 60)
        const s = Math.floor(diff / 1000 % 60)
        setDeadlineHMS({
            h: h,
            m: m,
            s: s
        })
    }

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 48) {
            setMinimized(true);
        } else if (currentScrollY < 32) {
            setMinimized(false);
        }
        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const interval = setInterval(() => {
            getDeadlineHMS()
        }, 1000)

        return () => clearInterval(interval)
    }, [deadline])

    useEffect(() => {
        getDeadline()
    }, [])

    return <>
    <header className="lg:sticky -top-24 data-[scrolled=true]:z-50 transition-all" data-scrolled={minimize}>
        <section className="pb-8 pt-32 shadow-lg data-[scrolled=true]:lg:pb-4 data-[scrolled=true]:lg:pt-28 relative transition-all" data-scrolled={minimize}>
            <img src={AbstractBG} className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-b-3xl object-cover" />
            <div className="container relative block md:flex items-center justify-between">
                <h3 className="text-3xl font-bold mb-4 lg:mb-0">
                    <mark>Pemesanan</mark> Kamar
                </h3>

                {/* Breadcrumb */}
                <ol className="flex flex-col md:flex-row md:items-center gap-4 pointer-events-none">
                    <li className="flex gap-4 items-center">
                        <NavLink onClick={(e) => e.preventDefault()} to="step-1" className={(active) => `steps-breadcrumb ${active.isActive ? "active" : ""} text-sm flex items-center`}>
                            <strong className="steps-number flex w-8 h-8 border rounded-full items-center justify-center me-2">1</strong>
                            Pengisian Data
                        </NavLink>
                        <hr className="hidden md:block w-8 border-bottom-0" />
                    </li>

                    <li className="flex gap-4 items-center">
                        <NavLink onClick={(e) => e.preventDefault()} to="step-2" className={(active) => `steps-breadcrumb ${active.isActive ? "active" : ""} text-sm flex items-center`}>
                            <strong className="steps-number flex w-8 h-8 border rounded-full items-center justify-center me-2">2</strong>
                            Resume Pemesanan
                        </NavLink>
                        <hr className="hidden md:block w-8 border-bottom-0" />
                    </li>

                    <li className="flex gap-4 items-center">
                        <NavLink onClick={(e) => e.preventDefault()} to="step-3" className={(active) => `steps-breadcrumb ${active.isActive ? "active" : ""} text-sm flex items-center`}>
                            <strong className="steps-number flex w-8 h-8 border rounded-full items-center justify-center me-2">3</strong>
                            Pembayaran
                        </NavLink>
                    </li>
                </ol>
            </div>
        </section>
        <section className="sticky top-0 lg:static bg-red-500 hover:bg-red-600 transition-all py-2 text-white justify-center">
            <div className="container text-center text-sm flex">
                <span className="me-2">Selesaikan pemesanan dalam</span>
                <strong className="bg-white text-red-600 w-6 text-center rounded">{Formatter.padZero(deadlineHMS.h)}</strong>
                <span className="mx-1">:</span>
                <strong className="bg-white text-red-600 w-6 text-center rounded">{Formatter.padZero(deadlineHMS.m)}</strong>
                <span className="mx-1">:</span>
                <strong className="bg-white text-red-600 w-6 text-center rounded">{Formatter.padZero(deadlineHMS.s)}</strong>
            </div>
        </section>
    </header>
    {ready ? <Outlet /> : (
        <div className="container py-8">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-8">
                    <Skeleton className="h-96" />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <Skeleton className="h-24" />
                        </div>
                        <div className="col-span-12">
                            <Skeleton className="h-24" />
                        </div>
                        <div className="col-span-12">
                            <Skeleton className="h-24" />
                        </div>
                        <div className="col-span-12">
                            <Skeleton className="h-24" />
                        </div>
                        <div className="col-span-12">
                            <Skeleton className="h-24" />
                        </div>
                        <div className="col-span-12">
                            <Skeleton className="h-24" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
    </>
}