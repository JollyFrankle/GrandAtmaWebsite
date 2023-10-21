import { UserCustomer, UserPegawai } from "./ApiModels";


export default class AuthHelper {
    static getToken() {
        return localStorage.getItem('token');
    }

    static setToken(token: string) {
        localStorage.setItem('token', token);
    }

    static getUserCustomer() {
        if (localStorage.getItem("type") !== "c") {
            return null;
        }
        return JSON.parse(localStorage.getItem('user') || 'null') as UserCustomer|null;
    }

    static setUserCustomer(user: UserCustomer) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem("type", "c")
    }

    static getUserPegawai() {
        if (localStorage.getItem("type") !== "p") {
            return null;
        }
        return JSON.parse(localStorage.getItem('user') || 'null') as UserPegawai|null;
    }

    static setUserPegawai(user: UserPegawai) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem("type", "p")
        localStorage.setItem("role", user.role)
    }

    static logout() {
        localStorage.removeItem("user")
        localStorage.removeItem("type")
        localStorage.removeItem("token")
    }
}