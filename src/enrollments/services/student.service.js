import httpInstance from '../../shared/services/http.instance.js'
import { Student } from '../model/student.entity.js'

/**
 * @class StudentService
 * @description Service for managing student-related API operations
 */
export class StudentService {
    /** @type {string} API endpoint path */
    resourceEndpoint = import.meta.env.VITE_STUDENTS_ENDPOINT_PATH

    /**
     * Retrieves all students
     * @returns {Promise<Student[]>}
     */
    async getAll() {
        const res = await httpInstance.get(this.resourceEndpoint)
        return res.data.map(student => new Student(student))
    }

    /**
     * Retrieves a student by ID
     * @param {string} id
     * @returns {Promise<Student>}
     */
    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`)
        return new Student(res.data)
    }

    /**
     * Searches students by DNI
     * @param {string} dni
     * @returns {Promise<Student[]>}
     */
    async getByDni(dni) {
        const res = await httpInstance.get(`${this.resourceEndpoint}?dni=${dni}`)
        return res.data.map(student => new Student(student))
    }

    /**
     * Creates a new student
     * @param {Student} student
     * @returns {Promise<Student>}
     */
    async create(student) {
        const res = await httpInstance.post(this.resourceEndpoint, student)
        return new Student(res.data)
    }

    /**
     * Updates a student by ID
     * @param {string} id
     * @param {Student} student
     * @returns {Promise<Student>}
     */
    async update(id, student) {
        const res = await httpInstance.put(`${this.resourceEndpoint}/${id}`, student)
        return new Student(res.data)
    }

    /**
     * Deletes a student by ID
     * @param {string} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        await httpInstance.delete(`${this.resourceEndpoint}/${id}`)
    }
}
