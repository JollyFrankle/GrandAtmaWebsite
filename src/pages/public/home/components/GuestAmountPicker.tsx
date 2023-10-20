import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel } from "@/cn/components/ui/select";


export default function GuestAmountPicker({
    placeholder,
    className,
    suffix,
    max = 6,
    onChange
}: {
    placeholder: string
    className?: string
    suffix: string
    max?: number
    onChange?: (value: string) => void
}) {
    return <Select onValueChange={onChange}>
        <SelectTrigger className={`text-lg h-14 ${className}`}>
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectLabel>{placeholder}</SelectLabel>
                {[...Array(max+1)].map((_, i) => (
                    <SelectItem key={i+1} value={i.toString()}>{i} {suffix}</SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>
}