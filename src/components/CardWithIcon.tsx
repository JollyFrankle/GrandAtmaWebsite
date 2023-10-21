import { Card, CardContent } from "@/cn/components/ui/card"


export default function CardWithIcon({
    item,
    className = ""
}: {
    item: {
        icon: React.ReactNode,
        title: string,
        content: string | React.ReactNode
    },
    className?: string
}) {
    return item.content && <Card className={`w-full text-start transition-all hover:scale-105 ${className}`}>
    <CardContent className="p-4 flex items-center relative overflow-hidden h-full">
        <div className="mb-0 mx-0 h-8 w-8 flex-shrink-0">
            {item.icon}
        </div>
        <div className="ms-4">
            <h3 className="font-bold">{item.title}</h3>
            <div>{item.content}</div>
        </div>
        <div className="absolute -right-4 h-24 w-24 -bottom-4 opacity-10 pointer-events-none">
            {item.icon}
        </div>
    </CardContent>
</Card>
}