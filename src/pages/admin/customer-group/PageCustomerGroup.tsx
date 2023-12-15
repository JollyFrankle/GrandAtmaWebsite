import { Button } from "@/cn/components/ui/button";
import DataTable from "@/components/DataTable";
import usePageTitle from "@/hooks/usePageTitle";
import { ApiResponse, UserCustomer, apiAuthenticated } from "@/utils/ApiModels";
import AuthHelper from "@/utils/AuthHelper";
import { BookPlusIcon, CalendarCheck2Icon, EyeIcon, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalCCustomerGroup from "./components/ModalCCustomerGroup";
import { useNavigate } from "react-router-dom";


export default function PageCustomerGroup() {
    const [tableData, setTableData] = useState<UserCustomer[]>([])
    const [currentData, setCurrentData] = useState<UserCustomer>()
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    // const [openModalDelete, setOpenModalDelete] = useState(false)
    const navigate = useNavigate()

    usePageTitle("Customer Group – Grand Atma Hotel")

    const fetchTableData = () => {
        setTableLoading(true)
        apiAuthenticated.get<ApiResponse<UserCustomer[]>>(`pegawai/customer`).then((res) => {
            const data = res.data
            setTableData(data.data)
        }).finally(() => {
            setTableLoading(false)
        })
    }

    // const deleteCustomer = () => {
    //     apiAuthenticated.delete<ApiResponse<null>>(`pegawai/customer/${currentData?.id}`).then((res) => {
    //         const data = res.data
    //         toast.success(data.message)
    //         fetchTableData()
    //     })
    // }

    useEffect(() => {
        if(AuthHelper.authorize(["sm"])) {
            fetchTableData()
        } else {
            toast.error("Anda tidak memiliki akses ke halaman ini. Insiden ini telah dilaporkan.")
            navigate("/admin/")
        }
    }, [navigate])

    return <>
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Customer Group</h1>
            <Button onClick={() => {
                setCurrentData(undefined)
                setIsEditing(true)
                setOpenModalDetail(true)
            }}>
                <UserPlusIcon className="w-4 h-4 me-2" /> Customer Baru
            </Button>
        </div>

        <DataTable<UserCustomer> data={tableData} columns={[
            {
                field: "nama",
                header: "Nama Customer",
                enableSorting: true,
            },
            {
                field: "email",
                header: "Email",
                enableSorting: true
            },
            {
                field: "nama_institusi",
                header: "Nama Institusi",
                enableSorting: true
            },
            {
                field: "no_telp",
                header: "No. Telepon",
                enableSorting: true
            }
        ]} actions={[[
            {
                action: <><EyeIcon className="w-4 h-4 me-2" /> Detail</>,
                onClick(row) {
                    setCurrentData(row)
                    setIsEditing(false)
                    setOpenModalDetail(true)
                },
            },
            {
                action: <><CalendarCheck2Icon className="w-4 h-4 me-2" /> Riwayat Reservasi</>,
                onClick(row) {
                    navigate(`/admin/cg/${row.id}`)
                }
            },
            {
                action: <><BookPlusIcon className="w-4 h-4 me-2" /> Buat Reservasi</>,
                onClick(row) {
                    navigate(`/admin/cg/${row.id}/new`)
                }
            }
        ]]} isLoading={tableLoading} />

        <ModalCCustomerGroup id={currentData?.id} editable={isEditing} open={openModalDetail} onOpenChange={setOpenModalDetail} onSubmittedHandler={() => { fetchTableData(); setCurrentData(undefined) }} />
    </>
}