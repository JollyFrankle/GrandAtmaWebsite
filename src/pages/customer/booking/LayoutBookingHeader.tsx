import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { ApiResponse, UserCustomer, UserPegawai, apiAuthenticated } from "@/utils/ApiModels";
import Formatter from "@/utils/Formatter";
import { Skeleton } from "@/cn/components/ui/skeleton";
import "./LayoutBookingHeader.css"

import AbstractBG from "@/assets/images/abstract-bg.jpg"
import InlineLogo from "@/assets/images/gah-inline-logo.png"
import AuthHelper from "@/utils/AuthHelper";
import GeneralLoadingDialog from "@/components/GeneralLoadingDialog";
import { Button } from "@/cn/components/ui/button";
import ScrollToTop from "@/utils/ScrollToTop";

const urls = {
    getDeadline: ''
}

let interval: NodeJS.Timeout
export default function LayoutBookingHeader() {
    const params = useParams<{ idR: string, idC: string }>()
    const { idR, idC } = params

    const [user, setUser] = useState<UserCustomer | UserPegawai | null>(null);
    const [minimize, setMinimized] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [deadline, setDeadline] = useState<Date>();
    const [deadlineHMS, setDeadlineHMS] = useState({
        h: 0,
        m: 0,
        s: 0
    });
    const [showDeadline, setShowDeadline] = useState(false);
    const [ready, setReady] = useState(false);
    const [showModalExpired, setShowModalExpired] = useState(false);

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const getDeadline = () => {
        apiAuthenticated.get<ApiResponse<{ deadline: string, stage: number }>>(urls.getDeadline).then((res) => {
            const data = res.data
            const deadline = new Date(data.data.deadline)
            if (deadline.getTime() - new Date().getTime() > 24 * 60 * 60 * 1000) {
                // if > 24 hours, don't show the timer
                setShowDeadline(false)
            } else {
                // if < 24 hours, show the timer
                setDeadline(deadline)
                setShowDeadline(true)
            }

            // Navigate to the correct stage
            navigate(`/booking/${idC}/${idR}/step-${data.data.stage}`)

            setReady(true)
        })
    }

    const getDeadlineHMS = () => {
        if (!deadline) {
            return
        }
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
        if (diff < 0) {
            setShowModalExpired(true)
        }
    }

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 48) {
            setMinimized(true);
        } else {
            setMinimized(false);
        }
        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        if (deadline) {
            interval = setInterval(() => {
                getDeadlineHMS()
            }, 1000)
            getDeadlineHMS()
        }

        return () => clearInterval(interval)
    }, [deadline])

    useEffect(() => {
        const userC = AuthHelper.getUserCustomer()
        const userP = AuthHelper.getUserPegawai()
        if (userC) {
            urls.getDeadline = `customer/booking/${idR}/deadline`
            setUser(userC)
            getDeadline()
        } else if (userP) {
            urls.getDeadline = `pegawai/booking/${idR}/deadline`
            setUser(userP)
            getDeadline()
        } else {
            navigate("/login")
        }
    }, [])

    // if pathname ends-with 'step-4', remove the timer
    useEffect(() => {
        if (pathname.endsWith("step-4")) {
            setShowDeadline(false)
            clearInterval(interval)
        }
    }, [pathname])

    return user && <>
    <ScrollToTop />
    <header className="lg:sticky -top-24 transition-all z-50">
        <section className="pb-8 pt-8 shadow-lg data-[scrolled=true]:lg:pb-4 relative transition-all" data-scrolled={minimize}>
            <img src={AbstractBG} className="absolute top-0 left-0 w-full h-full pointer-events-none object-cover" />
            <div className="container relative block">
                <img src={InlineLogo} className="w-48 h-12 object-contain mb-8" />
                <div className="md:flex items-center justify-between">
                    <h3 className="text-3xl font-bold mb-4 md:mb-0">
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
                            <hr className="hidden md:block w-8 border-bottom-0" />
                        </li>

                        <li className="flex gap-4 items-center">
                            <NavLink onClick={(e) => e.preventDefault()} to="step-4" className={(active) => `steps-breadcrumb ${active.isActive ? "active" : ""} text-sm flex items-center`}>
                                <strong className="steps-number flex w-8 h-8 border rounded-full items-center justify-center me-2">4</strong>
                                Tanda Terima
                            </NavLink>
                        </li>
                    </ol>
                </div>
            </div>
        </section>
    </header>
    {showDeadline && (
        <section className="sticky top-0 z-50 lg:top-[4.25rem] bg-red-500 transition-all py-2 text-white justify-center">
            <div className="container text-center text-sm flex">
                <span className="me-2">Selesaikan pemesanan dalam</span>
                <strong className="bg-white text-red-600 w-6 text-center rounded">{Formatter.padZero(deadlineHMS.h)}</strong>
                <span className="mx-1">:</span>
                <strong className="bg-white text-red-600 w-6 text-center rounded">{Formatter.padZero(deadlineHMS.m)}</strong>
                <span className="mx-1">:</span>
                <strong className="bg-white text-red-600 w-6 text-center rounded">{Formatter.padZero(deadlineHMS.s)}</strong>
            </div>
        </section>
    )}
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

    <GeneralLoadingDialog show={showModalExpired} text={<div className="text-center max-w-96">
        <div className="text-lg font-bold mb-2">Waktu pemesanan habis</div>
        <div className="mb-4">Silakan ulangi pemesanan.</div>
        <div className="flex justify-center">
            <Button className="w-36" asChild>
                <Link to="/search">OK</Link>
            </Button>
        </div>
    </div>} />
    </>
}