import httpInstance from '../../shared/services/http.instance.js'
import { UserAccount } from '../model/user-account.js'

export class UserAccountService {
    resourceEndpoint = import.meta.env.VITE_USER_ACCOUNT_ENDPOINT_PATH

    async login({ email, password }) {
        const res = await httpInstance.post(`${this.resourceEndpoint}/login`, { email, password })
        return new UserAccount(res.data)
    }

    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`)
        return new UserAccount(res.data)
    }
}

export function useUserAccountService() {
    return new UserAccountService()
}