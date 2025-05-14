import httpInstance from '../../shared/services/http.instance.js'
import { AcademicPeriod } from '../model/academic-period.entity.js'

/**
 * @class AcademicPeriodService
 * @description Service for managing academic period-related API operations
 */
export class AcademicPeriodService {
    /** @type {string} API endpoint path */
    resourceEndpoint = import.meta.env.VITE_ACADEMIC_PERIODS_ENDPOINT_PATH

    /**
     * Retrieves all academic periods
     * @returns {Promise<AcademicPeriod[]>}
     */
    async getAll() {
        const res = await httpInstance.get(this.resourceEndpoint)
        return res.data.map(period => new AcademicPeriod(period))
    }

    /**
     * Retrieves an academic period by ID
     * @param {string} id
     * @returns {Promise<AcademicPeriod>}
     */
    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`)
        return new AcademicPeriod(res.data)
    }

    /**
     * Creates a new academic period
     * @param {AcademicPeriod} period
     * @returns {Promise<AcademicPeriod>}
     */
    async create(period) {
        const res = await httpInstance.post(this.resourceEndpoint, period)
        return new AcademicPeriod(res.data)
    }

    /**
     * Updates an academic period by ID
     * @param {string} id
     * @param {AcademicPeriod} period
     * @returns {Promise<AcademicPeriod>}
     */
    async update(id, period) {
        const res = await httpInstance.put(`${this.resourceEndpoint}/${id}`, period)
        return new AcademicPeriod(res.data)
    }

    /**
     * Deletes an academic period by ID
     * @param {string} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        await httpInstance.delete(`${this.resourceEndpoint}/${id}`)
    }
}
