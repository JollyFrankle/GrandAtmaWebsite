import { Button } from "@/cn/components/ui/button";
import DataTable from "@/components/DataTable";
import usePageTitle from "@/hooks/usePageTitle";
import { ApiResponse, Season, apiAuthenticated } from "@/utils/ApiModels";
import AuthHelper from "@/utils/AuthHelper";
import { EditIcon, EyeIcon, PlusIcon, Trash2Icon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalCUSeasonTarif from "./components/ModalCUSeasonTarif";
import ModalDelete from "../../../components/modals/ModalDelete";
import Formatter from "@/utils/Formatter";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/cn/components/ui/badge";

function getBadgeMusim(tipe: string) {
    if (tipe === "h") {
        return <Badge variant="default"><TrendingUpIcon className="w-4 h-4 me-2" /> High season</Badge>
    } else {
        return <Badge variant="secondary"><TrendingDownIcon className="w-4 h-4 me-2" /> Low season</Badge>
    }
}

export default function PageSeasonTarif() {
    const [tableData, setTableData] = useState<Season[]>([])
    const [currentData, setCurrentData] = useState<Season>()
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const navigate = useNavigate()

    usePageTitle("Season dan Tarif – Grand Atma Hotel")

    const fetchTableData = () => {
        setTableLoading(true)
        apiAuthenticated.get<ApiResponse<Season[]>>(`pegawai/season`).then((res) => {
            const data = res.data
            setTableData(data.data)
        }).finally(() => {
            setTableLoading(false)
        })
    }

    const deleteSeason = () => {
        apiAuthenticated.delete<ApiResponse<null>>(`pegawai/season/${currentData?.id}`).then((res) => {
            const data = res.data
            toast(data.message, {
                type: "success"
            })
            fetchTableData()
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
            <h1 className="text-3xl font-bold">Season dan Tarif</h1>
            <Button onClick={() => {
                setCurrentData(undefined)
                setIsEditing(true)
                setOpenModalDetail(true)
            }}>
                <PlusIcon className="w-4 h-4 me-2" /> Tambah
            </Button>
        </div>

        <DataTable<Season> data={tableData} columns={[
            {
                field: "nama",
                header: "Nama musim",
                enableSorting: true,
            },
            {
                field: "type",
                header: "Tipe musim",
                enableSorting: true,
                cell: (row) => getBadgeMusim(row.type)
            },
            {
                field: "tanggal_start",
                header: "Tanggal mulai",
                enableSorting: true,
                cell: (row) => Formatter.formatDate(new Date(row.tanggal_start)),
                accessorFn: (row) => Formatter.formatDate(new Date(row.tanggal_start))
            },
            {
                field: "tanggal_end",
                header: "Tanggal berakhir",
                enableSorting: true,
                cell: (row) => Formatter.formatDate(new Date(row.tanggal_end)),
                accessorFn: (row) => Formatter.formatDate(new Date(row.tanggal_end))
            },
            {
                field: "tarif",
                header: "Tarif",
                cell: (row) => row.tarif?.map((tarif) => <div><strong>{tarif.jenis_kamar?.nama}</strong> - {Formatter.formatCurrency(tarif.harga)}</div>),
                accessorFn: (row) => row.tarif?.map((tarif) => tarif.jenis_kamar?.nama).join(", ") ?? ""
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

        <ModalCUSeasonTarif id={currentData?.id} editable={isEditing} open={openModalDetail} onOpenChange={setOpenModalDetail} onSubmittedHandler={() => { fetchTableData(); setCurrentData(undefined) }} />
        <ModalDelete open={openModalDelete} onOpenChange={setOpenModalDelete} onConfirmed={deleteSeason}>
            <p className="mb-3">Apakah Anda yakin ingin menghapus season ini?</p>
            <p className="text-xl font-bold">{currentData?.nama}</p>
        </ModalDelete>
    </>
}