import httpInstance from '../../shared/services/http.instance.js'

export class CourseService {
    constructor() {
        this.resourceEndpoint = import.meta.env.VITE_COURSES_ENDPOINT_PATH
    }

    async getAll() {
        const res = await httpInstance.get(this.resourceEndpoint)
        return res.data
    }
}
