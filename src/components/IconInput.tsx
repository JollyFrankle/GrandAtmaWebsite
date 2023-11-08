import { Input } from "@/cn/components/ui/input"
import InputWithIcon from "@/components/InputWithIcon"


export default function IconInput({
    icon,
    type,
    size = "md",
    label,
    errorText,
    maxLength,
    max,
    min,
    accept,
    value,
    onValueChange,
    onChange,
    required = false,
    disabled = false,
    placeholder = label,
    className = "mb-4",
}: {
    icon: React.ReactNode,
    type: "text" | "password" | "email" | "number" | "date" | "file",
    size?: "md" | "lg",
    label?: string,
    errorText?: string,
    maxLength?: number,
    max?: number,
    min?: number,
    accept?: string,
    value?: string,
    onValueChange?: (value: string) => void,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    required?: boolean,
    disabled?: boolean,
    placeholder?: string,
    className?: string
}) {
    return (
        <label className={`${className} block`}>
            {label && ( <div className={`mb-1 ${size === "lg" ? "text-lg" : ""}`}>{label}</div> )}
            <InputWithIcon icon={icon} className="w-full">
                <Input required={required} disabled={disabled} max={max} min={min} maxLength={maxLength} accept={accept} className={`ps-9 w-full ${size === "lg" ? "text-lg h-14" : ""} ${errorText ? "border-red-500 text-red-500" : ""}`} placeholder={placeholder} type={type} value={value} onChange={(e) => {
                    if (onValueChange) {
                        onValueChange?.(e.target.value)
                    } else if (onChange) {
                        onChange?.(e)
                    }
                }} />
            </InputWithIcon>
            {errorText && (
                <div className="text-sm mt-1 text-red-500">{errorText}</div>
            )}
        </label>
    )
}