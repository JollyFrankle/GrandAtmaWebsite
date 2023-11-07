import { NavLink, Outlet } from "react-router-dom";
import "./LayoutBookingHeader.css"

import AbstractBG from "@/assets/images/abstract-bg.jpg"


export default function LayoutBookingHeader() {
    return <>
        <section className="pb-8 pt-32 shadow-lg relative">
            <img src={AbstractBG} className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-b-3xl object-cover" />
            <div className="container relative block md:flex items-center justify-between">
                <h3 className="text-3xl font-bold mb-4">
                    <mark>Reservasi</mark> Kamar
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
        <Outlet />
    </>
}