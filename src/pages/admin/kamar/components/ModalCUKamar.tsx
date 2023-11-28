import { Button } from "@/cn/components/ui/button";
import { Dialog, DialogContent, DialogFooter, dialogSizeByClass } from "@/cn/components/ui/dialog";
import { Skeleton } from "@/cn/components/ui/skeleton";
import IconInput from "@/components/IconInput";
import IconSelect from "@/components/IconSelect";
import { ApiResponse, JenisKamar, Kamar, KeyValue, apiAuthenticated } from "@/utils/ApiModels";
import { DialogTitle } from "@radix-ui/react-dialog";
import { BanIcon, BedIcon, CigaretteIcon, FootprintsIcon, HashIcon, HotelIcon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalSaveConfirm from "../../../../components/modals/ModalSaveConfirm";

const emptyKamar: Kamar = {
    no_kamar: "",
    // @ts-ignore
    id_jenis_kamar: "",
    jenis_bed: "",
    // @ts-ignore
    no_lantai: "",
    // @ts-ignore
    is_smoking: "",
    created_at: "",
    updated_at: ""
}

export default function ModalCUKamar({
    id,
    open,
    editable,
    onOpenChange,
    onSubmittedHandler
}: {
    id?: string,
    open: boolean,
    editable: boolean,
    onOpenChange: (open: boolean) => void,
    onSubmittedHandler: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<Kamar>(emptyKamar)
    const [listJenis, setListJenis] = useState<JenisKamar[]>()
    const [errors, setErrors] = useState<KeyValue<string>|null>(null)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)

    const getDetail = () => {
        setLoading(true)
        apiAuthenticated.get<ApiResponse<Kamar>>(`pegawai/kamar/${id}`).then((res) => {
            const data = res.data
            setData(data.data)
            setErrors(null)
        }).finally(() => {
            setLoading(false)
        })
    }

    const getJenisKamar = () => {
        apiAuthenticated.get<ApiResponse<JenisKamar[]>>(`pegawai/kamar/jenis`).then((res) => {
            const data = res.data
            setListJenis(data.data)
        })
    }

    const showConfirmModalBeforeSaving = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setOpenModalConfirm(true)
    }

    const saveData = () => {
        const url = id ? `pegawai/kamar/${id}` : `pegawai/kamar`
        const method = id ? "PUT" : "POST"

        apiAuthenticated<ApiResponse<Kamar>>({
            method,
            url,
            data: {
                ...data,
                no_lantai: parseInt(data.no_lantai.toString()),
                is_smoking: parseInt(data.is_smoking.toString()),
                id_jenis_kamar: parseInt(data.id_jenis_kamar.toString())
            }
        }).then((_) => {
            // const data = res.data
            toast("Berhasil menyimpan data kamar.", {
                type: "success"
            })
            setErrors(null)
            onOpenChange(false)
            setData(emptyKamar)
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
            setData(emptyKamar)
        }
    }, [id])

    useEffect(() => {
        setErrors(null)
    }, [open])

    useEffect(() => {
        getJenisKamar()
    }, [])

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
                        {editable ? id !== undefined ? "Edit Kamar" : "Tambah Kamar" : "Detail Kamar"}
                    </DialogTitle>
                    <div className="lg:grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <IconInput
                                required
                                disabled={id !== undefined || !editable}
                                value={data.no_kamar}
                                icon={<HashIcon />}
                                type="text"
                                label="Nomor Kamar"
                                maxLength={4}
                                onValueChange={(value) => onInputChangeHandler(value, "no_kamar")}
                                errorText={errors?.no_kamar} />

                            <IconInput
                                required
                                disabled={!editable}
                                value={data.no_lantai.toString()}
                                icon={<FootprintsIcon />}
                                type="number"
                                label="Nomor Lantai"
                                max={4}
                                min={1}
                                onValueChange={(value) => onInputChangeHandler(value, "no_lantai")}
                                errorText={errors?.no_lantai} />

                            <IconSelect
                                required
                                disabled={!editable}
                                value={data?.is_smoking.toString()}
                                icon={<CigaretteIcon />}
                                label="Aturan Merokok"
                                onValueChange={(value) => onInputChangeHandler(value, "is_smoking")}
                                errorText={errors?.is_smoking}
                                values={[
                                    { label: "Non-smoking", value: "0" },
                                    { label: "Smoking", value: "1" },
                                ]} />
                        </div>
                        <div className="col-span-1">
                            <IconSelect
                                required
                                disabled={!editable}
                                value={data?.id_jenis_kamar.toString()}
                                icon={<HotelIcon />}
                                label="Jenis Kamar"
                                onValueChange={(value) => onInputChangeHandler(value, "id_jenis_kamar")}
                                errorText={errors?.id_jenis_kamar}
                                values={listJenis?.map((jenis) => ({ label: jenis.nama, value: jenis.id.toString() }))} />

                            <IconSelect
                                required
                                disabled={!editable}
                                value={data?.jenis_bed}
                                icon={<BedIcon />}
                                label="Jenis Bed"
                                onValueChange={(value) => onInputChangeHandler(value, "jenis_bed")}
                                errorText={errors?.jenis_bed}
                                values={[
                                    { label: "Double", value: "double" },
                                    { label: "Twin", value: "twin" },
                                    { label: "King", value: "king" }
                                ]} />
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