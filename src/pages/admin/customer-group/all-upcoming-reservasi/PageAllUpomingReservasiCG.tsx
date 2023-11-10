import InlineLink from "@/components/InlineLink";
import ListReservasi from "@/components/reservasi/ListReservasi";
import usePageTitle from "@/hooks/usePageTitle";
import AuthHelper from "@/utils/AuthHelper";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PageAllUpomingReservasiCG() {
    const navigate = useNavigate()

    usePageTitle("Reservasi Grup Mendatang")

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
        <h1 className="text-2xl font-bold mb-2">Reservasi Grup Aktif & Mendatang</h1>
        <p className="mb-1">Halaman ini menampilkan semua reservasi grup aktif & mendatang (yang sedang check in dan yang akan datang).</p>
        <p className="mb-4">Untuk membuat reservasi baru, silakan ke halaman <InlineLink to="/admin/cg">Customer Group</InlineLink>, memilih salah satu customer dan meng-klik tindakan "Buat Reservasi".</p>
        <ListReservasi status="upcoming" idCustomer={-1} />
    </>
}