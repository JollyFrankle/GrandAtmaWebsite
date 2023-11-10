import { BabyIcon, BedIcon, CalendarIcon, SearchIcon, UserIcon } from "lucide-react";
import { Button } from "@/cn/components/ui/button";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputWithIcon from "@/components/InputWithIcon";
import ReservationDatePicker from "@/pages/public/_layout/components/ReservationDatePicker";
import IconInput from "@/components/IconInput";
import { RoomSearchData } from "@/pages/public/_layout/components/RoomSearch";


export default function RoomSearchCG({
    initData
} : {
    initData?: RoomSearchData
}) {
    const [minDate, setMinDate] = useState<Date>(new Date())
    const [inDate, setInDate] = useState<DateRange>()
    const [inDewasa, setInDewasa] = useState<string>("2")
    const [inAnak, setInAnak] = useState<string>("0")
    const [inJumlahKamar, setInJumlahKamar] = useState<string>("1")

    const navigate = useNavigate()

    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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

        const queryParam = new URLSearchParams({
            from: inDate.from?.getTime().toString() ?? "",
            to: inDate.to?.getTime().toString() ?? "",
            dewasa: inDewasa,
            anak: inAnak,
            jumlahKamar: inJumlahKamar,
            ts: Date.now().toString()
        })
        navigate(`?${queryParam.toString()}`)
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

    useEffect(() => {
        const newMinDate = new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000)
        setMinDate(newMinDate)
    }, [])

    return (
        <form onSubmit={onSubmitHandler}>
            <div className="grid grid-cols-12 grid-flow-row gap-4 items-end">
                <label className="col-span-12 lg:col-span-4">
                    <div className="text-lg mb-1 block">Tanggal menginap</div>
                    <InputWithIcon icon={<CalendarIcon />}>
                        <ReservationDatePicker className="ps-9" value={inDate} onChange={setInDate} minDate={minDate} />
                    </InputWithIcon>
                </label>
                <div className="col-span-12 md:col-span-4 lg:col-span-2">
                    <IconInput
                        className="mb-0"
                        icon={<UserIcon />}
                        type="number"
                        size="lg"
                        label="Jumlah dewasa"
                        onValueChange={setInDewasa}
                        value={inDewasa}
                        min={1}
                        max={40} />
                </div>
                <div className="col-span-12 md:col-span-4 lg:col-span-2">
                    <IconInput
                        className="mb-0"
                        icon={<BabyIcon />}
                        type="number"
                        size="lg"
                        label="Jumlah anak"
                        onValueChange={setInAnak}
                        value={inAnak}
                        min={0}
                        max={20} />
                </div>
                <div className="col-span-12 md:col-span-4 lg:col-span-2">
                    <IconInput
                        className="mb-0"
                        icon={<BedIcon />}
                        type="number"
                        size="lg"
                        label="Jumlah kamar"
                        onValueChange={setInJumlahKamar}
                        value={inJumlahKamar}
                        min={1}
                        max={20} />
                </div>
                <Button className="col-span-12 lg:col-span-2 text-lg h-14" type="submit">
                    <SearchIcon className="w-4 h-4 me-2" />
                    Cari Kamar
                </Button>
            </div>
            <div className="mt-3 lg:flex justify-between items-center">
                <div className="mb-3 lg:mb-0 text-muted-foreground">
                    Catatan: Anak-anak dianggap berusia 12 tahun ke bawah, dibuktikan dengan identitas resmi.
                </div>
            </div>
        </form>
    )
}