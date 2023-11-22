import { useEffect } from "react";

export default function usePageTitle(title: string) {
    useEffect(() => {
        document.title = title;
        return () => {
            document.title = 'Grand Atma Hotel';
        }
    }, [title]);
}