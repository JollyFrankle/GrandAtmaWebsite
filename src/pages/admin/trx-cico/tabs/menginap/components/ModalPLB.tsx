import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"
import { Button } from "@/cn/components/ui/button"
import { Dialog, DialogContent, DialogTitle, dialogSizeByClass } from "@/cn/components/ui/dialog"
import { Skeleton } from "@/cn/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/cn/components/ui/table"
import ModalSaveConfirm from "@/components/modals/ModalSaveConfirm"
import { PBS1SelectedFasilitas } from "@/pages/customer/booking/step1/PageBookingStep1"
import BookingS1FasiltasItem from "@/pages/customer/booking/step1/components/BookingS1FasiltasItem"
import { ApiResponse, FasilitasLayananTambahan, Reservasi, apiAuthenticated, apiPublic } from "@/utils/ApiModels"
import { HelpingHandIcon, InfoIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"


export default function ModalPLB({
    open,
    reservasi,
    onOpenChange,
    onSubmittedHandler
}: {
    open: boolean,
    reservasi?: Reservasi,
    onOpenChange: (open: boolean) => void,
    onSubmittedHandler: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
    const [listFasilitas, setListFasilitas] = useState<FasilitasLayananTambahan[]>([])
    const [selectedFasilitas, setSelectedFasilitas] = useState<PBS1SelectedFasilitas[]>([])

    const showConfirmModalBeforeSaving = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setOpenModalConfirm(true)
    }

    const saveData = () => {
        setOpenModalConfirm(false)
        setLoading(true)
        apiAuthenticated.post<ApiResponse<null>>(`/pegawai/fo/pesan-layanan/${reservasi?.id}`, {
            layanan: selectedFasilitas.map((item) => ({
                id: item.id,
                qty: item.amount
            }))
        }).then((res) => {
            const data = res.data
            toast.success(data.message)
            onOpenChange(false)
            onSubmittedHandler()
        }).finally(() => {
            setLoading(false)
        })
    }

    const fetchFasilitas = async () => {
        setLoading(true)
        return apiPublic.get<ApiResponse<FasilitasLayananTambahan[]>>(`public/layanan-tambahan`).then((res) => {
            const data = res.data
            setListFasilitas(data.data)
        }).finally(() => {
            setLoading(false)
        })
    }

    const updateJumlahFasilitas = (id: number, amount: 1 | -1) => {
        const index = selectedFasilitas.findIndex((item) => item.id == id)
        if (index == -1) {
            setSelectedFasilitas(prev => {
                const newArr = [...prev]
                newArr.push({ id: id, amount: amount })
                return newArr
            })
        } else {
            setSelectedFasilitas(prev => {
                const newArr = [...prev]
                newArr[index].amount += amount
                if (newArr[index].amount <= 0) {
                    newArr.splice(index, 1)
                }
                return newArr
            })
        }
    }

    useEffect(() => {
        fetchFasilitas()
        setSelectedFasilitas([])
    }, [])

    return <>
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            {loading ? (
                <DialogContent className={dialogSizeByClass("lg")}>
                    <Skeleton className="w-full h-16 mb-2" />
                    <Skeleton className="w-3/4 h-8 mb-2" />
                    <Skeleton className="w-5/6 h-10" />
                </DialogContent>
            ) : (
                <DialogContent className={dialogSizeByClass("lg")}>
                    <DialogTitle className="mb-4">Pesan Layanan Tambahan</DialogTitle>

                    <Alert>
                        <InfoIcon className="w-4 h-4" />
                        <AlertTitle>
                            Informasi
                        </AlertTitle>
                        <AlertDescription>
                            <div>Pastikan Anda sudah mengecek ketersediaan fasilitas yang akan dipesan.</div>
                            <div className="font-bold">Fasilitas yang telah dipesan tidak dapat dibatalkan (dihapus).</div>
                        </AlertDescription>
                    </Alert>
                    <Table className="mb-4 -mx-4">
                        <TableBody>
                            <TableRow>
                                <TableHead>ID Booking</TableHead>
                                <TableCell>{reservasi?.id_booking}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableCell>{reservasi?.user_customer?.nama}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <form onSubmit={showConfirmModalBeforeSaving}>
                        <ul className="list-none mb-6 border rounded-lg overflow-auto shadow">
                            {listFasilitas?.map((item) => (
                                <BookingS1FasiltasItem
                                    item={item}
                                    onAmountChange={updateJumlahFasilitas}
                                    selectedFasilitas={selectedFasilitas.find((item2) => item2.id == item.id)}
                                    key={item.id}
                                    maxAmount={10} />
                            ))}
                        </ul>

                        <Button type="submit" className="w-full"><HelpingHandIcon className="w-4 h-4 me-2" /> Pesan untuk Customer</Button>
                    </form>
                </DialogContent>
            )}
        </Dialog>

        <ModalSaveConfirm open={openModalConfirm} onOpenChange={setOpenModalConfirm} onConfirmed={saveData}>
            <p className="mb-4">Apakah Anda yakin ingin menambahkan layanan berikut untuk <strong>{reservasi?.id_booking}</strong> (customer: {reservasi?.user_customer?.nama})?</p>

            <Alert variant="destructive">
                <InfoIcon className="w-4 h-4" />
                <AlertTitle>
                    Perhatian
                </AlertTitle>
                <AlertDescription>
                    <div>Fasilitas yang telah dipesan tidak dapat dibatalkan (dihapus).</div>
                </AlertDescription>
            </Alert>
        </ModalSaveConfirm>
    </>
}