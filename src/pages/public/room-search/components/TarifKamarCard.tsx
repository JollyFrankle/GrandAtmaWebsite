import Formatter from "@/utils/Formatter"
import { KamarDipesan, TarifKamar } from "../PageRoomSearch"
import { Card, CardContent, CardHeader } from "@/cn/components/ui/card"
import { Button } from "@/cn/components/ui/button"
import { AlertOctagonIcon, ArrowRightIcon, BedDoubleIcon, CheckIcon, LandPlotIcon, MinusIcon, PlusIcon, StarIcon, UserIcon, XCircleIcon } from "lucide-react"
import Converter from "@/utils/Converter"
import { getImage } from "@/utils/ApiModels"
import InlineLink from "@/components/InlineLink"


export default function TarifKamarCard({
    kamarDipesan,
    item,
    jumlahKamarYangDipesan,
    jumlahKamarSaatIni,
    onKamarDipesanChange,
    showSelectAll
}: {
    kamarDipesan: KamarDipesan[],
    item: TarifKamar,
    jumlahKamarYangDipesan: number,
    jumlahKamarSaatIni: number,
    onKamarDipesanChange: (rincianTarif: TarifKamar, amount: 1 | 0 | -1) => void,
    showSelectAll?: boolean
}) {
    const objKD = kamarDipesan.find(kamar => kamar.idJK === item.jenis_kamar.id)
    const btnMinusDisabled = (objKD?.count ?? 0) <= 0
    const btnPlusDisabled = jumlahKamarSaatIni >= jumlahKamarYangDipesan || (objKD?.count ?? 0) >= item.rincian_tarif.jumlah_kamar
    const btnBulkAddDisabled = jumlahKamarSaatIni >= jumlahKamarYangDipesan || (objKD?.count ?? 0) >= item.rincian_tarif.jumlah_kamar
    return (
        <Card className={`shadow-lg mb-8 lg:grid grid-cols-3 overflow-auto ${item.rincian_tarif.jumlah_kamar <= 0 ? 'transition-all opacity-50' : ''}`}>
            <img src={getImage(item.jenis_kamar.gambar)} className="col-span-1 min-h-[18rem] object-cover w-full h-full" />
            <div className="col-span-2">
                <CardHeader className="md:flex flex-row justify-between items-center pb-2">
                    <div className="flex items-center">
                        <h2 className="text-xl font-bold me-4">{item.jenis_kamar.nama}</h2>
                        <span className="flex items-center"><StarIcon className="text-orange-400 w-4 h-4 me-1" /> {Formatter.formatNumber(item.jenis_kamar.rating)}</span>
                    </div>
                    <InlineLink to={`/kamar/${item.jenis_kamar.id}`}>
                        Detail kamar <ArrowRightIcon className="ms-2 w-4 h-4" />
                    </InlineLink>
                </CardHeader>
                <CardContent>
                    <div className="md:flex mb-4">
                        <div className="flex-1">
                            <div className="flex gap-2 md:gap-4 flex-wrap">
                                <div className="flex items-center">
                                    <UserIcon className="w-4 h-4 me-2" /> {item.jenis_kamar.kapasitas} orang
                                </div>
                                <div className="flex items-center">
                                    <LandPlotIcon className="w-4 h-4 me-2" /> <span>{item.jenis_kamar.ukuran} m<sup>2</sup> ({Formatter.formatNumber(Converter.mToFt(item.jenis_kamar.ukuran))} ft<sup>2</sup>)</span>
                                </div>
                                <div className="flex items-center">
                                    <BedDoubleIcon className="w-4 h-4 me-2" /> {Formatter.formatJSON<string[]>(item.jenis_kamar.tipe_bed)?.join(" atau ")}
                                </div>
                            </div>
                            <hr className="my-4" />
                            <ul className="list-none md:grid grid-cols-2 gap-2">
                                {Formatter.formatJSON<string[]>(item.jenis_kamar.rincian)?.slice(0, 10).map((fas, index) => (
                                    <li key={index} className="col-span-1 flex items-center"><CheckIcon className="text-green-500 w-4 h-4 me-2" /> {fas}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative text-center md:text-end md:w-36 md:ms-4 flex flex-col justify-end">
                            {item.rincian_tarif.harga_diskon < item.rincian_tarif.harga ? <>
                                <div className="text-gray-400 -mb-1 line-through">{Formatter.formatCurrency(item.rincian_tarif.harga)}</div>
                                <div className="text-green-600 font-bold text-xl">{Formatter.formatCurrency(item.rincian_tarif.harga_diskon)}</div>
                            </> : (
                                <div className="font-bold text-xl">{Formatter.formatCurrency(item.rincian_tarif.harga_diskon)}</div>
                            )}
                            <div className="text-muted-foreground">/malam/kamar</div>
                        </div>
                    </div>
                    <div className="block md:flex justify-between items-end">
                        <div>
                            {item.rincian_tarif.catatan.length > 0 && <>
                                <p className="text-sm text-muted-foreground font-bold">Catatan:</p>
                                {item.rincian_tarif.catatan.map((catatan, index) => (
                                    catatan.type === "w" ? (
                                        <p key={index} className="text-sm text-orange-600 flex items-center">
                                            <AlertOctagonIcon className="w-4 h-4 me-1" /> {catatan.message}
                                        </p>
                                    ) : (
                                        <p key={index} className="text-sm text-red-600 font-bold flex items-center">
                                            <XCircleIcon className="w-4 h-4 me-1" /> {catatan.message}
                                        </p>
                                    )
                                ))}
                            </>}
                        </div>
                        <div className="flex border rounded overflow-auto items-stretch w-fit mx-auto md:me-0">
                            {showSelectAll && (
                                <Button className="rounded-none px-3" onClick={() => onKamarDipesanChange(item, 0)} disabled={btnBulkAddDisabled}>
                                    Pilih Semua
                                </Button>
                            )}
                            <div className="flex items-center px-4 bg-secondary">Jumlah kamar:</div>
                            <Button variant="ghost" className="rounded-none px-3" onClick={() => onKamarDipesanChange(item, -1)} disabled={btnMinusDisabled}>
                                <MinusIcon className="w-4 h-4" />
                            </Button>
                            <span className="px-2 py-2 w-10 text-center">{objKD?.count ?? 0}</span>
                            <Button variant="ghost" className="rounded-none px-3" onClick={() => onKamarDipesanChange(item, 1)} disabled={btnPlusDisabled}>
                                <PlusIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}