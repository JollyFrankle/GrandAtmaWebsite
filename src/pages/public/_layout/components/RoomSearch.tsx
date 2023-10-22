import { Card, CardContent } from "@/cn/components/ui/card";
import InputWithIcon from "../../../../components/InputWithIcon";
import ReservationDatePicker from "./ReservationDatePicker";
import GuestAmountPicker from "./GuestAmountPicker";
import { BabyIcon, BedIcon, CalendarIcon, SearchIcon, UserIcon } from "lucide-react";
import { Button } from "@/cn/components/ui/button";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


export default function RoomSearch() {
    const [inDate, setInDate] = useState<DateRange | undefined>(undefined)
    const [inDewasa, setInDewasa] = useState<string>()
    const [inAnak, setInAnak] = useState<string>()
    const [inJumlahKamar, setInJumlahKamar] = useState<string>()

    const onSubmit = () => {
        toast(<>Data input: {inDewasa} dewasa, {inAnak} anak, {inJumlahKamar} kamar, tanggal: {inDate?.from?.toLocaleDateString()} - {inDate?.to?.toLocaleDateString()}</>, {
            type: "success"
        })
    }

    return <Card className="w-full h-full rounded-3xl shadow-lg">
        <CardContent className="py-6 h-full text-center">
            <p className="mb-3 text-xl md:text-start">
                <mark className="font-bold"><em>Sugeng rawuh!</em></mark> Rencanakan liburan Anda selanjutnya ditemani kami!
            </p>
            <div className="grid grid-cols-12 grid-flow-row gap-4 items-center">
                <InputWithIcon icon={<CalendarIcon />} className="col-span-12 lg:col-span-4">
                    <ReservationDatePicker className="ps-9" value={inDate} onChange={setInDate} />
                </InputWithIcon>
                <InputWithIcon icon={<UserIcon />} className="col-span-12 md:col-span-4 lg:col-span-2">
                    <GuestAmountPicker className="ps-9" placeholder="Jumlah dewasa" onChange={setInDewasa} suffix="dewasa" max={10} />
                </InputWithIcon>
                <InputWithIcon icon={<BabyIcon />} className="col-span-12 md:col-span-4 lg:col-span-2">
                    <GuestAmountPicker className="ps-9" placeholder="Jumlah anak" onChange={setInAnak} suffix="anak" max={10} />
                </InputWithIcon>
                <InputWithIcon icon={<BedIcon />} className="col-span-12 md:col-span-4 lg:col-span-2">
                    <GuestAmountPicker className="ps-9" placeholder="Jumlah kamar" onChange={setInJumlahKamar} suffix="kamar" max={5} />
                </InputWithIcon>
                <Button className="col-span-12 lg:col-span-2 text-lg h-14" onClick={onSubmit}>
                    <SearchIcon className="w-4 h-4 me-2" />
                    Cari Kamar
                </Button>
            </div>
            <div className="mt-3 lg:flex justify-between items-center">
                <div className="mb-3 lg:mb-0 text-muted-foreground">
                    Keterangan: Anak-anak dianggap berusia 12 tahun ke bawah, dibuktikan dengan KTP Anak.
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