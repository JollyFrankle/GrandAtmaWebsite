import { Calendar } from "@/cn/components/ui/calendar";
import { Input } from "@/cn/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/cn/components/ui/popover";
import { cn } from "@/cn/lib/utils";
import { DateRange } from "react-day-picker";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
})

export default function ReservationDatePicker({
    className,
    value: date,
    onChange: setDate
}: {
    className?: string
    value?: DateRange
    onChange?: (date: DateRange | undefined) => void
}) {
    return <>
        <Popover>
            <PopoverTrigger className="w-full">
                <Input
                    id="date-picker"
                    readOnly={true}
                    className={cn("cursor-pointer justify-start text-left text-lg h-14", !date && "text-muted-foreground", className)}
                    value={date?.from ? (
                        date.to ? (
                            `${dateFormatter.format(date.from)} - ${dateFormatter.format(date.to)}`
                        ) : (
                            dateFormatter.format(date.from)
                        )
                    ) : ''}
                    placeholder="Tanggal menginap"
                />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    fromDate={new Date()}
                    toDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                    min={2}
                />
            </PopoverContent>
        </Popover>
    </>
}