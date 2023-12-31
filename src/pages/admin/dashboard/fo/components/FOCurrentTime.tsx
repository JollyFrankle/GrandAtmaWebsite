import { Card, CardContent } from "@/cn/components/ui/card"
import Formatter from "@/utils/Formatter"
import { useEffect, useState } from "react"


export default function FOCurrentTime({
    className = ""
}: {
    className?: string
}) {

    const [time, setTime] = useState({
        h: "00",
        m: "00",
        s: "00",
        date: "Memulai..."
    })

    const timerFn = () => {
        const date = new Date()
        const hour = Formatter.padZero(date.getHours())
        const minute = Formatter.padZero(date.getMinutes())
        const second = Formatter.padZero(date.getSeconds())
        setTime({
            h: hour,
            m: minute,
            s: second,
            date: Formatter.formatDate(date)
        })
    }

    useEffect(() => {
        const timer = setInterval(timerFn, 1000)
        timerFn()
        return () => clearInterval(timer)
    }, [])

    return (
        <Card className={`shadow ${className}`}>
            <CardContent className="p-4 text-center">
                <h3 className="font-bold mb-2">Waktu saat ini:</h3>
                <h2 className="text-3xl font-bold flex items-center justify-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded">{time.h}</div>:
                    <div className="w-10 h-10 flex items-center justify-center rounded">{time.m}</div>:
                    <div className="w-10 h-10 flex items-center justify-center rounded">{time.s}</div>
                </h2>
                <p className="text-lg">{time.date}</p>
            </CardContent>
        </Card>
    )
}