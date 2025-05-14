import httpInstance from '../../shared/services/http.instance.js'
import { Academy } from '../model/academy.js'

export class AcademyService {
    resourceEndpoint = import.meta.env.VITE_ACADEMY_ENDPOINT_PATH

    async createAcademy(academy) {
        const res = await httpInstance.post(this.resourceEndpoint, academy)
        return new Academy(res.data)
    }

    async getByUserId(userId) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/by-user/${userId}`)
        return new Academy(res.data)
    }

    async getAll() {
        const res = await httpInstance.get(this.resourceEndpoint)
        return res.data.map(academy => new Academy(academy))
    }

    async deleteAcademy(id) {
        await httpInstance.delete(`${this.resourceEndpoint}/${id}`)
    }
}

export function useAcademyService() {
    return new AcademyService()
}
