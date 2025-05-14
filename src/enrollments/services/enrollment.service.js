import httpInstance from '../../shared/services/http.instance.js'
import { Enrollment } from '../model/enrollment.entity.js'

/**
 * @class EnrollmentService
 * @description Service for managing enrollment-related API operations
 */
export class EnrollmentService {
    /** @type {string} API endpoint path */
    resourceEndpoint = import.meta.env.VITE_ENROLLMENTS_ENDPOINT_PATH

    /**
     * Retrieves all enrollments
     * @returns {Promise<Enrollment[]>}
     */
    async getAll() {
        const res = await httpInstance.get(this.resourceEndpoint)
        return res.data.map(enrollment => new Enrollment(enrollment))
    }

    /**
     * Retrieves an enrollment by ID
     * @param {string} id
     * @returns {Promise<Enrollment>}
     */
    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`)
        return new Enrollment(res.data)
    }

    /**
     * Creates a new enrollment
     * @param {Enrollment} enrollment
     * @returns {Promise<Enrollment>}
     */
    async create(enrollment) {
        const res = await httpInstance.post(this.resourceEndpoint, enrollment)
        return new Enrollment(res.data)
    }

    /**
     * Updates an enrollment by ID
     * @param {string} id
     * @param {Enrollment} enrollment
     * @returns {Promise<Enrollment>}
     */
    async update(id, enrollment) {
        const res = await httpInstance.put(`${this.resourceEndpoint}/${id}`, enrollment)
        return new Enrollment(res.data)
    }

    /**
     * Deletes an enrollment by ID
     * @param {string} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        await httpInstance.delete(`${this.resourceEndpoint}/${id}`)
    }
}
