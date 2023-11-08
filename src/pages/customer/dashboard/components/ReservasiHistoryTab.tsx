import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/cn/components/ui/tabs";
import ListReservasi from "./ListReservasi";
import { UserCustomer } from "@/utils/ApiModels";


export default function ReservasiHistoryTab({
    idCustomer,
    onUserFetched,
    onDetailClick
}: {
    idCustomer?: number,
    onUserFetched?: (user: UserCustomer) => void,
    onDetailClick: (id: number) => void
}) {
    return (
        <Tabs defaultValue="upcoming">
            <TabsList className="h-fit p-2 w-full flex flex-col md:flex-row">
                <TabsTrigger value="upcoming" className="text-lg px-4 flex-1">Aktif & Mendatang</TabsTrigger>
                <TabsTrigger value="completed" className="text-lg px-4 flex-1">Selesai</TabsTrigger>
                <TabsTrigger value="cancelled" className="text-lg px-4 flex-1">Batal & Kedaluarsa</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
                <ListReservasi status="upcoming" idCustomer={idCustomer} onDetailClick={onDetailClick} onUserFetched={onUserFetched} />
            </TabsContent>
            <TabsContent value="completed">
                <ListReservasi status="completed" idCustomer={idCustomer} onDetailClick={onDetailClick} onUserFetched={onUserFetched} />
            </TabsContent>
            <TabsContent value="cancelled">
                <ListReservasi status="cancelled" idCustomer={idCustomer} onDetailClick={onDetailClick} onUserFetched={onUserFetched} />
            </TabsContent>
        </Tabs>
    )
}