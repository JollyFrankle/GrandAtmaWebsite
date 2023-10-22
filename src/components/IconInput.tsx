import { Input } from "@/cn/components/ui/input"
import InputWithIcon from "@/components/InputWithIcon"


export default function IconInput({
    icon,
    type,
    size = "md",
    label,
    errorText,
    maxLength,
    value,
    onValueChange,
    required = false,
    disabled = false,
    placeholder = label,
    className = "mb-4 block",
}: {
    icon: React.ReactNode,
    type: string,
    size?: "md" | "lg",
    label?: string,
    errorText?: string,
    maxLength?: number,
    value?: string,
    onValueChange?: (value: string) => void,
    required?: boolean,
    disabled?: boolean,
    placeholder?: string,
    className?: string
}) {
    return (
        <label className={className}>
            {label && ( <div className={`mb-1 ${size === "lg" && "text-lg"}`}>{label}</div> )}
            <InputWithIcon icon={icon} className="w-full mb-2">
                <Input required={required} disabled={disabled} maxLength={maxLength} className={`ps-9 w-full ${size === "lg" ? "text-lg h-14" : ""} ${errorText ? "border-red-500 text-red-500" : ""}`} placeholder={placeholder} type={type} value={value} onChange={(e) => onValueChange?.(e.target.value)} />
            </InputWithIcon>
            {errorText && (
                <div className="text-sm text-red-500">{errorText}</div>
            )}
        </label>
    )
}