import { Card, CardContent } from "@/cn/components/ui/card"


export default function CardWithIcon({
    item
}: {
    item: {
        icon: React.ReactNode,
        title: string,
        content: string | React.ReactNode
    }
}) {
    return <Card className="w-full md:text-start transition-all hover:scale-105">
    <CardContent className="p-4 md:flex items-center relative overflow-hidden">
        <div className="mb-3 md:mb-0 mx-auto md:mx-0 h-8 w-8 flex-shrink-0">
            {item.icon}
        </div>
        <div className="md:ms-4">
            <h3 className="font-bold">{item.title}</h3>
            <p>{item.content}</p>
        </div>
        <div className="absolute -right-4 h-24 w-24 -bottom-4 opacity-10 pointer-events-none">
            {item.icon}
        </div>
    </CardContent>
</Card>
}