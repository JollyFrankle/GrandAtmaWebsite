import { Button } from "@/cn/components/ui/button";
import DataTable from "@/components/DataTable";
import usePageTitle from "@/hooks/usePageTitle";
import { ApiResponse, BASE_URL, UserCustomer } from "@/utils/ApiModels";
import AuthHelper from "@/utils/AuthHelper";
import axios from "axios";
import { CalendarCheck2Icon, EyeIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalCCustomerGroup from "./components/ModalCCustomerGroup";
import { useNavigate } from "react-router-dom";


export default function PageCustomerGroup() {
    const [tableData, setTableData] = useState<UserCustomer[]>([])
    const [currentData, setCurrentData] = useState<UserCustomer>()
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    // const [openModalDelete, setOpenModalDelete] = useState(false)
    const navigate = useNavigate()

    usePageTitle("Customer Group - Grand Atma Hotel")

    const fetchTableData = () => {
        axios.get(`${BASE_URL}/pegawai/user`, {
            headers: {
                Authorization: `Bearer ${AuthHelper.getToken()}`
            }
        }).then((res) => {
            const data = res.data as ApiResponse<UserCustomer[]>
            setTableData(data.data)
        }).catch((err) => {
            console.log(err)
            toast("Gagal memuat data customer.", {
                type: "error"
            })
        })
    }

    // const deleteCustomer = () => {
    //     axios.delete(`${BASE_URL}/pegawai/user/${currentData?.id}`, {
    //         headers: {
    //             Authorization: `Bearer ${AuthHelper.getToken()}`
    //         }
    //     }).then((res) => {
    //         const data = res.data as ApiResponse<null>
    //         toast(data.message, {
    //             type: "success"
    //         })
    //         fetchTableData()
    //     }).catch((err) => {
    //         console.log(err)
    //         toast("Gagal menghapus fasilitas.", {
    //             type: "error"
    //         })
    //     })
    // }

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
            <h1 className="text-3xl font-bold">Customer Group</h1>
            <Button onClick={() => {
                setCurrentData(undefined)
                setIsEditing(true)
                setOpenModalDetail(true)
            }}>
                <PlusIcon className="w-4 h-4 me-2" /> Tambah
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
                    navigate(`/admin/reservasi/${row.id}`)
                }
            }
        ]]} />

        <ModalCCustomerGroup id={currentData?.id} editable={isEditing} open={openModalDetail} onOpenChange={setOpenModalDetail} onSubmittedHandler={() => { fetchTableData(); setCurrentData(undefined) }} />
    </>
}