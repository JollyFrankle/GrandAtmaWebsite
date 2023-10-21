export default class Formatter {
    static formatCurrency(value: number): string {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
    }

    static formatNumber(value: number): string {
        return new Intl.NumberFormat('id-ID').format(value);
    }

    static formatDate(value: Date): string {
        return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(value);
    }

    static formatDateTime(value: Date): string {
        return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(value);
    }

    static formatJSON<T=any>(value: any): T|null {
        try {
            return JSON.parse(value) as T;
        } catch (e) {
            return null
        }
    }
}