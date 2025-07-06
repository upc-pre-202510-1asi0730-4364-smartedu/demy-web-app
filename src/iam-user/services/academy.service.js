import httpInstance from '../../shared/services/http.instance.js'
import { Academy } from '../model/academy.js'

/**
 * Service to manage academy-related operations.
 */
export class AcademyService {
    resourceEndpoint = import.meta.env.VITE_ACADEMY_ENDPOINT_PATH

    /**
     * Creates a new academy.
     *
     * @param {Object} academy - The academy data to be created.
     * @returns {Promise<Academy>} The created academy instance.
     */
    async createAcademy(academy) {
        const res = await httpInstance.post(this.resourceEndpoint, academy)
        return new Academy(res.data)
    }

    /**
     * Retrieves an academy by the associated user ID.
     *
     * @param {string|number} userId - The ID of the user who owns the academy.
     * @returns {Promise<Academy>} The academy associated with the user.
     */
    async getByUserId(userId) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/by-user/${userId}`)
        return new Academy(res.data)
    }

    /**
     * Retrieves all academies from the backend.
     *
     * @returns {Promise<Academy[]>} A list of all academies.
     */
    async getAll() {
        const res = await httpInstance.get(this.resourceEndpoint)
        return res.data.map(academy => new Academy(academy))
    }

    /**
     * Deletes an academy by its ID.
     *
     * @param {string|number} id - The ID of the academy to delete.
     * @returns {Promise<void>} Resolves when deletion is complete.
     */
    async deleteAcademy(id) {
        await httpInstance.delete(`${this.resourceEndpoint}/${id}`)
    }
}

/**
 * Factory function to instantiate the AcademyService.
 *
 * @returns {AcademyService} A new instance of the service.
 */
export function useAcademyService() {
    return new AcademyService()
}
