import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/cn/components/ui/tabs";
import useQuery from "@/hooks/useQuery";
import { LogInIcon, LogOutIcon, UserCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import TabWaitingCI from "./tabs/waiting-ci/TabWaitingCI";
import TabMenginap from "./tabs/menginap/TabMenginap";
import TabCheckedOut from "./tabs/checked-out/TabCheckedOut";


export default function PageTrxCICO() {
    const query = useQuery()
    const [selectedTab, setSelectedTab] = useState("current")


    useEffect(() => {
        if (query.get("tab")) {
            setSelectedTab(query.get("tab")!)
        }
    }, [query])

    return <>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Transaksi Menginap</h1>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="h-fit p-2 w-full flex flex-col md:flex-row">
                <TabsTrigger value="waiting-ci" className="text-lg px-4 flex-1"><LogInIcon className="w-5 h-5 me-2" /> Menunggu Check In</TabsTrigger>
                <TabsTrigger value="current" className="text-lg px-4 flex-1"><UserCheckIcon className="w-5 h-5 me-2" /> Sedang Menginap</TabsTrigger>
                <TabsTrigger value="checked-out" className="text-lg px-4 flex-1"><LogOutIcon className="w-5 h-5 me-2" /> Selesai Check Out</TabsTrigger>
            </TabsList>
            <TabsContent value="waiting-ci">
                <TabWaitingCI />
            </TabsContent>
            <TabsContent value="current">
                <TabMenginap />
            </TabsContent>
            <TabsContent value="checked-out">
                <TabCheckedOut />
            </TabsContent>
        </Tabs>
    </>
}