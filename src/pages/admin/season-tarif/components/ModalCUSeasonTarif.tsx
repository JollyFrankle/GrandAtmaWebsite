import { Button } from "@/cn/components/ui/button";
import { Dialog, DialogContent, DialogFooter, dialogSizeByClass } from "@/cn/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/cn/components/ui/table";
import IconInput from "@/components/IconInput";
import IconSelect from "@/components/IconSelect";
import { ApiResponse, JenisKamar, KeyValue, Season, Tarif, apiAuthenticated } from "@/utils/ApiModels";
import Formatter from "@/utils/Formatter";
import { DialogTitle } from "@radix-ui/react-dialog";
import { BanIcon, CalendarClockIcon, CaseSensitiveIcon, CigaretteIcon, CoinsIcon, HotelIcon, PlusIcon, SaveIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalSaveConfirm from "../../../../components/modals/ModalSaveConfirm";
import ModalDialogLoading from "@/components/loading/ModalDialogLoading";

const emptySeason: Season = {
    id: 0,
    // @ts-ignore
    type: '',
    nama: "",
    tanggal_start: "",
    tanggal_end: "",
    created_at: "",
    updated_at: "",
    tarif: []
}

export default function ModalCUSeasonTarif({
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
    const [data, setData] = useState<Season>(emptySeason)
    const [errors, setErrors] = useState<KeyValue<string>|null>(null)
    const [listJenis, setListJenis] = useState<JenisKamar[]>()
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
    const [searchTarif, setSearchTarif] = useState("")
    const [filteredTarif, setFilteredTarif] = useState<Tarif[]>()

    const getDetail = () => {
        setLoading(true)
        apiAuthenticated.get<ApiResponse<Season>>(`pegawai/season/${id}`).then((res) => {
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
        const url = id ? `pegawai/season/${id}` : `pegawai/season`
        const method = id ? "PUT" : "POST"

        apiAuthenticated<ApiResponse<Season>>({
            method,
            url,
            data: data
        }).then((res) => {
            const data = res.data
            toast.success(data.message)
            setErrors(null)
            onOpenChange(false)
            setData(emptySeason)
            onSubmittedHandler()
        })
    }

    const getJenisKamar = () => {
        apiAuthenticated.get<ApiResponse<JenisKamar[]>>(`pegawai/kamar/jenis`).then((res) => {
            const data = res.data
            setListJenis(data.data)
        })
    }

    const onInputChangeHandler = (value: string, key: keyof typeof data) => {
        setData(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const onTarifChangeHandler = (value: string, key: keyof Tarif, index: number) => {
        setData(prev => ({
            ...prev,
            tarif: prev.tarif?.map((tarif, i) => i === index ? ({
                ...tarif,
                [key]: value
            }) : tarif)
        }))
    }

    const addTarif = () => {
        // @ts-ignore
        setData(prev => ({
            ...prev,
            tarif: [
                ...prev.tarif || [],
                {
                    id: 0,
                    id_jenis_kamar: "",
                    harga: "",
                    id_season: 0
                }
            ]
        }))
    }

    const removeTarif = (index: number) => {
        setData(prev => ({
            ...prev,
            tarif: prev.tarif?.filter((_, i) => i !== index)
        }))
    }

    useEffect(() => {
        if (id) {
            getDetail()
        } else {
            setData(emptySeason)
        }
    }, [id])

    useEffect(() => {
        setErrors(null)
        setSearchTarif("")
    }, [open])

    useEffect(() => {
        getJenisKamar()
    }, [])

    useEffect(() => {
        if (searchTarif.length > 0) {
            setFilteredTarif(data.tarif?.filter((tarif) => {
                const jenis = listJenis?.find((jenis) => jenis.id === +tarif.id_jenis_kamar ?? 0)
                return jenis?.nama.toLowerCase().includes(searchTarif.toLowerCase()) ?? false
            }))
        } else {
            setFilteredTarif(data.tarif)
        }
    }, [searchTarif, data.tarif])

    return <><Dialog open={open} onOpenChange={onOpenChange} modal={true}>
        {loading ? (
            <DialogContent className={dialogSizeByClass("lg")}>
                <ModalDialogLoading />
            </DialogContent>
        ) : (
            <DialogContent className={dialogSizeByClass("lg")}>
                <form onSubmit={showConfirmModalBeforeSaving}>
                    <DialogTitle>
                        {editable ? id !== undefined ? "Edit Season" : "Tambah Season" : "Detail Season"}
                    </DialogTitle>
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

                            <IconSelect
                                required
                                disabled={!editable}
                                value={data.type}
                                icon={<CigaretteIcon />}
                                label="Tipe musim"
                                onValueChange={(value) => onInputChangeHandler(value, "type")}
                                errorText={errors?.type}
                                values={[
                                    { label: "Low season", value: "l" },
                                    { label: "High season", value: "h" },
                                ]} />
                        </div>
                        <div className="col-span-1">
                            <IconInput
                                required
                                disabled={!editable}
                                value={data.tanggal_start && Formatter.dateToYMD(new Date(data.tanggal_start))}
                                icon={<CalendarClockIcon />}
                                type="date"
                                label="Tanggal mulai"
                                maxLength={10}
                                onValueChange={(value) => onInputChangeHandler(value, "tanggal_start")}
                                errorText={errors?.tanggal_start} />

                            <IconInput
                                required
                                disabled={!editable}
                                value={data.tanggal_end && Formatter.dateToYMD(new Date(data.tanggal_end))}
                                icon={<CalendarClockIcon />}
                                type="date"
                                label="Tanggal berakhir"
                                onValueChange={(value) => onInputChangeHandler(value, "tanggal_end")}
                                errorText={errors?.tanggal_end} />
                        </div>

                        <div className="col-span-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold">Tarif</h3>
                                {editable && <div className="flex">
                                    <IconInput
                                        value={searchTarif}
                                        icon={<SearchIcon />}
                                        type="text"
                                        placeholder="Cari Jenis Kamar"
                                        onValueChange={(value) => setSearchTarif(value)} />
                                    <Button variant="link" onClick={addTarif} type="button" >
                                        <PlusIcon className="w-4 h-4 me-2" /> Tambah
                                    </Button>
                                </div>}
                            </div>
                            <Table className="mb-4 min-w-[480px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[48px]">No.</TableHead>
                                        <TableHead>Jenis Kamar</TableHead>
                                        <TableHead>Tarif Normal</TableHead>
                                        <TableHead>Taris Musim</TableHead>
                                        {editable && (
                                            <TableHead className="w-8" />
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(filteredTarif?.length ?? 0) > 0 ? filteredTarif?.map((tarif, index) => {
                                        const selectedJenis = listJenis?.find((jenis) => jenis.id === +tarif.id_jenis_kamar ?? 0)
                                        return (
                                        <TableRow key={index}>
                                            <TableCell className="text-center">{index + 1}</TableCell>
                                            <TableCell>
                                            {editable ? (
                                                <IconSelect
                                                    className="mb-0"
                                                    required
                                                    disabled={!editable}
                                                    value={tarif.id_jenis_kamar.toString()}
                                                    icon={<HotelIcon />}
                                                    placeholder="Jenis Kamar"
                                                    onValueChange={(value) => onTarifChangeHandler(value, "id_jenis_kamar", index)}
                                                    values={listJenis?.map((jenis) => ({ label: jenis.nama, value: jenis.id.toString() }))} />
                                            ) : (
                                                selectedJenis?.nama ?? <em className="text-red-500">(tidak ada)</em>
                                            )}
                                            </TableCell>
                                            <TableCell>
                                                {Formatter.formatCurrency(selectedJenis?.harga_dasar ?? 0)}
                                            </TableCell>
                                            <TableCell>
                                                {editable ? (
                                                    <IconInput
                                                        className="mb-0"
                                                        required
                                                        disabled={!editable}
                                                        value={tarif.harga.toString()}
                                                        icon={<CoinsIcon />}
                                                        type="number"
                                                        min={0}
                                                        placeholder="Tarif per malam"
                                                        onValueChange={(value) => onTarifChangeHandler(value, "harga", index)}
                                                        errorText={errors?.nama} />
                                                ) : Formatter.formatCurrency(tarif.harga)}
                                            </TableCell>
                                            {editable && (
                                                <TableCell>
                                                    <Button type="button" variant="link" onClick={() => removeTarif(index)}>
                                                        <Trash2Icon className="w-4 h-4 -mx-2" />
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )}) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center">Tidak ada data.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            {errors?.tarif && (
                                <div className="text-red-500 text-sm mb-4">{errors.tarif}</div>
                            )}
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