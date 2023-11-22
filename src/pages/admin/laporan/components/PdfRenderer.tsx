import LoadingSpinner from "@/components/LoadingSpinner";
import { useState } from "react";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export default function PdfRenderer({
    filePath
}: {
    filePath: string
}) {

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const [numPages, setNumPages] = useState<number>();
    const [pageNumber] = useState<number>(1);

    return (
        <div>
            <Document file={filePath} onLoadSuccess={onDocumentLoadSuccess} className="w-full overflow-x-auto overflow-y-hidden" loading={<Loading />}>
                <Page pageNumber={pageNumber} width={1000} error={<div className="w-full text-center">Gagal</div>} loading={<Loading />} />
            </Document>
            <p>
                Page {pageNumber} of {numPages}
            </p>
        </div>
    )
}

const Loading = () => <div className="w-full text-center"><LoadingSpinner /></div>