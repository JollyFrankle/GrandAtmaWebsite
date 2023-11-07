import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"
import { Button } from "@/cn/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/cn/components/ui/card"
import { ApiResponse, FasilitasLayananTambahan, Reservasi, apiAuthenticated, apiPublic, getImage } from "@/utils/ApiModels"
import Converter from "@/utils/Converter"
import Formatter from "@/utils/Formatter"
import { AxiosError } from "axios"
import { AlertOctagonIcon, MinusIcon, PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


export default function PageBookingStep1() {
    const params = useParams<{ id: string }>()
    const { id } = params

    const [detail, setDetail] = useState<Reservasi>()
    const [isLoading, setIsLoading] = useState(true)
    const [listFasilitas, setListFasilitas] = useState<FasilitasLayananTambahan[]>([])

    const fetchFasilitas = async () => {
        apiPublic.get<ApiResponse<FasilitasLayananTambahan[]>>(`public/layanan-tambahan`).then((res) => {
            const data = res.data
            setListFasilitas(data.data)
        })
    }

    const getDetailReservasi = () => {
        apiAuthenticated.get<ApiResponse<Reservasi>>(`customer/reservasi/${id}`).then((res) => {
            const data = res.data
            setDetail(data.data)
        }).catch((err: AxiosError) => {
            console.log(err)
        })
    }

    useEffect(() => {
        getDetailReservasi()
        fetchFasilitas()
    }, [])

    return <><section className="container py-8 flex flex-col-reverse lg:flex-row gap-6 mb-4">
        <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">Data Kontak & Tamu</h2>
            <p className="text-secondary-foreground mb-6">Data kontak yang digunakan dalam pemesanan ini sesuai dengan profil Anda yang sedang masuk akun saat ini.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="col-span-1">
                    <div className="text-secondary-foreground">Nama lengkap:</div>
                    <div className="font-bold text-lg">{detail?.user_customer?.nama}</div>
                </div>

                <div className="col-span-1">
                    <div className="text-secondary-foreground">Nomor identitas:</div>
                    <div className="font-bold text-lg">{detail?.user_customer?.jenis_identitas.toUpperCase()} &ndash; {detail?.user_customer?.no_identitas}</div>
                </div>

                <div className="col-span-1">
                    <div className="text-secondary-foreground">Email:</div>
                    <div className="font-bold text-lg">{detail?.user_customer?.email}</div>
                </div>

                <div className="col-span-1">
                    <div className="text-secondary-foreground">Nomor telepon:</div>
                    <div className="font-bold text-lg">{detail?.user_customer?.no_telp}</div>
                </div>

                <div className="col-span-2">
                    <div className="text-secondary-foreground">Alamat:</div>
                    <div className="font-bold text-lg">{detail?.user_customer?.alamat}</div>
                </div>
            </div>

            <Alert className="mb-6">
                <AlertOctagonIcon className="w-4 h-4 me-2" />
                <AlertTitle>Informasi</AlertTitle>
                <AlertDescription>
                    Pastikan Anda menyiapkan kartu identitas sesuai dengan data di atas saat check in.
                </AlertDescription>
            </Alert>

            <h2 className="text-xl font-bold mb-2">Layanan Tambahan Pesan Terlebih Dahulu</h2>
            <p className="text-secondary-foreground mb-6">Layanan tambahan yang dapat Anda pesan sebelum check in.</p>

            <ul className="list-none mb-4 border rounded overflow-auto">
                {listFasilitas?.map((item, i) => (
                    <li className="grid grid-cols-12 items-center border-b last:border-b-0" key={item.id}>
                        <div className="col-span-12 md:col-span-4 lg:col-span-3 h-40">
                            <img src={getImage(item.gambar)} className="w-full h-full object-cover" />
                        </div>
                        <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col xl:flex-row items-center gap-4 p-4">
                            <div className="flex-1">
                                <div className="font-bold">{item.nama}</div>
                                <div className="text-sm mb-2 lg:line-clamp-3">{item.short_desc}</div>
                                <div className="text-secondary-foreground">{Formatter.formatCurrency(item.tarif)} per {item.satuan}</div>
                            </div>

                            <div className="flex border rounded overflow-auto items-stretch w-fit h-fit">
                                <Button variant="ghost" className="rounded-none px-3">
                                    <MinusIcon className="w-4 h-4" />
                                </Button>
                                <span className="px-2 py-2 w-10 text-center">1</span>
                                <Button variant="ghost" className="rounded-none px-3">
                                    <PlusIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

        </div>
        <div className="lg:w-96 flex-shrink-0">
            <Card className="sticky top-24 shadow-lg overflow-auto">
            <div className="flex bg-red-500 hover:bg-red-600 transition-all py-2 text-white justify-center">
                    <span className="me-2">Selesaikan pemesanan dalam</span><strong className="bg-white text-red-600 w-6 text-center rounded">19</strong><span className="mx-[.125rem]">:</span><strong className="bg-white text-red-600 w-6 text-center rounded">58</strong>
                </div>
                <CardHeader>
                    Ringkasan
                </CardHeader>
                {detail && (

                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-foreground">Check in:</span>
                                <span className="font-bold">{Formatter.formatDate(new Date(detail.arrival_date))}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-foreground">Check out:</span>
                                <span className="font-bold">{Formatter.formatDate(new Date(detail.departure_date))}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-foreground">Jumlah malam:</span>
                                <span className="font-bold">{Converter.jumlahMalamFromDateRange(new Date(detail.arrival_date), new Date(detail.departure_date))} malam</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-foreground">Jumlah kamar:</span>
                                <span className="font-bold">{detail.reservasi_rooms?.length ?? "Tidak ada"} kamar</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-foreground">Jumlah tamu:</span>
                                <span className="font-bold">{detail.jumlah_dewasa} dewasa &bull; {detail.jumlah_anak} anak</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-foreground">Total harga:</span>
                                <span className="font-bold">{Formatter.formatCurrency(detail.total)}</span>
                            </div>
                            <hr className="my-2" />
                            <div>Biaya kamar per malam:</div>
                            <ul className="list-none">
                                {detail.reservasi_rooms?.map((item, i) => (
                                    <li key={item.id} className="flex items-center justify-between">
                                        <span className="font-bold">{item.jenis_kamar?.nama}</span>
                                        <span className="font-bold">{Formatter.formatCurrency(item.harga_per_malam)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    </section>
    </>
}