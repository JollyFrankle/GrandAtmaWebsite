import InlineLink from "@/components/InlineLink";
import ModalDetailReservasi from "@/components/modals/ModalDetailReservasi";
import ListReservasi from "@/components/reservasi/ListReservasi";
import usePageTitle from "@/hooks/usePageTitle";
import { ApiResponse, Reservasi, apiAuthenticated } from "@/utils/ApiModels";
import AuthHelper from "@/utils/AuthHelper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PageAllUpomingReservasiCG() {
    const navigate = useNavigate()

    const [showDialog, setShowDialog] = useState(false)
    const [detailReservasi, setDetailReservasi] = useState<Reservasi>()
    const [detailLoading, setDetailLoading] = useState(false)

    usePageTitle("Reservasi Grup Mendatang")

    const getDetailReservasi = (reservasi: Reservasi) => {
        setDetailLoading(true)
        setShowDialog(true)
        apiAuthenticated.get<ApiResponse<Reservasi>>(`pegawai/reservasi/${reservasi.id_customer}/${reservasi.id}`).then((res) => {
            const data = res.data
            setDetailReservasi(data.data)
            setDetailLoading(false)
        })
    }

    useEffect(() => {
        if(AuthHelper.authorize(["sm"])) {
            // fetchTableData()
        } else {
            toast.error("Anda tidak memiliki akses ke halaman ini. Insiden ini telah dilaporkan.")
            navigate("/admin/")
        }
    }, [navigate])

    return <>
        <h1 className="text-3xl font-bold mb-2">Reservasi Grup Aktif & Mendatang</h1>
        <p className="mb-1">Halaman ini menampilkan semua reservasi grup aktif & mendatang (yang sedang check in dan yang akan datang).</p>
        <p className="mb-4">Untuk membuat reservasi baru, silakan ke halaman <InlineLink to="/admin/cg">Customer Group</InlineLink>, memilih salah satu customer dan meng-klik tindakan "Buat Reservasi".</p>
        <ListReservasi status="upcoming" idCustomer={-1} onDetailClick={getDetailReservasi} />

        <ModalDetailReservasi show={showDialog} onOpenChange={setShowDialog} data={detailReservasi} loading={detailLoading} />
    </>
}