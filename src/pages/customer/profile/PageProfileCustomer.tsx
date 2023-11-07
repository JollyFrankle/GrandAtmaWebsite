import { Button } from "@/cn/components/ui/button"
import IconInput from "@/components/IconInput"
import IconSelect from "@/components/IconSelect"
import IconTextarea from "@/components/IconTextarea"
import usePageTitle from "@/hooks/usePageTitle"
import ModalSaveConfirm from "@/pages/admin/_layout/components/ModalSaveConfirm"
import { ApiErrorResponse, ApiResponse, KeyValue, UserCustomer, apiAuthenticated } from "@/utils/ApiModels"
import AuthHelper from "@/utils/AuthHelper"
import Formatter from "@/utils/Formatter"
import { AxiosError } from "axios"
import { ArrowLeftIcon, AsteriskIcon, BanIcon, BookUserIcon, CreditCardIcon, EditIcon, MailIcon, MapPinIcon, PhoneCallIcon, SaveIcon, UserIcon } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"


export default function PageProfileCustomer() {
    const user = AuthHelper.getUserCustomer()!!
    user.password = ""
    const [isEditing, setIsEditing] = useState(false)
    const [data, setData] = useState(user)
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [changePassword, setChangePassword] = useState(false)
    const [errors, setErrors] = useState<KeyValue<string>|null>(null)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)

    usePageTitle("Profil - Grand Atma Hotel")

    const onInputChangeHandler = (value: string, key: keyof typeof data) => {
        setData(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const resetToDefault = () => {
        setData(user)
        setIsEditing(false)
    }

    const showConfirmModalBeforeSaving = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setOpenModalConfirm(true)
    }

    const saveProfile = () => {
        if (data.password !== passwordConfirmation) {
            setErrors(prev => ({
                ...prev,
                password: "Kata sandi tidak sama",
                passconf: "Kata sandi tidak sama"
            }))
            return
        }
        apiAuthenticated.put<ApiResponse<UserCustomer>>(`customer/user`, {
            ...data,
            old_password: oldPassword,
        }).then((res) => {
            const data = res.data
            data.data.password = ""
            AuthHelper.setUserCustomer(data.data)
            setData(data.data)
            setIsEditing(false)
            toast(data.message, {
                type: "success"
            })
            setErrors(null)
        }).catch((err: AxiosError) => {
            console.log(err)
            if (err.response?.data) {
                const data = err.response.data as ApiErrorResponse
                setErrors(data.errors)
                toast(data.message || "Terjadi kesalahan", {
                    type: "error"
                })
            }
        })
    }

    const changePasswordHandler = () => {
        setPasswordConfirmation("")
        setOldPassword("")
        onInputChangeHandler("", "password")
        setChangePassword(prev => !prev)
    }

    return <>
        <section className="mt-24 py-8">
            <div className="container relative">
                <div className="flex justify-between items-end">
                    <h3 className="text-3xl font-bold">
                        <Button variant="ghost" asChild className="me-2">
                            <Link to="/customer"><ArrowLeftIcon className="h-4 w-4" /></Link>
                        </Button>
                        <mark>Profil</mark> Anda
                    </h3>
                    <Button onClick={() => setIsEditing(true)} hidden={isEditing}>
                        <EditIcon className="h-4 w-4 me-2" /> Ubah Profil
                    </Button>
                </div>

                <hr className="my-6" />

                <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={showConfirmModalBeforeSaving}>
                    <div className="col-span-1">
                        <h4 className="text-xl font-bold mb-2">Otentikasi</h4>
                        <IconInput
                            required
                            disabled={!isEditing}
                            value={data.email}
                            icon={<MailIcon />}
                            type="email"
                            label="Alamat e-mail"
                            maxLength={100}
                            onValueChange={(value) => onInputChangeHandler(value, "email")}
                            errorText={errors?.email} />

                        <div hidden={!isEditing}>
                            <p className="text-muted-foreground text-sm">
                                <Button type="button" variant="link" className="px-0" onClick={changePasswordHandler}>Ubah Kata Sandi</Button>
                                <span className="ms-2">{data.password_last_changed ? `Terakhir diubah ${Formatter.formatDateTime(new Date(data.password_last_changed))}` : `Belum pernah diubah sebelumnya`}.</span>
                            </p>

                            <div className="mb-4" hidden={!changePassword}>
                                <IconInput
                                    value={oldPassword}
                                    icon={<AsteriskIcon />}
                                    type="password"
                                    label="Kata sandi lama"
                                    maxLength={100}
                                    onValueChange={setOldPassword}
                                    errorText={errors?.old_password} />

                                <IconInput
                                    value={data.password}
                                    icon={<AsteriskIcon />}
                                    type="password"
                                    label="Kata sandi baru"
                                    maxLength={100}
                                    onValueChange={(value) => onInputChangeHandler(value, "password")}
                                    errorText={errors?.password} />

                                <IconInput
                                    value={passwordConfirmation}
                                    icon={<AsteriskIcon />}
                                    type="password"
                                    label="Konfirmasi kata sandi baru"
                                    maxLength={100}
                                    onValueChange={setPasswordConfirmation}
                                    errorText={errors?.passconf} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-xl font-bold mb-2">Identitas</h4>
                        <IconInput
                            required
                            disabled={!isEditing}
                            value={data.nama}
                            icon={<UserIcon />}
                            type="text"
                            label="Nama"
                            maxLength={100}
                            onValueChange={(value) => onInputChangeHandler(value, "nama")}
                            errorText={errors?.nama} />

                        <IconSelect
                            required
                            disabled={!isEditing}
                            value={data.jenis_identitas}
                            icon={<CreditCardIcon />}
                            label="Jenis identitas"
                            onValueChange={(value) => onInputChangeHandler(value, "jenis_identitas")}
                            errorText={errors?.jenis_identitas}
                            values={[
                                { value: "ktp", label: "KTP" },
                                { value: "sim", label: "SIM" },
                                { value: "paspor", label: "Paspor" }
                            ]} />

                        <IconInput
                            required
                            disabled={!isEditing}
                            value={data.no_identitas}
                            icon={<BookUserIcon />}
                            type="text"
                            label="Nomor identitas"
                            maxLength={20}
                            onValueChange={(value) => onInputChangeHandler(value, "no_identitas")}
                            errorText={errors?.no_identitas} />
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-xl font-bold mb-2">Kontak</h4>
                        <IconInput
                            required
                            disabled={!isEditing}
                            value={data.no_telp}
                            icon={<PhoneCallIcon />}
                            type="text"
                            label="Nomor telepon"
                            maxLength={50}
                            onValueChange={(value) => onInputChangeHandler(value, "no_telp")}
                            errorText={errors?.no_telp} />

                        <IconTextarea
                            required
                            disabled={!isEditing}
                            value={data.alamat}
                            icon={<MapPinIcon />}
                            label="Alamat"
                            maxLength={254}
                            rows={3}
                            onValueChange={(value) => onInputChangeHandler(value, "alamat")}
                            errorText={errors?.alamat} />
                    </div>
                    <div className="col-span-3 text-center" hidden={!isEditing}>
                        <Button className="w-full md:w-auto me-3" variant="secondary" type="button" onClick={resetToDefault}><BanIcon className="w-4 h-4 me-2" /> Batal</Button>
                        <Button className="w-full md:w-auto" type="submit"><SaveIcon className="w-4 h-4 me-2" /> Simpan</Button>
                    </div>
                </form>
            </div>
        </section>

        <ModalSaveConfirm open={openModalConfirm} onOpenChange={setOpenModalConfirm} onConfirmed={saveProfile} />
    </>
}