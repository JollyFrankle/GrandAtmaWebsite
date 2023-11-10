import { Card, CardContent, CardHeader } from "@/cn/components/ui/card"
import { ApiErrorResponse, ApiResponse, JenisKamar, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import { AxiosError } from "axios"
import { ArrowLeftCircleIcon, BanknoteIcon, BedSingleIcon, CheckCheckIcon, CopyIcon, UserIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/cn/components/ui/button"
import GeneralLoadingDialog from "@/components/GeneralLoadingDialog"
import { toast } from "react-toastify"

import BankDiamond from "@/assets/images/bank-diamond.png"
import { Input } from "@/cn/components/ui/input"
import IconInput from "@/components/IconInput"
import usePageTitle from "@/hooks/usePageTitle"
import AuthHelper from "@/utils/AuthHelper"
import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"
import InlineLink from "@/components/InlineLink"

const urls = {
    getDetail: '',
    submitData: ''
}

export default function PageBookingStep3_P() {
    const params = useParams<{ idR: string, idC: string }>()
    const { idR, idC } = params

    const [detail, setDetail] = useState<Reservasi>()
    const [isLoading, setIsLoading] = useState(true)
    const [kamarGroupedByJenis, setKamarGroupedByJenis] = useState<{ jenis_kamar?: JenisKamar, amount: number, harga: number }[]>()
    const [jumlahDP, setJumlahDP] = useState("")
    const [jumlahDPError, setJumlahDPError] = useState<string | undefined>()

    const navigate = useNavigate()
    usePageTitle(`Pembayaran #${detail?.id_booking} – Grand Atma Hotel`)

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
        }).catch((err: AxiosError) => {
            console.log(err)
        })
    }

    const submitData = () => {
        apiAuthenticated.post<ApiResponse<{ reservasi: Reservasi }>>(urls.submitData, {
            jumlah_dp: +jumlahDP
        }).then((res) => {
            const data = res.data
            setDetail(data.data.reservasi)
            toast.success("Reservasi berhasil dibuat.")
            navigate(`../step-4`)
        }).catch((err: AxiosError) => {
            if (err.response?.data) {
                const data = err.response.data as ApiErrorResponse
                toast.error(data.message)
            } else {
                toast.error("Terjadi kesalahan saat mengunggah data")
            }
            setIsLoading(false)
        })
    }

    useEffect(() => {
        if (AuthHelper.getUserCustomer()) {
            urls.getDetail = `customer/reservasi/${idR}`
            urls.submitData = `customer/booking/${idR}/step-3`
        } else if (AuthHelper.getUserPegawai()) {
            urls.getDetail = `pegawai/reservasi/${idC}/${idR}`
            urls.submitData = `pegawai/booking/${idR}/step-3`
        }

        Promise.all([getDetailReservasi()]).finally(() => {
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        const jumlahDPAsNumber = +jumlahDP
        const total = detail?.total ?? 0
        if (jumlahDPAsNumber) {
            if (jumlahDPAsNumber < total / 2) {
                setJumlahDPError("Jumlah DP tidak boleh kurang dari 50% dari total biaya kamar")
            } else if (jumlahDPAsNumber > total) {
                setJumlahDPError("Jumlah DP tidak boleh lebih dari total biaya kamar")
            } else {
                setJumlahDPError(undefined)
            }
        } else {
            setJumlahDPError(undefined)
        }
    }, [jumlahDP])

    return <>
        <section className="container py-8 flex flex-col-reverse lg:flex-row gap-6 mb-4">
            <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Pembayaran</h2>
                <Card className="flex flex-col md:flex-row items-center mb-4 overflow-auto">
                    <img src={BankDiamond} className="w-full lg:h-36 lg:w-auto aspect-video" />
                    <div className="p-4">
                        <div>Melalui gerbang pembayaran:</div>
                        <div className="font-bold text-xl">Bank Diamond</div>
                    </div>
                </Card>

                <ul className="list-none mb-6 border rounded-lg overflow-auto shadow text-lg">
                    <li className="pt-4 px-4 md:flex justify-between items-center">
                        <div>Bank Tujuan:</div>
                        <div className="font-bold relative md:w-72">
                            <Input className="text-xl border-0 bg-secondary" readOnly value="Bank Diamond cb. Atma Jaya" />
                        </div>
                    </li>
                    <li className="p-4 md:flex justify-between items-center">
                        <div>Nomor Rekening:</div>
                        <div className="font-bold relative md:w-72">
                            <Input className="text-xl tracking-widest border-0 bg-secondary" readOnly value="770011770022" />
                            <Button className="absolute top-0 right-0 px-4" onClick={() => {
                                navigator.clipboard.writeText("770011770022")
                                toast.success("Nomor rekening berhasil disalin")
                            }} variant="link">
                                <CopyIcon className="w-4 h-4 me-2" /> Salin
                            </Button>
                        </div>
                    </li>
                    <li className="pb-4 px-4 md:flex justify-between items-center">
                        <div>Nama Pemilik Rekening:</div>
                        <div className="font-bold relative md:w-72">
                            <Input className="text-xl border-0 bg-secondary" readOnly value="PT ATMA JAYA" />
                        </div>
                    </li>
                    <li className="pb-4 px-4 md:flex justify-between items-center">
                        <div>Total Biaya Kamar:</div>
                        <div className="font-bold relative md:w-72">
                            <Input className="text-xl border-0 bg-secondary" readOnly value={Formatter.formatCurrency(detail?.total ?? 0)} />
                        </div>
                    </li>
                    <li className="p-4 md:flex justify-between items-center bg-secondary">
                        <div>Minimal <em>Down-Payment</em> (DP)</div>
                        <div className="font-bold relative md:w-72">
                            <Input className="text-xl border-0 text-green-600 bg-white" readOnly value={Formatter.formatCurrency((detail?.total ?? 0) / 2)} />
                            <Button className="absolute top-0 right-0 px-4" onClick={() => {
                                navigator.clipboard.writeText(((detail?.total ?? 0) / 2).toString())
                                toast.success("Total transfer berhasil disalin")
                            }} variant="link">
                                <CopyIcon className="w-4 h-4 me-2" /> Salin
                            </Button>
                        </div>
                    </li>
                    <li className="p-4 md:flex justify-between items-center bg-green-100">
                        <div>Jumlah Dibayar:</div>
                        <div className="md:w-72">
                            <IconInput
                                icon={<div className="text-base text-muted-foreground">Rp</div>}
                                placeholder="Jumlah DP"
                                inputClassName="text-xl font-bold"
                                className="mb-0"
                                type="number"
                                min={0}
                                value={jumlahDP}
                                onValueChange={setJumlahDP}
                                errorText={jumlahDPError} />
                            <div className="text-sm mt-2">Terbaca: <strong>{Formatter.formatCurrency(+jumlahDP)}</strong></div>
                        </div>
                    </li>
                </ul>

                <h2 className="text-xl font-bold mb-2">Rincian Harga</h2>
                <p className="text-muted-foreground mb-4">Dikirimkan kepada customer jika dibutuhkan.</p>

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
                            <div>Pajak</div>
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

                <Alert>
                    <BanknoteIcon className="w-4 h-4" />
                    <AlertTitle>Mohon diperhatikan!</AlertTitle>
                    <AlertDescription>
                        <div className="font-bold mb-2">Hanya klik tombol "Customer Sudah Membayar" jika customer benar-benar sudah melakukan pembayaran dan diverifikasi.</div>
                        <div>Jika customer ingin membayar kemudian (perhatikan waktu jatuh tempo pemensanan di atas halaman), Anda bisa melanjutkan reservasi ini dengan menekan tindakan "Lanjutkan" pada halaman <InlineLink to="/admin/reservasi">Reservasi Group</InlineLink>.</div>
                    </AlertDescription>
                </Alert>

                <div className="flex mt-4 flex-col-reverse items-center md:flex-row md:justify-between md:items-end gap-4">
                    <div className="mb-4 lg:mb-0">
                    <Button variant="secondary" asChild>
                        <Link to="/admin/reservasi"><ArrowLeftCircleIcon className="w-4 h-4 me-2" /> Kembali ke Daftar Reservasi</Link>
                    </Button>

                    </div>
                    <Button className="whitespace-nowrap text-lg h-14 px-6" onClick={submitData} disabled={isLoading || jumlahDPError !== undefined || (+jumlahDP <= 0)}>
                        Customer Sudah Membayar <CheckCheckIcon className="w-6 h-6 ms-2" />
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