import { Card, CardContent, CardHeader } from "@/cn/components/ui/card"
import { ApiResponse, JenisKamar, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import { ArrowRightIcon, BanknoteIcon, BedSingleIcon, CalendarClockIcon, CalendarRangeIcon, CigaretteIcon, CircleSlashIcon, Clock4Icon, HelpingHandIcon, PawPrintIcon, ScanFaceIcon, UserIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/cn/components/ui/button"
import { Checkbox } from "@/cn/components/ui/checkbox"
import GeneralLoadingDialog from "@/components/loading/GeneralLoadingDialog"
import BookingS2FasiltasItem from "./components/BookingS2FasiltasItem"
import usePageTitle from "@/hooks/usePageTitle"
import AuthHelper from "@/utils/AuthHelper"

const urls = {
    getDetail: '',
    submitData: ''
}

export default function PageBookingStep2() {
    const params = useParams<{ idR: string, idC: string }>()
    const { idR, idC } = params

    const [detail, setDetail] = useState<Reservasi>()
    const [isLoading, setIsLoading] = useState(true)
    const [kamarGroupedByJenis, setKamarGroupedByJenis] = useState<{ jenis_kamar?: JenisKamar, amount: number, harga: number }[]>()
    const [checkSudahBaca, setCheckSudahBaca] = useState(false)

    const navigate = useNavigate()
    usePageTitle(`Resume Pemesanan #${Formatter.padZero(+(idR ?? 0), 8)} – Grand Atma Hotel`)

    const getDetailReservasi = async () => {
        return apiAuthenticated.get<ApiResponse<Reservasi>>(urls.getDetail).then((res) => {
            const data = res.data.data
            setDetail(data)

            // Group kamar by jenis kamar
            const kamarGroupedByJenis: { jenis_kamar?: JenisKamar, amount: number, harga: number }[] = []
            data.reservasi_rooms?.forEach((item) => {
                const index = kamarGroupedByJenis.findIndex((item2) => item2.jenis_kamar?.id == item.jenis_kamar?.id)
                if (index == -1) {
                    kamarGroupedByJenis.push({ jenis_kamar: item.jenis_kamar, amount: 1, harga: item.harga_per_malam })
                } else {
                    kamarGroupedByJenis[index].amount += 1
                }
            })
            setKamarGroupedByJenis(kamarGroupedByJenis)
        })
    }

    const submitData = () => {
        setIsLoading(true)
        apiAuthenticated.post<ApiResponse<{ reservasi: Reservasi }>>(urls.submitData).then((res) => {
            const data = res.data
            setDetail(data.data.reservasi)
            navigate(`../step-3`)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        if (AuthHelper.getUserCustomer()) {
            urls.getDetail = `customer/reservasi/${idR}`
            urls.submitData = `customer/booking/${idR}/step-2`
        } else if (AuthHelper.getUserPegawai()) {
            urls.getDetail = `pegawai/reservasi/${idC}/${idR}`
            urls.submitData = `pegawai/booking/${idR}/step-2`
        }
        Promise.all([getDetailReservasi()]).finally(() => {
            setIsLoading(false)
        })
    }, [])

    return <>
        <section className="container py-8 flex flex-col-reverse lg:flex-row gap-6 mb-4">
            <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Data Kontak & Tamu</h2>

                <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mb-4">
                    <div className="col-span-1">
                        <div className="text-muted-foreground">Nama lengkap:</div>
                        <div className="font-bold text-lg">{detail?.user_customer?.nama}</div>
                    </div>

                    <div className="col-span-1">
                        <div className="text-muted-foreground">Nomor identitas:</div>
                        <div className="font-bold text-lg">{detail?.user_customer?.jenis_identitas.toUpperCase()} &ndash; {detail?.user_customer?.no_identitas}</div>
                    </div>

                    <div className="col-span-1">
                        <div className="text-muted-foreground">Email:</div>
                        <div className="font-bold text-lg">{detail?.user_customer?.email}</div>
                    </div>

                    <div className="col-span-1">
                        <div className="text-muted-foreground">Nomor telepon:</div>
                        <div className="font-bold text-lg">{detail?.user_customer?.no_telp}</div>
                    </div>

                    <div className="col-span-2">
                        <div className="text-muted-foreground">Alamat:</div>
                        <div className="font-bold text-lg">{detail?.user_customer?.alamat}</div>
                    </div>
                </div>

                <hr className="my-4" />
                <h2 className="text-xl font-bold mb-2">Layanan Tambahan</h2>

                <ul className="list-none mb-6 border rounded-lg overflow-auto shadow">
                    {(detail?.reservasi_layanan?.length ?? 0) > 0 ? detail?.reservasi_layanan!!.map((item) => (
                        <BookingS2FasiltasItem key={item.id} reservasiLayanan={item} />
                    )) : (
                        <li className="p-4">Tidak ada layanan tambahan</li>
                    )}
                </ul>

                <hr className="my-4" />

                <h2 className="text-xl font-bold mb-2">Permintaan Khusus</h2>

                <Card className="shadow">
                    <CardContent className="whitespace-pre-wrap p-4">
                        {detail?.permintaan_tambahan ?? "Tidak ada permintaan khusus"}
                    </CardContent>
                </Card>

                <hr className="my-4" />

                <h2 className="text-xl font-bold mb-2">Aturan Akomodasi</h2>
                <p className="mb-4">Sebelum Anda melanjutkan ke pembayaran, mohon luangkan waktu untuk membaca beberapa aturan akomodasi sebagai berikut:</p>

                <ul className="list-none mb-6 border rounded-lg overflow-auto shadow">
                    <li className="p-4 flex items-start gap-4 border-b">
                        <Clock4Icon className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg mb-2">Waktu Check In dan Check Out</p>
                            <div>
                                <p>Waktu check in: <strong>Mulai 14.00 WIB</strong></p>
                                <p>Waktu check out: <strong>Maksimal 12.00 WIB</strong></p>
                            </div>
                        </div>
                    </li>
                    <li className="p-4 flex items-start gap-4 border-b">
                        <ScanFaceIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg mb-2">Identitas</p>
                            <div>
                                <p>Anda wajib menunjukkan <strong>kartu identitas asli</strong> yang sama dengan yang digunakan saat pemesanan.</p>
                                <p>Anda juga wajib menunjukkan kartu identitas asli dari semua orang yang menginap.</p>
                            </div>
                        </div>
                    </li>
                    <li className="p-4 flex items-start gap-4 border-b">
                        <CigaretteIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg mb-2">Merokok</p>
                            <div>
                                <p><strong>Dilarang merokok</strong> di semua kamar (kecuali atas permintaan khusus) dan di seluruh ruang tertutup hotel.</p>
                            </div>
                        </div>
                    </li>
                    <li className="p-4 flex items-start gap-4 border-b">
                        <PawPrintIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg mb-2">Hewan Peliharaan</p>
                            <div>
                                <p><strong>Dilarang membawa hewan peliharaan</strong> berjenis apapun.</p>
                                <p>Pelanggaran akan ditindak dengan denda <strong>Rp 1.000.000 per hewan</strong> dan larangan melakukan reservasi selama <strong>2 bulan</strong>.</p>
                            </div>
                        </div>
                    </li>
                    <li className="p-4 flex items-start gap-4">
                        <CircleSlashIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg mb-2">Pembatalan (<em>Cancellation</em>)</p>
                            <div>
                                <p>Pembatalan dapat dilakukan kapan saja hingga 1 (satu) hari sebelum check in.</p>
                                <p>Namun uang akan dikembalikan 100% jika pembatalan diajukan <strong>maksimal 1 (satu) minggu sebelum tanggal check in.</strong></p>
                            </div>
                        </div>
                    </li>
                    <li className="p-4 flex items-start gap-4">
                        <CalendarClockIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg mb-2">Penjadwalan Ulang (<em>Reschedule</em>)</p>
                            <div>
                                <p>Reservasi ini <strong>tidak dapat dijadwalkan ulang (<em>reschedule</em>)</strong>.</p>
                                <p>Untuk menjadwalkan ulang, silakan batalkan reservasi ini dan melakukan reservasi ulang.</p>
                            </div>
                        </div>
                    </li>
                    <li className="p-4 flex items-start gap-4">
                        <CalendarRangeIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg mb-2">Perpanjangan (<em>Extension</em>)</p>
                            <div>
                                <p>Jika ingin melakukan perpanjangan waktu menginap, silakan hubungi resepsionis/<em>front office</em>.</p>
                                <p>Tidak semua permohonan perpanjangan dapat dikabulkan, tergantung ketersediaan kamar hotel.</p>
                            </div>
                        </div>
                    </li>
                    <li className="p-4 flex items-start gap-4 border-b">
                        <HelpingHandIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg mb-2">Layanan Tambahan</p>
                            <div>
                                <p>Semua layanan yang telah ditambahkan pada saat booking akan <strong>dibayarkan saat check out</strong>.</p>
                                <p>Untuk memesan layanan tambahan lain, silakan hubungi resepsionis/<em>front office</em> saat menginap.</p>
                            </div>
                        </div>
                    </li>
                    <li className="p-4 flex items-start gap-4">
                        <BanknoteIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg mb-2">Deposit Check-in</p>
                            <div>
                                <p>Saat check-in, Anda wajib melakukan <strong>deposit menginap sebesar Rp 300.000</strong>.</p>
                                <p>Uang deposit ini akan digunakan untuk membayar layanan yang Anda pesan dan dikembalikan saat Anda check-out.</p>
                            </div>
                        </div>
                    </li>
                </ul>

                <hr className="my-4" />

                <h2 className="text-xl font-bold mb-2">Rincian Harga</h2>
                <ul className="list-none mb-6 border rounded-lg overflow-auto shadow">
                    {kamarGroupedByJenis?.map((item) => (
                        <li className="p-4 border-b flex justify-between" key={item.jenis_kamar?.id}>
                            <div className="flex-1">
                                <div className="font-bold">{item.jenis_kamar?.nama}</div>
                                <div className="text-muted-foreground text-sm">{item.amount} kamar &times; {detail?.jumlah_malam} malam</div>
                                <div>{Formatter.formatCurrency(item.harga)}/kamar/malam</div>
                            </div>
                            <div className="font-bold">
                                {Formatter.formatCurrency(item.harga * item.amount * (detail?.jumlah_malam ?? 0))}
                            </div>
                        </li>
                    ))}
                    <li className="p-1 -mt-[1px] flex justify-between bg-secondary"></li>
                    <li className="p-4">
                        {/* <div className="font-bold">Biaya Lain</div> */}
                        <div className="flex justify-between">
                            <div>Pajak Kamar</div>
                            <div className="text-green-600">Termasuk</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Biaya Layanan</div>
                            <div className="text-green-600">Termasuk</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Biaya Penelitian & Pengembangan Sistem</div>
                            <div className="text-green-600 font-bold">GRATIS</div>
                        </div>
                    </li>
                    <li className="p-1 flex justify-between bg-secondary"></li>
                    <li className="p-4 flex justify-between">
                        <div className="font-bold">Total Harga {detail?.jumlah_malam!! > 1 && `${detail?.jumlah_malam} Malam`}</div>
                        <div className="font-bold">
                            {Formatter.formatCurrency(detail?.total ?? 0)}
                        </div>
                    </li>
                    <li className="px-4 py-2 flex justify-between bg-secondary text-sm text-muted-foreground">
                        Layanan tambahan dan permintaan khusus akan dibayar saat check out.
                    </li>
                </ul>

                <div className="md:flex justify-between mt-4 gap-4">
                    <div className="mb-4 lg:mb-0">
                        <div className="mb-1 font-bold">Persetujuan</div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="waktuCI" checked={checkSudahBaca} onCheckedChange={(checked) => setCheckSudahBaca(checked === true)} />
                            <label htmlFor="waktuCI" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Saya sudah membaca dan menyetujui semua aturan akomodasi
                            </label>
                        </div>
                    </div>
                    <Button className="text-lg h-14 px-6" onClick={submitData} disabled={!checkSudahBaca}>
                        Lanjut ke Pembayaran <ArrowRightIcon className="w-6 h-6 ms-2" />
                    </Button>
                </div>

            </div>
            <div className="lg:w-96 flex-shrink-0">
                <Card className="sticky top-32 shadow-lg overflow-auto lg:max-h-[calc(100vh-10rem)]">
                    <CardHeader>
                        Ringkasan
                    </CardHeader>
                    {detail && (
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Check in:</span>
                                    <span className="font-bold">{Formatter.formatDate(new Date(detail.arrival_date))}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Check out:</span>
                                    <span className="font-bold">{Formatter.formatDate(new Date(detail.departure_date))}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Jumlah malam:</span>
                                    <span className="font-bold">{detail?.jumlah_malam} malam</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Jumlah kamar:</span>
                                    <span className="font-bold">{detail.reservasi_rooms?.length ?? "Tidak ada"} kamar</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Jumlah tamu:</span>
                                    <span className="font-bold">{detail.jumlah_dewasa} dewasa &bull; {detail.jumlah_anak} anak</span>
                                </div>
                                <hr className="my-2" />
                                <ul className="list-none">
                                    <li>Rincian kamar:</li>
                                    {kamarGroupedByJenis?.map((item, index) => (
                                        <li key={index} className="flex border-b items-center">
                                            <div className="py-4 flex-1">
                                                <div className="font-bold">{item.amount} {item.jenis_kamar?.nama}</div>
                                                <div className="text-sm flex flex-wrap gap-2 lg:gap-4 mt-1">
                                                    <div className="flex gap-2 items-center">
                                                        <UserIcon className="w-4 h-4" /> {item.jenis_kamar?.kapasitas} Dewasa
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <BedSingleIcon className="w-4 h-4" /> {Formatter.formatJSON<[]>(item.jenis_kamar?.tipe_bed)?.join(" atau ")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <div>{Formatter.formatCurrency(item.harga * item.amount)}</div>
                                                <div className="text-sm text-muted-foreground">per malam</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Harga per malam:</span>
                                    <span className="font-bold">{Formatter.formatCurrency(detail.total / detail.jumlah_malam)}</span>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </section>

        <GeneralLoadingDialog show={isLoading} />
    </>
}