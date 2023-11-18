import { Button } from "@/cn/components/ui/button";
import { Dialog, DialogContent, DialogFooter, dialogSizeByClass } from "@/cn/components/ui/dialog";
import { Skeleton } from "@/cn/components/ui/skeleton";
import IconInput from "@/components/IconInput";
import IconSelect from "@/components/IconSelect";
import IconTextarea from "@/components/IconTextarea";
import { ApiResponse, KeyValue, UserCustomer, apiAuthenticated } from "@/utils/ApiModels";
import { DialogTitle } from "@radix-ui/react-dialog";
import { BanIcon, BookUserIcon, BuildingIcon, CreditCardIcon, MailIcon, MapPinIcon, PhoneCallIcon, SaveIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalSaveConfirm from "../../../../components/modals/ModalSaveConfirm";

const emptyLTB: UserCustomer = {
    id: 0,
    type: 'g',
    nama: "",
    nama_institusi: "",
    no_identitas: "",
    jenis_identitas: "",
    no_telp: "",
    email: "",
    alamat: "",
}

export default function ModalCCustomerGroup({
    id,
    open,
    editable,
    onOpenChange,
    onSubmittedHandler
}: {
    id?: number,
    open: boolean,
    editable: boolean,
    onOpenChange: (open: boolean) => void,
    onSubmittedHandler: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<UserCustomer>(emptyLTB)
    const [errors, setErrors] = useState<KeyValue<string>|null>(null)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)

    const getDetail = () => {
        setLoading(true)
        apiAuthenticated.get<ApiResponse<UserCustomer>>(`pegawai/customer/${id}`).then((res) => {
            const data = res.data
            setData(data.data)
        }).finally(() => {
            setLoading(false)
        })
    }

    const showConfirmModalBeforeSaving = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setOpenModalConfirm(true)
    }

    const saveData = () => {
        const url = id ? `pegawai/customer/${id}` : `pegawai/customer`
        const method = id ? "PUT" : "POST"

        apiAuthenticated<ApiResponse<UserCustomer>>({
            method,
            url,
            data: data
        }).then((res) => {
            const data = res.data
            toast(data.message, {
                type: "success"
            })
            setErrors(null)
            onOpenChange(false)
            setData(emptyLTB)
            onSubmittedHandler()
        })
    }

    const onInputChangeHandler = (value: string, key: keyof typeof data) => {
        setData(prev => ({
            ...prev,
            [key]: value
        }))
    }

    useEffect(() => {
        if (id) {
            getDetail()
        } else {
            setData(emptyLTB)
        }
    }, [id])

    useEffect(() => {
        setErrors(null)
    }, [open])

    return <><Dialog open={open} onOpenChange={onOpenChange} modal={true}>
        {loading ? (
            <DialogContent className={dialogSizeByClass("lg")}>
                <Skeleton className="w-full h-16 mb-2" />
                <Skeleton className="w-3/4 h-8 mb-2" />
                <Skeleton className="w-5/6 h-10" />
            </DialogContent>
        ) : (
            <DialogContent className={dialogSizeByClass("lg")}>
                <form onSubmit={showConfirmModalBeforeSaving}>
                    <DialogTitle>
                        {editable ? id !== undefined ? "Edit Customer" : "Tambah Customer" : "Detail Customer"}
                    </DialogTitle>
                    <div className="lg:grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <h4 className="text-xl font-bold mb-2">Identitas</h4>
                            <IconInput
                                required
                                disabled={!editable}
                                value={data.nama}
                                icon={<UserIcon />}
                                type="text"
                                label="Nama"
                                maxLength={100}
                                onValueChange={(value) => onInputChangeHandler(value, "nama")}
                                errorText={errors?.nama} />

                            <IconInput
                                required
                                disabled={!editable}
                                value={data.nama_institusi}
                                icon={<BuildingIcon />}
                                type="text"
                                label="Nama Institusi"
                                maxLength={100}
                                onValueChange={(value) => onInputChangeHandler(value, "nama_institusi")}
                                errorText={errors?.nama_institusi} />

                            <IconSelect
                                required
                                disabled={!editable}
                                value={data.jenis_identitas}
                                icon={<CreditCardIcon />}
                                label="Jenis identitas"
                                onValueChange={(value) => onInputChangeHandler(value, "jenis_identitas")}
                                errorText={errors?.jenis_identitas}
                                values={[
                                    { value: "ktp", label: "KTP" },
                                    { value: "sim", label: "SIM" },
                                    { value: "paspor", label: "Paspor" }
                                ]} />

                            <IconInput
                                required
                                disabled={!editable}
                                value={data.no_identitas}
                                icon={<BookUserIcon />}
                                type="text"
                                label="Nomor identitas"
                                maxLength={20}
                                onValueChange={(value) => onInputChangeHandler(value, "no_identitas")}
                                errorText={errors?.no_identitas} />
                        </div>
                        <div className="col-span-1">
                            <h4 className="text-xl font-bold mb-2">Kontak</h4>
                            <IconInput
                                required
                                disabled={!editable}
                                value={data.email}
                                icon={<MailIcon />}
                                type="email"
                                label="Alamat e-mail"
                                maxLength={100}
                                onValueChange={(value) => onInputChangeHandler(value, "email")}
                                errorText={errors?.email} />

                            <IconInput
                                required
                                disabled={!editable}
                                value={data.no_telp}
                                icon={<PhoneCallIcon />}
                                type="text"
                                label="Nomor telepon"
                                maxLength={50}
                                onValueChange={(value) => onInputChangeHandler(value, "no_telp")}
                                errorText={errors?.no_telp} />

                            <IconTextarea
                                required
                                disabled={!editable}
                                value={data.alamat}
                                icon={<MapPinIcon />}
                                label="Alamat"
                                maxLength={254}
                                rows={3}
                                onValueChange={(value) => onInputChangeHandler(value, "alamat")}
                                errorText={errors?.alamat} />
                        </div>
                    </div>

                    {editable && (
                        <DialogFooter className="mt-4 gap2">
                            <Button type="button" onClick={() => onOpenChange(false)} variant="secondary"><BanIcon className="h-4 w-4 me-2" /> Batal</Button>
                            <Button type="submit"><SaveIcon className="w-4 h-4 me-2" /> Simpan</Button>
                        </DialogFooter>
                    )}
                </form>
            </DialogContent>
            )}
    </Dialog>

    <ModalSaveConfirm open={openModalConfirm} onOpenChange={setOpenModalConfirm} onConfirmed={saveData} />
    </>
}