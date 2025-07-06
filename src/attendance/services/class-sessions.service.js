import axios from 'axios'
import { ClassSession } from '../model/class-session.entity.js'

const BASE_URL = import.meta.env.VITE_CLASSSESSION_ENDPOINT_PATH


export const classSessionService = {
    /**
     * Guarda una nueva sesión
     * @param {ClassSession} session
     * @returns {Promise}
     */
    save(session) {
        const payload = session instanceof ClassSession ? session.toJSON() : session
        return axios.post(BASE_URL, payload)
    },

    /**
     * Obtiene una sesión por ID
     * @param {string} id
     * @returns {Promise}
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
