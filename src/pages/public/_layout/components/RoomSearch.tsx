import { Card, CardContent } from "@/cn/components/ui/card";
import InputWithIcon from "../../../../components/InputWithIcon";
import ReservationDatePicker from "./ReservationDatePicker";
import GuestAmountPicker from "./GuestAmountPicker";
import { BabyIcon, BedIcon, CalendarIcon, SearchIcon, UserIcon } from "lucide-react";
import { Button } from "@/cn/components/ui/button";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export interface RoomSearchData {
    date?: DateRange,
    dewasa?: string,
    anak?: string,
    jumlahKamar?: string
}

export default function RoomSearch({
    initData,
    showIntro = true,
    className = "rounded-3xl shadow-lg",
    innerClassName = "",
    onClickSearch
} : {
    initData?: RoomSearchData,
    showIntro?: boolean,
    className?: string,
    innerClassName?: string,
    onClickSearch?: (data: RoomSearchData) => void
}) {
    const [inDate, setInDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    })
    const [inDewasa, setInDewasa] = useState<string>("2")
    const [inAnak, setInAnak] = useState<string>("0")
    const [inJumlahKamar, setInJumlahKamar] = useState<string>("1")

    const navigate = useNavigate()

    const onSubmit = () => {
        if (!inDate) {
            toast.error("Mohon pilih tanggal terlebih dahulu.")
            return
        }
        if (+inJumlahKamar < 1) {
            toast.error("Jumlah kamar minimal 1.")
            return
        }
        if (+inDewasa < 1) {
            toast.error("Jumlah dewasa minimal 1.")
            return
        }
        if (+inDewasa < +inJumlahKamar) {
            toast.error("Jumlah dewasa tidak boleh kurang dari jumlah kamar.")
            return
        }
        if (onClickSearch) {
            onClickSearch({
                date: inDate,
                dewasa: inDewasa,
                anak: inAnak,
                jumlahKamar: inJumlahKamar
            })
        } else {
            const queryParams = new URLSearchParams({
                from: inDate.from?.getTime().toString() ?? "",
                to: inDate.to?.getTime().toString() ?? "",
                dewasa: inDewasa,
                anak: inAnak,
                jumlahKamar: inJumlahKamar,
                ts: Date.now().toString()
            })
            navigate(`/search?${queryParams.toString()}`)
        }
    }

    useEffect(() => {
        const { date, dewasa, anak, jumlahKamar } = initData ?? {}
        if (date) {
            setInDate(date)
        }
        if (dewasa) {
            setInDewasa(dewasa)
        }
        if (anak) {
            setInAnak(anak)
        }
        if (jumlahKamar) {
            setInJumlahKamar(jumlahKamar)
        }
    }, [initData])

    return <Card className={`w-full h-full ${className}`}>
        <CardContent className={`py-6 h-full text-center ${innerClassName}`}>
            <p className="mb-3 text-xl md:text-start" hidden={!showIntro}>
                <mark className="font-bold"><em>Sugeng rawuh!</em></mark> Rencanakan liburan Anda selanjutnya ditemani kami!
            </p>
            <div className="grid grid-cols-12 grid-flow-row gap-4 items-center">
                <InputWithIcon icon={<CalendarIcon />} className="col-span-12 lg:col-span-4">
                    <ReservationDatePicker className="ps-9" value={inDate} onChange={setInDate} />
                </InputWithIcon>
                <InputWithIcon icon={<UserIcon />} className="col-span-12 md:col-span-4 lg:col-span-2">
                    <GuestAmountPicker className="ps-9" placeholder="Jumlah dewasa" onChange={setInDewasa} value={inDewasa} suffix="dewasa" max={10} />
                </InputWithIcon>
                <InputWithIcon icon={<BabyIcon />} className="col-span-12 md:col-span-4 lg:col-span-2">
                    <GuestAmountPicker className="ps-9" placeholder="Jumlah anak" onChange={setInAnak} value={inAnak} suffix="anak" max={10} />
                </InputWithIcon>
                <InputWithIcon icon={<BedIcon />} className="col-span-12 md:col-span-4 lg:col-span-2">
                    <GuestAmountPicker className="ps-9" placeholder="Jumlah kamar" onChange={setInJumlahKamar} value={inJumlahKamar} suffix="kamar" max={5} />
                </InputWithIcon>
                <Button className="col-span-12 lg:col-span-2 text-lg h-14" onClick={onSubmit}>
                    <SearchIcon className="w-4 h-4 me-2" />
                    Cari Kamar
                </Button>
            </div>
            <div className="mt-3 lg:flex justify-between items-center">
                <div className="mb-3 lg:mb-0 text-muted-foreground">
                    Keterangan: Anak-anak dianggap berusia 12 tahun ke bawah, dibuktikan dengan identitas resmi.
                </div>
                <div>
                    Ingin memesan lebih dari 5 kamar?
                    <Button variant="link" className="p-0 ms-2 text-md" asChild>
                        <Link to="/reservasi-grup">Hubungi kami</Link>
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
}