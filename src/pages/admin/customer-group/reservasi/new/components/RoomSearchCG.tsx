import { Card, CardContent } from "@/cn/components/ui/card";
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
    initData,
    showIntro = true,
    className = "rounded-3xl shadow-lg",
    innerClassName = ""
} : {
    initData?: RoomSearchData,
    showIntro?: boolean,
    className?: string,
    innerClassName?: string
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

        navigate(`?from=${inDate.from?.getTime()}&to=${inDate.to?.getTime()}&dewasa=${inDewasa}&anak=${inAnak}&jumlahKamar=${inJumlahKamar}`)
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
        <CardContent className={`py-6 h-full ${innerClassName}`}>
            <p className="mb-3 text-xl md:text-start" hidden={!showIntro}>
                <mark className="font-bold"><em>Sugeng rawuh!</em></mark> Rencanakan liburan Anda selanjutnya ditemani kami!
            </p>
            <div className="grid grid-cols-12 grid-flow-row gap-4 items-end">
                <label className="col-span-12 lg:col-span-4">
                    <div className="text-lg mb-1 block">Tanggal menginap</div>
                    <InputWithIcon icon={<CalendarIcon />}>
                        <ReservationDatePicker className="ps-9" value={inDate} onChange={setInDate} />
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
                <Button className="col-span-12 lg:col-span-2 text-lg h-14" onClick={onSubmit}>
                    <SearchIcon className="w-4 h-4 me-2" />
                    Cari Kamar
                </Button>
            </div>
            <div className="mt-3 lg:flex justify-between items-center">
                <div className="mb-3 lg:mb-0 text-muted-foreground">
                    Catatan: Anak-anak dianggap berusia 12 tahun ke bawah, dibuktikan dengan KTP Anak.
                </div>
            </div>
        </CardContent>
    </Card>
}