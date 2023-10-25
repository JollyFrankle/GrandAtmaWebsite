import { Textarea } from "@/cn/components/ui/textarea"
import InputWithIcon from "@/components/InputWithIcon"


export default function IconTextarea({
    icon,
    size = "md",
    label,
    errorText,
    maxLength,
    value,
    onValueChange,
    rows = 3,
    required = false,
    disabled = false,
    placeholder = label,
    className = "mb-4 block",
}: {
    icon: React.ReactNode,
    size?: "md" | "lg",
    label?: string,
    errorText?: string,
    maxLength?: number,
    value?: string,
    onValueChange?: (value: string) => void,
    rows?: number,
    required?: boolean,
    disabled?: boolean,
    placeholder?: string,
    className?: string
}) {
    return (
        <label className={className}>
            {label && ( <div className={`mb-1 ${size === "lg" ? "text-lg" : ""}`}>{label}</div> )}
            <InputWithIcon icon={icon} className="w-full">
                <Textarea required={required} disabled={disabled} maxLength={maxLength} rows={rows} className={`ps-9 w-full ${size === "lg" ? "text-lg h-14" : ""} ${errorText ? "border-red-500 text-red-500" : ""}`} placeholder={placeholder} value={value} onChange={(e) => onValueChange?.(e.target.value)} />
            </InputWithIcon>
            {errorText && (
                <div className="text-sm mt-1 text-red-500">{errorText}</div>
            )}
        </label>
    )
}