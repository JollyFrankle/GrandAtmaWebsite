import { Button } from "@/cn/components/ui/button";
import DataTable from "@/components/DataTable";
import usePageTitle from "@/hooks/usePageTitle";
import { ApiResponse, FasilitasLayananTambahan, apiAuthenticated, getImage } from "@/utils/ApiModels";
import AuthHelper from "@/utils/AuthHelper";
import { EditIcon, EyeIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalCUFasilitas from "./components/ModalCUFasilitas";
import ModalDelete from "../_layout/components/ModalDelete";
import Formatter from "@/utils/Formatter";
import { useNavigate } from "react-router-dom";


export default function PageFasilitas() {
    const [tableData, setTableData] = useState<FasilitasLayananTambahan[]>([])
    const [currentData, setCurrentData] = useState<FasilitasLayananTambahan>()
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const navigate = useNavigate()

    usePageTitle("Fasilitas dan Layanan Berbayar - Grand Atma Hotel")

    const fetchTableData = () => {
        setTableLoading(true)
        apiAuthenticated.get<ApiResponse<FasilitasLayananTambahan[]>>(`pegawai/fasilitas`).then((res) => {
            const data = res.data
            setTableData(data.data)
        }).catch((err) => {
            console.log(err)
            toast("Gagal memuat data fasilitas.", {
                type: "error"
            })
        }).finally(() => {
            setTableLoading(false)
        })
    }

    const deleteFasilitas = () => {
        apiAuthenticated.delete<ApiResponse<null>>(`pegawai/fasilitas/${currentData?.id}`).then((res) => {
            const data = res.data
            toast(data.message, {
                type: "success"
            })
            fetchTableData()
        }).catch((err) => {
            console.log(err)
            toast("Gagal menghapus fasilitas.", {
                type: "error"
            })
        })
    }

    useEffect(() => {
        if(AuthHelper.authorize(["sm"])) {
            fetchTableData()
        } else {
            toast("Anda tidak memiliki akses ke halaman ini. Kejadian ini telah dilaporkan.", {
                type: "error"
            })
            navigate("/admin/")
        }
    }, [])

    return <>
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Fasilitas/Layanan Berbayar</h1>
            <Button onClick={() => {
                setCurrentData(undefined)
                setIsEditing(true)
                setOpenModalDetail(true)
            }}>
                <PlusIcon className="w-4 h-4 me-2" /> Tambah
            </Button>
        </div>

        <DataTable<FasilitasLayananTambahan> data={tableData} columns={[
            {
                field: "gambar",
                header: "Gambar",
                cell: (row) => row.gambar && <img src={getImage(row.gambar)} alt={row.nama} className="w-48 h-32 object-cover rounded" />
            },
            {
                field: "nama",
                header: "Nama Layanan",
                enableSorting: true,
            },
            {
                field: "satuan",
                header: "Satuan",
                enableSorting: true
            },
            {
                field: "tarif",
                header: "Tarif",
                enableSorting: true,
                cell: (row) => Formatter.formatCurrency(row.tarif)
            }
        ]} actions={[[
            {
                action: <><EyeIcon className="w-4 h-4 me-2" /> Lihat</>,
                onClick(row) {
                    setCurrentData(row)
                    setIsEditing(false)
                    setOpenModalDetail(true)
                },
            },
            {
                action: <><EditIcon className="w-4 h-4 me-2" /> Edit</>,
                onClick(row) {
                    setCurrentData(row)
                    setIsEditing(true)
                    setOpenModalDetail(true)
                },
            },
            {
                action: <><Trash2Icon className="w-4 h-4 me-2" /> Hapus</>,
                onClick(row) {
                    setCurrentData(row)
                    setOpenModalDelete(true)
                },
            }
        ]]} isLoading={tableLoading} />

        <ModalCUFasilitas id={currentData?.id} editable={isEditing} open={openModalDetail} onOpenChange={setOpenModalDetail} onSubmittedHandler={() => { fetchTableData(); setCurrentData(undefined) }} />
        <ModalDelete open={openModalDelete} onOpenChange={setOpenModalDelete} onConfirmed={deleteFasilitas}>
            <p className="mb-3">Apakah Anda yakin ingin menghapus fasilitas ini?</p>
            <p className="text-xl font-bold">{currentData?.nama}</p>
        </ModalDelete>
    </>
}