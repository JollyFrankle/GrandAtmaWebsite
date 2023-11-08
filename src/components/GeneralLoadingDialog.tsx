import LoadingSpinner from "./LoadingSpinner";


export default function GeneralLoadingDialog({
    show,
    text = "Memuat…",
}: {
    show: boolean,
    text?: string,
}) {
    return (
        <div className={`fixed inset-0 z-50 bg-background/80 flex backdrop-blur-sm items-center justify-center ${show ? '' : 'hidden'}`}>
            <div className="bg-background rounded-xl shadow-lg p-6">

                <LoadingSpinner />

                {text}
            </div>
        </div>
    )
}