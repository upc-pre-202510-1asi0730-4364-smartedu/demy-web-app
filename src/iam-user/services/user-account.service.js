import httpInstance from '../../shared/services/http.instance.js'
import { UserAccount } from '../model/user-account.js'

export class UserAccountService {
    resourceEndpoint = import.meta.env.VITE_USER_ACCOUNT_ENDPOINT_PATH


    async login({ email, password }) {
        const response = await httpInstance.post('/users/sign-in', { email, password });
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));


        return new UserAccount(user);
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? new UserAccount(JSON.parse(user)) : null;
    }

    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }

    async getAllUsers() {
        const res = await httpInstance.get(this.resourceEndpoint);
        return res.data;
    }

    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`);
        return new UserAccount(res.data);
    }

    async createUser({ fullName, email, password }) {
        const payload = { fullName, email, password };
        const res = await httpInstance.post('/users/admins/sign-up', payload);

        return res.data.user;
    }

}

export function useUserAccountService() {
    return new UserAccountService()
}