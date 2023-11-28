import { UserPegawai } from "@/utils/ApiModels"
import AuthHelper from "@/utils/AuthHelper"
import { useEffect, useState } from "react"
import AbstractBG from "@/assets/images//abstract-bg.jpg"


export default function PageDashboardGeneral() {

    const [user, setUser] = useState<UserPegawai>()

    useEffect(() => {
        setUser(AuthHelper.getUserPegawai()!!)
    }, [])

    return (
        <>
            <img src={AbstractBG} alt="Abstract background" className="select-none fixed top-0 left-0 right-0 bottom-0 w-full h-full object-cover opacity-50" />
            <div className="relative">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <p className="text-lg">Selamat datang,</p>
                <h2 className="text-2xl font-bold mb-4">{user?.nama}</h2>
                <p>Silakan langsung ke <em>navigation drawer</em> untuk melihat semua menu yang tersedia.</p>
            </div>
        </>
    )
}