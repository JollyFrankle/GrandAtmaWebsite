import { Button } from "@/cn/components/ui/button";
import DataTable from "@/components/DataTable";
import usePageTitle from "@/hooks/usePageTitle";
import { ApiResponse, BASE_URL, Kamar } from "@/utils/ApiModels";
import AuthHelper from "@/utils/AuthHelper";
import axios from "axios";
import { EditIcon, EyeIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalCUKamar from "./components/ModalCUKamar";
import ModalDelete from "../_layout/components/ModalDelete";


export default function PageKamar() {
    const [tableData, setTableData] = useState<Kamar[]>([])
    const [currentData, setCurrentData] = useState<Kamar>()
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)

    usePageTitle("Kamar - Grand Atma Hotel")

    const fetchTableData = () => {
        axios.get(`${BASE_URL}/pegawai/kamar`, {
            headers: {
                Authorization: `Bearer ${AuthHelper.getToken()}`
            }
        }).then((res) => {
            const data = res.data as ApiResponse<Kamar[]>
            setTableData(data.data)
        }).catch((err) => {
            console.log(err)
            toast("Gagal memuat data kamar.", {
                type: "error"
            })
        })
    }

    const deleteKamar = () => {
        axios.delete(`${BASE_URL}/pegawai/kamar/${currentData?.no_kamar}`, {
            headers: {
                Authorization: `Bearer ${AuthHelper.getToken()}`
            }
        }).then((res) => {
            const data = res.data as ApiResponse<null>
            toast(data.message, {
                type: "success"
            })
            fetchTableData()
        }).catch((err) => {
            console.log(err)
            toast("Gagal menghapus kamar.", {
                type: "error"
            })
        })
    }

    useEffect(() => {
        fetchTableData()
    }, [])

    return <>
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Kamar</h1>
            <Button onClick={() => {
                setCurrentData(undefined)
                setIsEditing(true)
                setOpenModalDetail(true)
            }}>
                <PlusIcon className="w-4 h-4 me-2" /> Tambah
            </Button>
        </div>

        <DataTable<Kamar> data={tableData} columns={[
            {
                field: "no_kamar",
                header: "No. Kamar",
                enableSorting: true,
                cell: (row) => <span className="text-lg font-bold">{row.no_kamar}</span>
            },
            {
                field: "id_jenis_kamar",
                header: "Jenis Kamar",
                enableSorting: true,
                cell: (row) => <a target="_blank" href={`/kamar/${row.id_jenis_kamar}`}>{row.jenis_kamar?.nama}</a>
            },
            {
                field: "jenis_bed",
                header: "Jenis Bed",
                enableSorting: true,
            },
            {
                field: "is_smoking",
                header: "Smoking",
                enableSorting: true,
                cell: (row) => row.is_smoking ? "Ya" : "Tidak"
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
        ]]} />

        <ModalCUKamar id={currentData?.no_kamar} editable={isEditing} open={openModalDetail} onOpenChange={setOpenModalDetail} onSubmittedHandler={() => fetchTableData()} />
        <ModalDelete open={openModalDelete} onOpenChange={setOpenModalDelete} onConfirmed={deleteKamar}>
            <p className="mb-3">Apakah Anda yakin ingin menghapus kamar ini?</p>
            <p className="text-xl font-bold">Kamar No. {currentData?.no_kamar}</p>
        </ModalDelete>
    </>
}