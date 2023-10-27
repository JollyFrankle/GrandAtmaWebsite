import { useEffect, useState } from "react"


export default function ImagePreview({
    file,
    showTitle = true,
    className = "w-full aspect-square"
} : {
    file: File | null,
    showTitle?: boolean,
    className?: string
}) {
    const [preview, setPreview] = useState<string|null>(null)

    useEffect(() => {
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        if (file) {
            reader.readAsDataURL(file)
        } else {
            setPreview(null)
        }
    }, [file])

    return preview && (
        <div className="flex flex-col items-center">
            <img className={`object-cover rounded ${className}`} src={preview} alt="Preview" />
            {showTitle && (
                <div className="mt-2 text-sm text-gray-500">{file?.name}</div>
            )}
        </div>
    )
}