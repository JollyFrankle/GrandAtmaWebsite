import { Card, CardContent } from "@/cn/components/ui/card"
import Formatter from "@/utils/Formatter"
import { useEffect, useState } from "react"


export default function FOCurrentTime() {

    const [time, setTime] = useState({
        h: "00",
        m: "00",
        s: "00",
        date: "Memulai..."
    })

    useEffect(() => {
        const timer = setInterval(() => {
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
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <Card className="shadow">
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