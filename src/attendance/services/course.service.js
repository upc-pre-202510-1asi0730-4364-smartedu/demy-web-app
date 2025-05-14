import httpInstance from '../../shared/services/http.instance.js'

export class CourseService {
    constructor() {
        this.resourceEndpoint = `${import.meta.env.VITE_API_BASE_URL}/courses`
    }

    async getAll() {
        const res = await httpInstance.get(this.resourceEndpoint)
        return res.data
    }
}
