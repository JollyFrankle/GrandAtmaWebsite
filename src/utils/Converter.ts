

export default class Converter {
    static mToFt(m: number): number {
        return m * 3.28084;
    }

    static jumlahMalamFromDateRange(start: Date, end: Date): number {
        const diff = end.getTime() - start.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
}