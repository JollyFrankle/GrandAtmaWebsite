import { Button } from "@/cn/components/ui/button";
import { Dialog, DialogContent, DialogFooter, dialogSizeByClass } from "@/cn/components/ui/dialog";
import { Skeleton } from "@/cn/components/ui/skeleton";
import IconInput from "@/components/IconInput";
import IconSelect from "@/components/IconSelect";
import { ApiResponse, KeyValue, UserPegawai, apiAuthenticated } from "@/utils/ApiModels";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AsteriskIcon, BanIcon, MailIcon, SaveIcon, UserCogIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalSaveConfirm from "../../../../components/modals/ModalSaveConfirm";

const emptyPegawai: UserPegawai = {
    // @ts-ignore
    id: "",
    role: "",
    nama: "",
    email: "",
    password: "",
}

export default function ModalCUPegawai({
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
    const [data, setData] = useState<UserPegawai>(emptyPegawai)
    const [errors, setErrors] = useState<KeyValue<string> | null>(null)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)

    const getDetail = () => {
        setLoading(true)
        apiAuthenticated.get<ApiResponse<UserPegawai>>(`pegawai/users/${id}`).then((res) => {
            const data = res.data
            setData(data.data)
            setErrors(null)
        }).finally(() => {
            setLoading(false)
        })
    }

    const showConfirmModalBeforeSaving = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setOpenModalConfirm(true)
    }

    const saveData = () => {
        const url = id ? `pegawai/users/${id}` : `pegawai/users`
        const method = id ? "PUT" : "POST"

        apiAuthenticated<ApiResponse<UserPegawai>>({
            method,
            url,
            data: data
        }).then((_) => {
            // const data = res.data
            toast.success("Berhasil menyimpan data pegawai.")
            setErrors(null)
            onOpenChange(false)
            setData(emptyPegawai)
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
            setData(emptyPegawai)
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
                        {editable ? id !== undefined ? "Edit Pegawai" : "Tambah Pegawai" : "Detail Pegawai"}
                    </DialogTitle>
                    <div className="lg:grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <IconSelect
                                required
                                disabled={!editable}
                                value={data.role}
                                icon={<UserCogIcon />}
                                label="Role"
                                onValueChange={(value) => onInputChangeHandler(value, "role")}
                                errorText={errors?.role}
                                values={[
                                    { label: "Sales & Management", value: "sm" },
                                    { label: "Admin", value: "admin" },
                                    { label: "Front Office (Resepsionis)", value: "fo" },
                                    { label: "General Manager", value: "gm" },
                                    { label: "Owner", value: "owner" }
                                ]} />

                            <IconInput
                                required
                                disabled={!editable}
                                value={data.nama}
                                icon={<UserIcon />}
                                type="text"
                                label="Nama Pegawai"
                                onValueChange={(value) => onInputChangeHandler(value, "nama")}
                                errorText={errors?.nama} />
                        </div>
                        <div className="col-span-1">
                            <IconInput
                                required
                                disabled={!editable}
                                value={data.email}
                                icon={<MailIcon />}
                                type="email"
                                label="Alamat Email"
                                onValueChange={(value) => onInputChangeHandler(value, "email")}
                                errorText={errors?.email} />

                            <IconInput
                                disabled={!editable}
                                value={data.password}
                                icon={<AsteriskIcon />}
                                type="password"
                                label="Kata Sandi"
                                onValueChange={(value) => onInputChangeHandler(value, "password")}
                                errorText={errors?.password} />
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