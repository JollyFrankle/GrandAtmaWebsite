import { Button } from "@/cn/components/ui/button";
import { Dialog, DialogContent, DialogFooter, dialogSizeByClass } from "@/cn/components/ui/dialog"
import IconInput from "@/components/IconInput";
import IconTextarea from "@/components/IconTextarea";
import ImagePreview from "@/components/ImagePreview";
import { ApiResponse, KeyValue, FasilitasLayananTambahan, getImage, apiAuthenticated } from "@/utils/ApiModels";
import FormHelper from "@/utils/FormHelper";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AlignJustifyIcon, BanIcon, CaseSensitiveIcon, DollarSignIcon, Layers2Icon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalSaveConfirm from "../../../../components/modals/ModalSaveConfirm";
import ModalDialogLoading from "@/components/loading/ModalDialogLoading";

const emptyLTB: FasilitasLayananTambahan = {
    id: 0,
    nama: "",
    gambar: null,
    short_desc: "",
    satuan: "",
    tarif: 0,
    created_at: "",
    updated_at: ""
}

export default function ModalCUFasilitas({
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
    const [data, setData] = useState<FasilitasLayananTambahan>(emptyLTB)
    const [errors, setErrors] = useState<KeyValue<string>|null>(null)
    const [fGambar, setFGambar] = useState<File|null>(null)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)

    const getDetail = () => {
        setLoading(true)
        apiAuthenticated.get<ApiResponse<FasilitasLayananTambahan>>(`pegawai/fasilitas/${id}`).then((res) => {
            const data = res.data
            setData(data.data)
        }).finally(() => {
            setLoading(false)
        })
    }

    const postData = () => {
        const formData = FormHelper.toFormData(data)
        if (fGambar) {
            formData.append("gambar", fGambar)
        }

        apiAuthenticated.post<ApiResponse<FasilitasLayananTambahan>>(`pegawai/fasilitas`, formData).then((res) => {
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

    const showConfirmModalBeforeSaving = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setOpenModalConfirm(true)
    }

    const saveData = () => {
        const url = id ? `pegawai/fasilitas/${id}` : `pegawai/fasilitas`
        const method = id ? "PUT" : "POST"

        if (!id) {
            return postData()
        }

        apiAuthenticated<ApiResponse<FasilitasLayananTambahan>>({
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
        setFGambar(null)
        setErrors(null)
    }, [open])

    return <><Dialog open={open} onOpenChange={onOpenChange} modal={true}>
        {loading ? (
            <DialogContent className={dialogSizeByClass("lg")}>
                <ModalDialogLoading />
            </DialogContent>
        ) : (
            <DialogContent className={dialogSizeByClass("lg")}>
                <form onSubmit={showConfirmModalBeforeSaving}>
                    <DialogTitle>
                        {editable ? id !== undefined ? "Edit Fasilitas" : "Tambah Fasilitas" : "Detail Fasilitas"}
                    </DialogTitle>
                    {data.gambar && (
                        <div className="flex justify-center">
                            <img src={getImage(data.gambar)} className="w-full aspect-video rounded mb-4 object-cover" alt="Gambar Fasilitas" />
                        </div>
                    )}
                    <div className="lg:grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <IconInput
                                required
                                disabled={!editable}
                                value={data.nama}
                                icon={<CaseSensitiveIcon />}
                                type="text"
                                label="Nama"
                                maxLength={100}
                                onValueChange={(value) => onInputChangeHandler(value, "nama")}
                                errorText={errors?.nama} />

                            <IconTextarea
                                required
                                disabled={!editable}
                                value={data.short_desc}
                                icon={<AlignJustifyIcon />}
                                label="Deskripsi Singkat"
                                maxLength={254}
                                rows={5}
                                onValueChange={(value) => onInputChangeHandler(value, "short_desc")}
                                errorText={errors?.short_desc} />
                        </div>
                        <div className="col-span-1">
                            <IconInput
                                required
                                disabled={!editable}
                                value={data.satuan}
                                icon={<Layers2Icon />}
                                type="text"
                                label="Satuan"
                                maxLength={10}
                                onValueChange={(value) => onInputChangeHandler(value, "satuan")}
                                errorText={errors?.satuan} />

                            <IconInput
                                required
                                disabled={!editable}
                                value={data.tarif.toString()}
                                icon={<DollarSignIcon />}
                                type="number"
                                min={0}
                                label="Tarif"
                                onValueChange={(value) => onInputChangeHandler(value, "tarif")}
                                errorText={errors?.tarif} />

                        {(editable && !id) && <>
                            <ImagePreview file={fGambar} className="w-full aspect-video" showTitle={false} />
                            <IconInput
                                required
                                disabled={!editable}
                                icon={<DollarSignIcon />}
                                type="file"
                                label="Gambar"
                                accept="image/jpeg,image/png"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setFGambar(e.target.files[0])
                                    }
                                }}
                                errorText={errors?.tarif} />
                        </>}
                        </div>
                    </div>

                    {editable && (
                        <DialogFooter className="mt-4 gap-2">
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