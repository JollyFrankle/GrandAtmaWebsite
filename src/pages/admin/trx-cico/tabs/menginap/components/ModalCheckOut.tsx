import { Dialog, DialogContent, DialogTitle, dialogSizeByClass } from "@/cn/components/ui/dialog"
import { ApiResponse, Invoice, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"
import { BanknoteIcon, InfoIcon, KeyRoundIcon } from "lucide-react"
import IconInput from "@/components/IconInput"
import { Button } from "@/cn/components/ui/button"
import ModalSaveConfirm from "@/components/modals/ModalSaveConfirm"
import { toast } from "react-toastify"
import { Checkbox } from "@/cn/components/ui/checkbox"
import ModalCetakInvoice from "./ModalCetakInvoice"
import CatatanKeuangan, { CatatanKeuanganResponse } from "./CatatanKeuangan"
import DetailCustomerMini from "./DetailCustomerMini"

export default function ModalCheckOut({
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
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
    const [detailCK, setDetailCK] = useState<CatatanKeuanganResponse>()
    const [total, setTotal] = useState(0)
    const [dibayar, setDibayar] = useState(0)
    const [inputUang, setInputUang] = useState("")
    const [checkKonfirmasi, setCheckKonfirmasi] = useState(false)
    const [openModalCetakInvoice, setOpenModalCetakInvoice] = useState(false)
    const [urlInvoice, setUrlInvoice] = useState("")

    const showConfirmModalBeforeSaving = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setOpenModalConfirm(true)
    }

    const saveData = () => {
        setBtnDisabled(true)
        apiAuthenticated.post<ApiResponse<{ reservasi: Reservasi, invoice: Invoice }>>(`/pegawai/fo/checkout/${reservasi?.id}`, {
            total_dibayar: (total - dibayar) > 0 ? +inputUang : -inputUang
        }).then((res) => {
            const data = res.data
            toast.success(data.message)

            onOpenChange(false)

            // Buka invoice
            const b64Id = btoa([data.data.reservasi.id, data.data.invoice.no_invoice].join(","))
            setUrlInvoice(b64Id)
            setOpenModalCetakInvoice(true)

            onSubmittedHandler()
        }).finally(() => {
            setBtnDisabled(false)
        })
    }

    useEffect(() => {
        if (open) {
            setInputUang("")
        }
    }, [open])

    return <>
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogContent className={dialogSizeByClass("lg")}>
                <DialogTitle className="mb-4">Check Out</DialogTitle>

                <Alert className="mb-2">
                    <InfoIcon className="w-4 h-4" />
                    <AlertTitle>
                        Informasi
                    </AlertTitle>
                    <AlertDescription>
                        <div>Pastikan semua kunci kamar telah diterima sebelum melakukan pelunasan pembayaran dan check out!</div>
                    </AlertDescription>
                </Alert>

                <DetailCustomerMini reservasi={reservasi} />

                <CatatanKeuangan
                    reservasi={reservasi}
                    onTotalDiBayarChange={(total, dibayar) => {
                        setTotal(total)
                        setDibayar(dibayar)
                    }}
                    onDetailCKChange={(detail) => {
                        setDetailCK(detail)

                        // Kalau masih di masa depan, maka harus konfirmasi
                        if (new Date(detail.reservasi.departure_date) > new Date()) {
                            setCheckKonfirmasi(false) // reset check konfirmasi
                        } else {
                            setCheckKonfirmasi(true)
                        }
                    }} />

                <form onSubmit={showConfirmModalBeforeSaving}>
                    <h4 className="text-xl font-bold mt-4 mb-2">Penyesuaian Pembayaran</h4>
                    <Alert className="mb-4">
                        <InfoIcon className="w-4 h-4" />
                        <AlertTitle>
                            Informasi
                        </AlertTitle>
                        <AlertDescription>
                            <div>Untuk memastikan uang yang dibayar/dikembalikan sesuai, silakan isikan input di bawah ini sesuai instruksi.</div>
                        </AlertDescription>
                    </Alert>
                    {(total - dibayar) > 0 ? <>
                        <div className="lg:flex items-center text-red-600 text-lg mb-2">
                            <div className="lg:w-56 shrink-0">Total Kekurangan:</div>
                            <div className="font-bold">{Formatter.formatCurrency(total - dibayar)}</div>
                        </div>

                        <div className="lg:flex items-center mb-4 text-lg">
                            <div className="lg:w-56 shrink-0">
                                <div>Uang yang Diterima:</div>
                                <div className="text-sm text-muted-foreground">Ketikkan ulang sesuai total di atas.</div>
                            </div>
                            <div className="w-full">
                                <IconInput
                                    size="lg"
                                    icon={<BanknoteIcon className="w-6 h-6" />}
                                    type="number"
                                    placeholder="Masukkan jumlah uang yang dibayar"
                                    value={inputUang}
                                    className="mb-1"
                                    disabled={btnDisabled}
                                    min={0}
                                    onValueChange={(val) => setInputUang(val)}
                                />
                                <p className="text-sm text-muted-foreground">Terbaca: <strong>{Formatter.formatCurrency(+inputUang)}</strong></p>
                            </div>
                        </div>
                    </> : <>
                        <div className="lg:flex items-center text-green-600 text-lg mb-2">
                            <div className="lg:w-56 shrink-0">Total Dikembalikan:</div>
                            <div className="font-bold">{Formatter.formatCurrency(dibayar - total)}</div>
                        </div>

                        <div className="lg:flex items-center mb-4 text-lg">
                            <div className="lg:w-56 shrink-0">
                                <div>Uang yang Dikembalikan:</div>
                                <div className="text-sm text-muted-foreground">Ketikkan ulang sesuai total di atas.</div>
                            </div>
                            <div className="w-full">
                                <IconInput
                                    size="lg"
                                    icon={<BanknoteIcon className="w-6 h-6" />}
                                    type="number"
                                    placeholder="Masukkan jumlah uang yang dikembalikan"
                                    value={inputUang}
                                    className="mb-1"
                                    disabled={btnDisabled}
                                    min={0}
                                    onValueChange={setInputUang}
                                />
                                <p className="text-sm text-muted-foreground">Terbaca: <strong>{Formatter.formatCurrency(+inputUang)}</strong></p>
                            </div>
                        </div>
                    </>}

                    {detailCK && new Date(detailCK.reservasi.departure_date) > new Date() && (
                        <Alert variant="destructive" className="mb-4">
                            <InfoIcon className="w-4 h-4" />
                            <AlertTitle>
                                Peringatan!
                            </AlertTitle>
                            <AlertDescription>
                                <div>Tanggal check out reservasi ini <strong>masih lebih awal dari tanggal seharusnya</strong>. Apakah Anda yakin customer ini benar-benar ingin melakukan check out?</div>
                                <div className="flex items-center space-x-2 mt-2 text-foreground">
                                    <Checkbox id="konfirmasi-co" onCheckedChange={(cc) => setCheckKonfirmasi(cc === true)} value={+checkKonfirmasi} />
                                    <label
                                        htmlFor="konfirmasi-co"
                                        className="cursor-pointer"
                                    >
                                        Customer ini benar-benar telah meminta check out lebih awal dari tanggal seharusnya
                                    </label>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    <Button className="w-full" type="submit" size="lg" disabled={+inputUang === 0 || !checkKonfirmasi || btnDisabled}>
                        <KeyRoundIcon className="w-5 h-5 me-2" /> Check Out
                    </Button>
                </form>

            </DialogContent>
        </Dialog>

        <ModalSaveConfirm open={openModalConfirm} onOpenChange={setOpenModalConfirm} onConfirmed={saveData} btnText="Check out">
            Apakah Anda yakin ingin melakukan check out untuk <strong>{reservasi?.id_booking}</strong> (customer: {reservasi?.user_customer?.nama})?
        </ModalSaveConfirm>

        <ModalCetakInvoice open={openModalCetakInvoice} urlInvoice={urlInvoice} onOpenChange={setOpenModalCetakInvoice} />
    </>
}