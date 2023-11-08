import AuthHelper from "@/utils/AuthHelper"
import { AxiosError } from "axios"
import { ApiResponse, Reservasi, UserCustomer, apiAuthenticated } from "@/utils/ApiModels"
import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/cn/components/ui/button"
import usePageTitle from "@/hooks/usePageTitle"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import ModalDetailReservasi from "@/pages/customer/dashboard/components/ModalDetailReservasi"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/cn/components/ui/table"
import ReservasiHistoryTab from "@/pages/customer/dashboard/components/ReservasiHistoryTab"


export default function PageReservasiCG() {
    const params = useParams<{ id: string }>()
    const { id: idC } = params

    // const [userP] = useState(AuthHelper.getUserPegawai()!!)
    const [user, setUser] = useState<UserCustomer>()
    const [showDialog, setShowDialog] = useState(false)
    const [detailReservasi, setDetailReservasi] = useState<Reservasi>()
    const [detailLoading, setDetailLoading] = useState(false)
    const navigate = useNavigate()

    usePageTitle("Riwayat Reservasi - Grand Atma Hotel")

    const getDetailReservasi = (idRes: number) => {
        setDetailLoading(true)
        setShowDialog(true)
        apiAuthenticated.get<ApiResponse<Reservasi>>(`pegawai/reservasi/${idC}/${idRes}`).then((res) => {
            const data = res.data
            setDetailReservasi(data.data)
            setDetailLoading(false)
        }).catch((err: AxiosError) => {
            console.log(err)
        })
    }

    useEffect(() => {
        if(AuthHelper.authorize(["sm"])) {
            // fetchTableData()
        } else {
            toast("Anda tidak memiliki akses ke halaman ini. Kejadian ini telah dilaporkan.", {
                type: "error"
            })
            navigate("/admin/")
        }
    }, [])

    return <>
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Riwayat Reservasi</h1>
            <Button disabled>
                <PlusIcon className="w-4 h-4 me-2" /> Tambah
            </Button>
        </div>

        {user && <>
            <p>Menampilkan riwayat reservasi untuk:</p>
            <Table className="w-fit">
                <TableBody>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableCell>{user?.nama}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead>Nama Institusi</TableHead>
                        <TableCell>{user?.nama_institusi}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableCell>{user?.email}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead>Nomor Telepon</TableHead>
                        <TableCell>{user?.no_telp}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>}

        <ReservasiHistoryTab idCustomer={+(idC ?? 0)} onDetailClick={getDetailReservasi} onUserFetched={setUser} />

        <ModalDetailReservasi show={showDialog} onOpenChange={setShowDialog} data={detailReservasi} loading={detailLoading} />
    </>
}