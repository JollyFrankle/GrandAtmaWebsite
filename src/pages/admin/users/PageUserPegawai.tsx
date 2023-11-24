import { Button } from "@/cn/components/ui/button";
import DataTable from "@/components/DataTable";
import usePageTitle from "@/hooks/usePageTitle";
import { ApiResponse, UserPegawai, apiAuthenticated } from "@/utils/ApiModels";
import AuthHelper from "@/utils/AuthHelper";
import { EditIcon, EyeIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalCUPegawai from "./components/ModalCUPegawai";
import ModalDelete from "../../../components/modals/ModalDelete";
import { useNavigate } from "react-router-dom";
import ReservasiFormatter from "@/utils/ReservasiFormatter";

export default function PageKamar() {
    const [tableData, setTableData] = useState<UserPegawai[]>([])
    const [currentData, setCurrentData] = useState<UserPegawai>()
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const navigate = useNavigate()

    usePageTitle("User Management – Grand Atma Hotel")

    const fetchTableData = () => {
        setTableLoading(true)
        apiAuthenticated.get<ApiResponse<UserPegawai[]>>(`pegawai/users`).then((res) => {
            const data = res.data
            setTableData(data.data)
        }).finally(() => {
            setTableLoading(false)
        })
    }

    const deleteKamar = () => {
        apiAuthenticated.delete<ApiResponse<null>>(`pegawai/users/${currentData?.id}`).then((res) => {
            const data = res.data
            toast.error(data.message)
            fetchTableData()
        })
    }

    useEffect(() => {
        if(AuthHelper.authorize(["admin"])) {
            fetchTableData()
        } else {
            toast.error("Anda tidak memiliki akses ke halaman ini. Insiden ini telah dilaporkan.")
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

        <DataTable<UserPegawai> data={tableData} columns={[
            {
                field: "role",
                header: "Role",
                enableSorting: true,
                cell: (row) => ReservasiFormatter.getRoleBadge(row.role),
            },
            {
                field: "nama",
                header: "Nama",
                enableSorting: true,
                // cell: (row) => <Button variant="link" className="h-fit p-0" asChild><a href={`/kamar/${row.id_jenis_kamar}`} target="_blank">{row.jenis_kamar?.nama}</a></Button>,
                // accessorFn: (row) => row.jenis_kamar?.nama ?? ""
            },
            {
                field: "email",
                header: "Email",
                enableSorting: true,
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

        <ModalCUPegawai id={currentData?.id} editable={isEditing} open={openModalDetail} onOpenChange={setOpenModalDetail} onSubmittedHandler={() => { fetchTableData(); setCurrentData(undefined) }} />
        <ModalDelete open={openModalDelete} onOpenChange={setOpenModalDelete} onConfirmed={deleteKamar}>
            <p className="mb-3">Apakah Anda yakin ingin menghapus pegawai ini?</p>
            <p className="text-xl font-bold">{currentData?.nama}</p>
        </ModalDelete>
    </>
}