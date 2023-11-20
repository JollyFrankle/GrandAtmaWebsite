import GeneralLoadingDialog from "@/components/GeneralLoadingDialog";
import { UserPegawai } from "@/utils/ApiModels";
import AuthHelper from "@/utils/AuthHelper";
import { Suspense, lazy, useState } from "react";

const PageDashboardFO = lazy(() => import("./fo/PageDashboardFO"))

export default function PageDashboard() {
    const [user] = useState<UserPegawai>(AuthHelper.getUserPegawai()!!)

    // useEffect(() => {
    //     console.log(user)
    // }, [user])

    return <Suspense fallback={ <GeneralLoadingDialog show={true}/> }>
        {user.role === "fo" ? <PageDashboardFO /> : <>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p>Selamat datang. Silakan langsung ke <em>navigation drawer</em> untuk melihat semua menu yang tersedia.</p>
        </>}
    </Suspense>
}