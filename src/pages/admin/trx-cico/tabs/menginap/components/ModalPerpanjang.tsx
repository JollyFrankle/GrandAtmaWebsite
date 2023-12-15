import { Dialog, DialogContent, DialogTitle, dialogSizeByClass } from "@/cn/components/ui/dialog"
import { ApiResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import { useEffect, useState } from "react"
import DetailCustomerMini from "./DetailCustomerMini"
import IconInput from "@/components/IconInput"
import { CalendarClock, Clock2Icon, InfoIcon } from "lucide-react"
import Formatter from "@/utils/Formatter"
import { Button } from "@/cn/components/ui/button"
import ModalSaveConfirm from "@/components/modals/ModalSaveConfirm"
import { toast } from "react-toastify"
import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"


export default function ModalPerpanjang({
    open,
    reservasi,
    onOpenChange,
    onSubmittedHandler
}: {
    open: boolean,
    reservasi?: Reservasi,
    onOpenChange: (open: boolean) => void
    onSubmittedHandler: () => void
}) {
    const [inputJlhMalam, setInputJlhMalam] = useState("")
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [tglCO, setTglCO] = useState("")
    const [openModalConfirm, setOpenModalConfirm] = useState(false)

    const onInputJlhMalamChangeHandler = (val: string) => {
        if (!reservasi) {
            return
        }
        const num = +val
        setInputJlhMalam(val)

        const tglCO = new Date(reservasi.departure_date)
        // add num days
        tglCO.setDate(tglCO.getDate() + num)

        setTglCO(Formatter.formatDate(tglCO))
    }

    const showConfirmModalBeforeSaving = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setOpenModalConfirm(true)
    }

    const saveData = () => {
        setBtnDisabled(true)
        apiAuthenticated.post<ApiResponse<Reservasi>>(`/pegawai/fo/perpanjang/${reservasi?.id}`, {
            jumlah_malam: +inputJlhMalam
        }).then((res) => {
            const data = res.data
            toast.success(data.message)

            onOpenChange(false)

            onSubmittedHandler()
        }).finally(() => {
            setBtnDisabled(false)
        })
    }

    useEffect(() => {
        onInputJlhMalamChangeHandler("0")
    }, [reservasi])

    return <>
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogContent className={dialogSizeByClass("lg")}>
                <DialogTitle className="mb-4">Perpanjangan (<em>Extension</em>) Durasi Menginap</DialogTitle>

                <DetailCustomerMini reservasi={reservasi} />

                <form onSubmit={showConfirmModalBeforeSaving}>
                    <h4 className="text-xl font-bold mt-4 mb-2">Pengaturan Perpanjangan (<em>Extension</em>):</h4>

                    <div className="lg:flex items-center text-lg mb-2">
                        <div className="lg:w-56 shrink-0">Jumlah Malam:</div>
                        <div className="font-bold w-full">
                            <IconInput
                                size="lg"
                                icon={<CalendarClock className="w-6 h-6" />}
                                type="number"
                                placeholder="Masukkan jumlah malam perpanjangan"
                                value={inputJlhMalam}
                                className="mb-1"
                                disabled={btnDisabled}
                                min={0}
                                max={7}
                                onValueChange={onInputJlhMalamChangeHandler}
                            />
                        </div>
                    </div>

                    <div className="lg:flex items-center text-lg mb-4">
                        <div className="lg:w-56 shrink-0">Tanggal Check Out:</div>
                        <div className="font-bold w-full">{tglCO}</div>
                    </div>

                    <Alert className="mb-4">
                        <InfoIcon className="w-4 h-4" />
                        <AlertTitle>
                            Perhatian!
                        </AlertTitle>
                        <AlertDescription>
                            <div className="font-bold">Semua kamar akan diperpanjang durasi menginapnya!</div>
                            <div>Jika customer ingin hanya salah satu (tidak semua) kamar diperpanjang, diimbau untuk melakukan pemesanan ulang secara mandiri.</div>
                            <div>Setelah Anda mengonfirmasi perpanjangan, perpanjangan tidak dapat lagi dibatalkan (dikembalikan ke semula).</div>
                        </AlertDescription>
                    </Alert>

                    <Button className="w-full" type="submit" size="lg" disabled={+inputJlhMalam === 0 || btnDisabled}>
                        <Clock2Icon className="w-5 h-5 me-2" /> Perpanjang
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

        <ModalSaveConfirm open={openModalConfirm} onOpenChange={setOpenModalConfirm} onConfirmed={saveData} btnText="Perpanjang">
            Apakah Anda yakin ingin melakukan perpanjangan durasi menginap untuk <strong>{reservasi?.id_booking}</strong> (customer: {reservasi?.user_customer?.nama})?
        </ModalSaveConfirm>
    </>
}