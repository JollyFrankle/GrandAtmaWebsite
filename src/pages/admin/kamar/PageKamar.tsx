import { Button } from "@/cn/components/ui/button";
import DataTable from "@/components/DataTable";
import usePageTitle from "@/hooks/usePageTitle";
import { ApiResponse, Kamar, apiAuthenticated } from "@/utils/ApiModels";
import AuthHelper from "@/utils/AuthHelper";
import { EditIcon, EyeIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalCUKamar from "./components/ModalCUKamar";
import ModalDelete from "../_layout/components/ModalDelete";
import { useNavigate } from "react-router-dom";


export default function PageKamar() {
    const [tableData, setTableData] = useState<Kamar[]>([])
    const [currentData, setCurrentData] = useState<Kamar>()
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const navigate = useNavigate()

    usePageTitle("Kamar - Grand Atma Hotel")

    const fetchTableData = () => {
        setTableLoading(true)
        apiAuthenticated.get<ApiResponse<Kamar[]>>(`pegawai/kamar`).then((res) => {
            const data = res.data
            setTableData(data.data)
        }).catch((err) => {
            console.log(err)
            toast("Gagal memuat data kamar.", {
                type: "error"
            })
        }).finally(() => {
            setTableLoading(false)
        })
    }

    const deleteKamar = () => {
        apiAuthenticated.delete<ApiResponse<null>>(`pegawai/kamar/${currentData?.no_kamar}`).then((res) => {
            const data = res.data
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
        if(AuthHelper.authorize(["admin"])) {
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
                cell: (row) => <Button variant="link" className="h-fit p-0" asChild><a href={`/kamar/${row.id_jenis_kamar}`} target="_blank">{row.jenis_kamar?.nama}</a></Button>,
                accessorFn: (row) => row.jenis_kamar?.nama ?? ""
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
        ]]} isLoading={tableLoading} />

        <ModalCUKamar id={currentData?.no_kamar} editable={isEditing} open={openModalDetail} onOpenChange={setOpenModalDetail} onSubmittedHandler={() => { fetchTableData(); setCurrentData(undefined) }} />
        <ModalDelete open={openModalDelete} onOpenChange={setOpenModalDelete} onConfirmed={deleteKamar}>
            <p className="mb-3">Apakah Anda yakin ingin menghapus kamar ini?</p>
            <p className="text-xl font-bold">Kamar No. {currentData?.no_kamar}</p>
        </ModalDelete>
    </>
}