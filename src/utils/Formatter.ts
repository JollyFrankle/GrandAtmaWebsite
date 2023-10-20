export default class Formatter {
    static formatCurrency(value: number): string {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    }

    static formatNumber(value: number): string {
        return new Intl.NumberFormat('id-ID').format(value);
    }

    static formatDate(value: string): string {
        return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(value));
    }
}