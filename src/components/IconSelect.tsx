import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/cn/components/ui/select"
import InputWithIcon from "@/components/InputWithIcon"


export default function IconSelect({
    icon,
    values,
    size = "md",
    label,
    errorText,
    value,
    onValueChange,
    required = false,
    disabled = false,
    placeholder = label,
    className = "mb-4 block",
}: {
    icon: React.ReactNode,
    values?: { value: string, label: string }[],
    size?: "md" | "lg",
    label?: string,
    errorText?: string,
    value?: string,
    onValueChange?: (value: string) => void,
    required?: boolean,
    disabled?: boolean,
    placeholder?: string,
    className?: string
}) {
    return (
        <label className={className}>
        {label && ( <div className={`mb-1 ${size === "lg" ? "text-lg" : ""}`}>{label}</div> )}
        <InputWithIcon icon={icon}>
            <Select required={required} disabled={disabled} value={value} onValueChange={onValueChange}>
                <SelectTrigger className={`ps-9 w-full ${size === "lg" ? "text-lg h-14" : ""} ${errorText ? "border-red-500 text-red-500" : ""}`}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {values?.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </InputWithIcon>
        {errorText && (
            <div className="text-sm text-red-500">{errorText}</div>
        )}
    </label>
    )
}