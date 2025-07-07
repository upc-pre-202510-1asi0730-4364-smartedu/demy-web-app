import axios from 'axios'
import { ClassSession } from '../model/class-session.entity.js'

const BASE_URL = import.meta.env.VITE_CLASSSESSION_ENDPOINT_PATH


/**
 * Service for managing class sessions via HTTP requests.
 */
export const classSessionService = {
    /**
     * Saves a new class session to the backend.
     * @param {ClassSession|Object} session - The class session to save. If an instance of ClassSession, it will be serialized.
     */
    save(session) {
        const payload = session instanceof ClassSession ? session.toJSON() : session
        return axios.post(BASE_URL, payload)
    },

    /**
     * Retrieves a class session by its ID.
     * @param {string|number} id - The ID of the class session.
     */
    getById(id) {
        return axios.get(`${BASE_URL}/${id}`)
    },

    /**
     * Obtiene todas las sesiones
     * @returns {Promise}
     */
    getAll() {
        return axios.get(BASE_URL)
    }
}
