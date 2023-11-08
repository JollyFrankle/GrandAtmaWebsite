import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"
import { Card, CardContent, CardHeader } from "@/cn/components/ui/card"
import { ApiErrorResponse, ApiResponse, FasilitasLayananTambahan, JenisKamar, Reservasi, apiAuthenticated, apiPublic } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import { AxiosError } from "axios"
import { AlertOctagonIcon, ArrowRightIcon, BanIcon, BedSingleIcon, Clock11Icon, Clock4Icon, HelpingHandIcon, UserIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import BookingS1FasiltasItem from "./components/BookingS1FasiltasItem"
import IconTextarea from "@/components/IconTextarea"
import { Button } from "@/cn/components/ui/button"
import IconSelect from "@/components/IconSelect"
import { Checkbox } from "@/cn/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/cn/components/ui/dialog"
import GeneralLoadingDialog from "@/components/GeneralLoadingDialog"
import { toast } from "react-toastify"
import usePageTitle from "@/hooks/usePageTitle"

export interface PBS1SelectedFasilitas {
    id: number,
    amount: number
}

export interface PBS1CheckInOut {
    enabled: boolean,
    value: string
}

const waktuCICO = [...Array(24).keys()].map((item) => {
    const hour = Formatter.padZero(item)
    return { label: `${hour}:00`, value: `${hour}:00` }
})

export default function PageBookingStep1() {
    const params = useParams<{ id: string }>()
    const { id } = params

    const [detail, setDetail] = useState<Reservasi>()
    const [isLoading, setIsLoading] = useState(true)
    const [selectedFasilitas, setSelectedFasilitas] = useState<PBS1SelectedFasilitas[]>([])
    const [listFasilitas, setListFasilitas] = useState<FasilitasLayananTambahan[]>([])
    const [permintaanTambahan, setPermintaanTambahan] = useState("")
    const [kamarGroupedByJenis, setKamarGroupedByJenis] = useState<{ jenis_kamar?: JenisKamar, amount: number, harga: number }[]>()
    const [waktuCheckIn, setWaktuCheckIn] = useState<PBS1CheckInOut>({
        enabled: false,
        value: ""
    })
    const [waktuCheckOut, setWaktuCheckOut] = useState<PBS1CheckInOut>({
        enabled: false,
        value: ""
    })
    const [showDialogConfirm, setShowDialogConfirm] = useState(false)

    const navigate = useNavigate()
    usePageTitle(`Pengisian Data #${Formatter.padZero(+(id ?? 0), 8)} – Grand Atma Hotel`)

    const fetchFasilitas = async () => {
        return apiPublic.get<ApiResponse<FasilitasLayananTambahan[]>>(`public/layanan-tambahan`).then((res) => {
            const data = res.data
            setListFasilitas(data.data)
        })
    }

    const getDetailReservasi = async () => {
        return apiAuthenticated.get<ApiResponse<Reservasi>>(`customer/reservasi/${id}`).then((res) => {
            const data = res.data
            setDetail(data.data)

            // Group kamar by jenis kamar
            const kamarGroupedByJenis: { jenis_kamar?: JenisKamar, amount: number, harga: number }[] = []
            data.data.reservasi_rooms?.forEach((item) => {
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
        setShowDialogConfirm(false)
        setIsLoading(true)
        apiAuthenticated.post<ApiResponse<{ reservasi: Reservasi, layanan_tambahan: FasilitasLayananTambahan[] }>>(`customer/booking/${id}/step-1`, {
            layanan_tambahan: selectedFasilitas,
            permintaan_khusus: {
                expected_check_in: waktuCheckIn.value,
                expected_check_out: waktuCheckOut.value,
                permintaan_tambahan_lain: permintaanTambahan.trim()
            }
        }).then((res) => {
            const data = res.data
            setDetail(data.data.reservasi)
            navigate(`../step-2`)
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

    const updateJumlahFasilitas = (id: number, amount: 1 | -1) => {
        const index = selectedFasilitas.findIndex((item) => item.id == id)
        if (index == -1) {
            setSelectedFasilitas(prev => {
                const newArr = [...prev]
                newArr.push({ id: id, amount: amount })
                return newArr
            })
        } else {
            setSelectedFasilitas(prev => {
                const newArr = [...prev]
                newArr[index].amount += amount
                if (newArr[index].amount <= 0) {
                    newArr.splice(index, 1)
                }
                return newArr
            })
        }
    }

    useEffect(() => {
        Promise.all([getDetailReservasi(), fetchFasilitas()]).finally(() => {
            setIsLoading(false)
        })
    }, [])

    return <>
        <section className="container py-8 flex flex-col-reverse lg:flex-row gap-6 mb-4">
            <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Data Kontak & Tamu</h2>
                <p className="text-secondary-foreground mb-2">Data kontak yang digunakan dalam pemesanan ini sesuai dengan profil Anda yang sedang masuk akun saat ini.</p>

                <Alert className="mb-4 shadow">
                    <AlertOctagonIcon className="w-4 h-4 me-2" />
                    <AlertTitle>Informasi</AlertTitle>
                    <AlertDescription>
                        Pastikan Anda menyiapkan identitas sesuai dengan data berikut saat check in.
                    </AlertDescription>
                </Alert>

                <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mb-4">
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

                <hr className="my-4" />
                <h2 className="text-xl font-bold mb-2">Layanan Tambahan</h2>
                <p className="text-secondary-foreground mb-2">Layanan tambahan yang dapat Anda pesan sebelum check in.</p>

                <Alert className="mb-4 shadow">
                    <AlertOctagonIcon className="w-4 h-4 me-2" />
                    <AlertTitle>Informasi</AlertTitle>
                    <AlertDescription>
                        Biaya layanan tambahan akan ditagihkan saat check out.
                    </AlertDescription>
                </Alert>

                <ul className="list-none mb-6 border rounded-lg overflow-auto shadow">
                    {listFasilitas?.map((item) => (
                        <BookingS1FasiltasItem
                            item={item}
                            onAmountChange={updateJumlahFasilitas}
                            selectedFasilitas={selectedFasilitas.find((item2) => item2.id == item.id)}
                            key={item.id} />
                    ))}
                </ul>

                <hr className="my-4" />

                <h2 className="text-xl font-bold mb-2">Permintaan Khusus</h2>
                <p className="text-secondary-foreground mb-2">Anda dapat meminta waktu check in, check out, atau permintaan lain.</p>

                <Alert className="mb-4 shadow">
                    <AlertOctagonIcon className="w-4 h-4 me-2" />
                    <AlertTitle>Perlu diperhatikan</AlertTitle>
                    <AlertDescription>
                        Mungkin tidak semua permintaan dapat dipenuhi. Beberapa permintaan khusus mungkin dikenakan biaya tambahan. Biaya tambahan ini akan diinformasikan saat check in dan ditagihkan saat check out.
                    </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="col-span-1">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="waktuCI" checked={waktuCheckIn.enabled} onCheckedChange={(checked) => setWaktuCheckIn({ enabled: checked as boolean, value: "" })} />
                            <label htmlFor="waktuCI" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Waktu check in khusus
                            </label>
                        </div>
                        <IconSelect
                            className="mt-4"
                            disabled={!waktuCheckIn.enabled}
                            value={waktuCheckIn.value}
                            values={waktuCICO}
                            icon={<Clock11Icon />}
                            placeholder="Waktu check in"
                            onValueChange={(val) => setWaktuCheckIn({ enabled: true, value: val })}
                            errorText={(waktuCheckIn.enabled && !waktuCheckIn.value) ? "Waktu check in harus diisi!" : undefined} />
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="waktuCO" checked={waktuCheckOut.enabled} onCheckedChange={(checked) => setWaktuCheckOut({ enabled: checked as boolean, value: "" })} />
                            <label htmlFor="waktuCO" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Waktu check out khusus
                            </label>
                        </div>
                        <IconSelect
                            className="mt-4"
                            disabled={!waktuCheckOut.enabled}
                            value={waktuCheckOut.value}
                            values={waktuCICO}
                            icon={<Clock4Icon />}
                            placeholder="Waktu check out"
                            onValueChange={(val) => setWaktuCheckOut({ enabled: true, value: val })}
                            errorText={(waktuCheckOut.enabled && !waktuCheckOut.value) ? "Waktu check out harus diisi!" : undefined} />
                    </div>
                </div>

                <IconTextarea
                    // disabled={!isEditing}
                    value={permintaanTambahan}
                    icon={<HelpingHandIcon />}
                    label="Permintaan tambahan lainnya"
                    placeholder="Tulis permintaan tambahan lainnya disini (jika ada)"
                    maxLength={254}
                    rows={3}
                    onValueChange={setPermintaanTambahan} />

                <div className="flex justify-end mt-4">
                    <Button className="text-lg h-14 px-6" onClick={() => setShowDialogConfirm(true)}>
                        Lanjut ke Resume <ArrowRightIcon className="w-6 h-6 ms-2" />
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
                                    <span className="text-secondary-foreground">Check in:</span>
                                    <span className="font-bold">{Formatter.formatDate(new Date(detail.arrival_date))}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-secondary-foreground">Check out:</span>
                                    <span className="font-bold">{Formatter.formatDate(new Date(detail.departure_date))}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-secondary-foreground">Jumlah malam:</span>
                                    <span className="font-bold">{detail?.jumlah_malam} malam</span>
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
                                                <div className="text-sm text-secondary-foreground">per malam</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center justify-between">
                                    <span className="text-secondary-foreground">Harga per malam:</span>
                                    <span className="font-bold">{Formatter.formatCurrency(detail.total / detail.jumlah_malam)}</span>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </section>

        <Dialog modal={true} open={showDialogConfirm} onOpenChange={setShowDialogConfirm}>
            <DialogContent>
                <DialogHeader className="font-bold">
                    Konfirmasi Data Pemesanan
                </DialogHeader>
                <div className="">
                    <p className="mb-4">Mohon pastikan ulang data berikut. Setelah Anda melanjutkan, data berikut tidak dapat diubah lagi:</p>
                    <p className="font-bold text-lg">Layanan Tambahan</p>
                    {selectedFasilitas.length === 0 && (
                        <div className="text-secondary-foreground">Tidak ada yang dipesan</div>
                    )}
                    <ul className="list-disc list-outside mb-4 ms-5">
                        {selectedFasilitas.map((item) => (
                            <li key={item.id}>({item.amount}&times;) {listFasilitas.find((item2) => item2.id == item.id)?.nama}</li>
                        ))}
                    </ul>

                    <p className="font-bold text-lg">Permintaan Khusus</p>
                    {!waktuCheckIn.value && !waktuCheckOut.value && !permintaanTambahan.trim() && (
                        <div className="text-secondary-foreground">Tidak ada permintaan khusus</div>
                    )}
                    <ul className="list-disc list-outside mb-4 ms-5">
                        {waktuCheckIn.value && (
                            <li>Waktu check in: <strong>{waktuCheckIn.value}</strong></li>
                        )}
                        {waktuCheckOut.value && (
                            <li>Waktu check out: <strong>{waktuCheckOut.value}</strong></li>
                        )}
                        {permintaanTambahan.trim() && (
                            <li>Permintaan tambahan: <pre>{permintaanTambahan}</pre></li>
                        )}
                    </ul>
                    <p className="text-secondary-foreground ">Apakah Anda yakin ingin melanjutkan pemesanan?</p>
                </div>
                <DialogFooter className="pt-4">
                    <Button variant="secondary" onClick={() => setShowDialogConfirm(false)}><BanIcon className="w-4 h-4 me-2" /> Batal</Button>
                    <Button onClick={submitData}>
                        Lanjutkan <ArrowRightIcon className="w-4 h-4 ms-2" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <GeneralLoadingDialog show={isLoading} />
    </>
}