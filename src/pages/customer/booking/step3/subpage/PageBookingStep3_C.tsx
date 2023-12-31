import { Card, CardContent, CardHeader } from "@/cn/components/ui/card"
import { ApiResponse, JenisKamar, Reservasi, apiAuthenticated } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import { BanknoteIcon, BedSingleIcon, CopyIcon, InfoIcon, Trash2Icon, UserIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/cn/components/ui/button"
import GeneralLoadingDialog from "@/components/loading/GeneralLoadingDialog"
import { toast } from "react-toastify"

import BankDiamond from "@/assets/images/bank-diamond.png"
import { Input } from "@/cn/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"
import IconInput from "@/components/IconInput"
import usePageTitle from "@/hooks/usePageTitle"
import AuthHelper from "@/utils/AuthHelper"

const urls = {
    getDetail: '',
    submitData: ''
}

export default function PageBookingStep3_C() {
    const params = useParams<{ idR: string, idC: string }>()
    const { idR, idC } = params

    const [detail, setDetail] = useState<Reservasi>()
    const [isLoading, setIsLoading] = useState(true)
    const [kamarGroupedByJenis, setKamarGroupedByJenis] = useState<{ jenis_kamar?: JenisKamar, amount: number, harga: number }[]>()
    const [fileBukti, setFileBukti] = useState<File>()

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
        })
    }

    const onBuktiSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 8 * 1024 * 1024) {
                toast.error("Ukuran file terlalu besar. Maksimal 8 MB.")
                return
            } else if (!file.type.startsWith("image/")) {
                toast.error("File yang diunggah harus berupa gambar.")
                return
            } else {
                setFileBukti(file)
            }
            e.target.value = ""
        }
    }

    const submitData = () => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("bukti", fileBukti as Blob)

        apiAuthenticated.post<ApiResponse<{ reservasi: Reservasi }>>(urls.submitData,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then((res) => {
            const data = res.data
            setDetail(data.data.reservasi)
            toast.success("Reservasi berhasil dibuat.")
            navigate(`../step-4`)
        }).finally(() => {
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

    return <>
        <section className="container py-8 flex flex-col-reverse lg:flex-row gap-6 mb-4">
            <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Pembayaran</h2>
                <Card className="flex flex-col md:flex-row items-center mb-4 overflow-auto">
                    <img src={BankDiamond} className="w-full lg:h-36 lg:w-auto aspect-video" />
                    <div className="p-4">
                        <div>Silakan transfer ke:</div>
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
                    <li className="p-4 md:flex justify-between items-center bg-secondary">
                        <div>Total Transfer</div>
                        <div className="font-bold relative md:w-72">
                            <Input className="text-xl border-0 text-green-600 bg-white" readOnly value={Formatter.formatCurrency(detail?.total ?? 0)} />
                            <Button className="absolute top-0 right-0 px-4" onClick={() => {
                                navigator.clipboard.writeText((detail?.total ?? 0).toString())
                                toast.success("Total transfer berhasil disalin")
                            }} variant="link">
                                <CopyIcon className="w-4 h-4 me-2" /> Salin
                            </Button>
                        </div>
                    </li>
                </ul>

                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Unggah Bukti Transfer</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Alert className="mb-4 shadow">
                                <InfoIcon className="w-4 h-4 me-2" />
                                <AlertTitle>Informasi</AlertTitle>
                                <AlertDescription>
                                    Setelah transfer, silakan unggah bukti transfer melalui tombol di bawah. Pembayaran Anda akan otomatis diverifikasi dalam beberapa saat setelah Anda mengunggah bukti transfer.
                                </AlertDescription>
                            </Alert>
                            {fileBukti ? (
                                <div className="mt-2">
                                    <Button className="w-full" onClick={() => setFileBukti(undefined)} variant="outline">
                                        Hapus Bukti Transfer <Trash2Icon className="w-4 h-4 ms-2" />
                                    </Button>
                                </div>
                            ) : (
                                <IconInput
                                    icon={<BanknoteIcon className="w-6 h-6" />}
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    onChange={onBuktiSelected} />
                            )}
                        </div>
                        <div className="flex-1 rounded shadow overflow-auto aspect-square bg-secondary">
                            {fileBukti && (
                                <img src={URL.createObjectURL(fileBukti)} className="w-full h-full object-contain" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:flex mt-4">
                    <Button className="flex-1 text-lg h-14 px-6" onClick={submitData} disabled={isLoading || !fileBukti}>
                        Saya Sudah Membayar <BanknoteIcon className="w-6 h-6 ms-2" />
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