import httpInstance from '../../shared/services/http.instance.js'
import { UserAccount } from '../model/user-account.js'

export class UserAccountService {
    resourceEndpoint = import.meta.env.VITE_USER_ACCOUNT_ENDPOINT_PATH

    async login({ email, password }) {
        const res = await httpInstance.get(this.resourceEndpoint);
        const users = res.data;

        const matchedUser = users.find(user =>
            user.email === email && user.passwordHash === password
        );

        if (!matchedUser) {
            throw new Error('Invalid credentials');
        }

        return new UserAccount(matchedUser);
    }

    async getAllUsers() {
        const res = await httpInstance.get(this.resourceEndpoint)
        return res.data
    }

    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`)
        return new UserAccount(res.data)
    }
    async createUser({ email, passwordHash, name }) {
        const newUser = { email, passwordHash, name, role:'ADMIN' }
        const res = await httpInstance.post(this.resourceEndpoint, newUser)
        return new UserAccount(res.data)
    }
}

export function useUserAccountService() {
    return new UserAccountService()
}