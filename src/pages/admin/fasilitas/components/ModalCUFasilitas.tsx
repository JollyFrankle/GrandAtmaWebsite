import { Button } from "@/cn/components/ui/button";
import { Dialog, DialogContent, DialogFooter, dialogSizeByClass } from "@/cn/components/ui/dialog";
import { Skeleton } from "@/cn/components/ui/skeleton";
import IconInput from "@/components/IconInput";
import IconTextarea from "@/components/IconTextarea";
import { ApiErrorResponse, ApiResponse, BASE_URL, KeyValue, FasilitasLayananTambahan } from "@/utils/ApiModels";
import AuthHelper from "@/utils/AuthHelper";
import { DialogTitle } from "@radix-ui/react-dialog";
import axios from "axios";
import { AlignJustifyIcon, BanIcon, CaseSensitiveIcon, DollarSignIcon, Layers2Icon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

    const getDetail = () => {
        setLoading(true)
        axios.get(`${BASE_URL}/pegawai/fasilitas/${id}`, {
            headers: {
                Authorization: `Bearer ${AuthHelper.getToken()}`
            }
        }).then((res) => {
            const data = res.data as ApiResponse<FasilitasLayananTambahan>
            setData(data.data)
        }).catch((err) => {
            console.log(err)
            toast("Gagal memuat data fasilitas.", {
                type: "error"
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const saveData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const url = id ? `${BASE_URL}/pegawai/fasilitas/${id}` : `${BASE_URL}/pegawai/fasilitas`
        const method = id ? "PUT" : "POST"

        axios({
            method,
            url,
            headers: {
                Authorization: `Bearer ${AuthHelper.getToken()}`
            },
            data: data
        }).then((_) => {
            // const data = res.data as ApiResponse<Fasilitas>
            toast("Berhasil menyimpan data fasilitas.", {
                type: "success"
            })
            setErrors(null)
            onOpenChange(false)
            setData(emptyLTB)
            onSubmittedHandler()
        }).catch((err) => {
            console.log(err)
            toast("Gagal menyimpan data fasilitas.", {
                type: "error"
            })
            if (err.response) {
                const data = err.response.data as ApiErrorResponse
                setErrors(data.errors)
            }
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

    return <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
        {loading ? (
            <DialogContent className={dialogSizeByClass("lg")}>
                <Skeleton className="w-full h-16 mb-2" />
                <Skeleton className="w-3/4 h-8 mb-2" />
                <Skeleton className="w-5/6 h-10" />
            </DialogContent>
        ) : (
            <DialogContent className={dialogSizeByClass("lg")}>
                <form onSubmit={saveData}>
                    <DialogTitle>
                        {editable ? id !== undefined ? "Edit Fasilitas" : "Tambah Fasilitas" : "Detail Fasilitas"}
                    </DialogTitle>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                        </div>
                    </div>

                    {editable && (
                        <DialogFooter className="mt-4">
                            <Button type="button" onClick={() => onOpenChange(false)} variant="secondary" className="me-2"><BanIcon className="h-4 w-4 me-2" /> Batal</Button>
                            <Button type="submit"><SaveIcon className="w-4 h-4 me-2" /> Simpan</Button>
                        </DialogFooter>
                    )}
                </form>
            </DialogContent>
            )}
    </Dialog>
}