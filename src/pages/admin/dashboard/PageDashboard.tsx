import GeneralLoadingDialog from "@/components/GeneralLoadingDialog";
import { UserPegawai } from "@/utils/ApiModels";
import AuthHelper from "@/utils/AuthHelper";
import { Suspense, lazy, useState } from "react";
import PageDashboardGeneral from "./all/PageDashboardGeneral";

const PageDashboardFO = lazy(() => import("./fo/PageDashboardFO"))

export default function PageDashboard() {
    const [user] = useState<UserPegawai>(AuthHelper.getUserPegawai()!!)

    return <Suspense fallback={ <GeneralLoadingDialog show={true}/> }>
        {user.role === "fo" ? <PageDashboardFO /> : <PageDashboardGeneral />}
    </Suspense>
}