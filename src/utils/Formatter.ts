export default class Formatter {
    static formatCurrency(value: number): string {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
    }

    static formatNumber(value: number): string {
        return new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 1
        }).format(value);
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

    static dateToYMD(date: Date): string {
        const tzOffset = date.getTimezoneOffset() * 60000;
        date = new Date(date.getTime() - tzOffset);
        return date.toISOString().slice(0, 10);
    }

    static capitalizeFirstLetter(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}