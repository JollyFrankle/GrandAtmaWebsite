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
import { Alert } from "@/cn/components/ui/alert";
import InlineButton from "@/components/InlineButton";

import ImgHighSeason from "@/assets/images/img_season_high-16x9.png"
import ImgLowSeason from "@/assets/images/img_season_low-16x9.png"
import AbstractBG from "@/assets/images/abstract-bg.png"

function getBadgeMusim(tipe: string, className: string = "") {
    if (tipe === "h") {
        return <Badge variant="default" className={className}><TrendingUpIcon className="w-4 h-4 me-2" /> High season</Badge>
    } else {
        return <Badge variant="secondary" className={className}><TrendingDownIcon className="w-4 h-4 me-2" /> Low season</Badge>
    }
}

export default function PageSeasonTarif() {
    const [tableData, setTableData] = useState<Season[]>([])
    const [activeSeason, setActiveSeason] = useState<Season|null>(null)
    const [currentData, setCurrentData] = useState<Season>()
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const navigate = useNavigate()

    usePageTitle("Season dan Tarif – Grand Atma Hotel")

    const fetchTableData = () => {
        setTableLoading(true)
        apiAuthenticated.get<ApiResponse<{ seasons: Season[], active_season: Season|null }>>(`pegawai/season`).then((res) => {
            const data = res.data
            setTableData(data.data.seasons)
            setActiveSeason(data.data.active_season)
        }).finally(() => {
            setTableLoading(false)
        })
    }

    const deleteSeason = () => {
        apiAuthenticated.delete<ApiResponse<null>>(`pegawai/season/${currentData?.id}`).then((res) => {
            const data = res.data
            toast.success(data.message)
            fetchTableData()
        })
    }

    useEffect(() => {
        if(AuthHelper.authorize(["sm"])) {
            fetchTableData()
        } else {
            toast.error("Anda tidak memiliki akses ke halaman ini. Insiden ini telah dilaporkan.")
            navigate("/admin/")
        }
    }, [])

    return <>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Season dan Tarif</h1>
            <Button onClick={() => {
                setCurrentData(undefined)
                setIsEditing(true)
                setOpenModalDetail(true)
            }}>
                <PlusIcon className="w-4 h-4 me-2" /> Tambah
            </Button>
        </div>

        {activeSeason && (
            <Alert className={`p-0 relative overflow-auto shadow-md border-2 ${activeSeason.type === 'h' ? "border-primary" : "border-secondary"}`}>
                <div className="flex flex-col md:flex-row content-between md:h-48 relative z-10">
                    <div className="flex-1 p-4 md:self-center">
                        <p className="text-lg">Season saat ini:</p>
                        <p className="text-xl mb-2 font-bold">{activeSeason.nama} {getBadgeMusim(activeSeason.type)}</p>
                        <p className="text-lg mb-4"></p>
                        <p className="mb-4">Berlaku <strong>{Formatter.formatDate(new Date(activeSeason.tanggal_start))}</strong> sampai <strong>{Formatter.formatDate(new Date(activeSeason.tanggal_end))}</strong>.</p>
                        <InlineButton onClick={() => {
                            setCurrentData(activeSeason)
                            setIsEditing(false)
                            setOpenModalDetail(true)
                        }}>
                            <EyeIcon className="w-4 h-4 me-2" /> Lihat Detail
                        </InlineButton>
                    </div>
                    <img src={activeSeason.type === 'h' ? ImgHighSeason : ImgLowSeason} className="dark:invert flex-shrink-0 aspect-[4/1] md:aspect-[2/1] object-cover" alt="Musim aktif" />
                </div>
                <img src={AbstractBG} alt="Abstract background" className="dark:opacity-10 pointer-events-none select-none absolute top-0 left-0 right-0 bottom-0 w-full h-full object-cover opacity-50" />
            </Alert>
        )}
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