import httpInstance from '../../shared/services/http.instance.js'
import { Invoice } from '../model/invoice.entity.js'

/**
 * @class InvoiceService
 * @description Service for managing invoice-related API operations
 */
export class InvoiceService {
    resourceEndpoint = import.meta.env.VITE_INVOICES_ENDPOINT_PATH

    /**
     * Retrieves all invoices
     * @returns {Promise<Invoice[]>}
     */
    async getAll() {
        const res = await httpInstance.get(this.resourceEndpoint)
        return res.data.map(invoice => new Invoice(invoice))
    }

    /**
     * Retrieves an invoice by ID
     * @param {string} id
     * @returns {Promise<Invoice>}
     */
    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`)
        return new Invoice(res.data)
    }

    /**
     * Retrieves invoices by student ID
     * @param {string} studentId
     * @returns {Promise<Invoice[]>}
     */
    async getByStudentId(studentId) {
        const res = await httpInstance.get(`${this.resourceEndpoint}?studentId=${studentId}`)
        return res.data.map(invoice => new Invoice(invoice))
    }

    /**
     * Creates a new invoice
     * @param {Invoice} invoice
     * @returns {Promise<Invoice>}
     */
    async create(invoice) {
        const res = await httpInstance.post(this.resourceEndpoint, invoice)
        return new Invoice(res.data)
    }

    /**
     * Updates an invoice by ID
     * @param {string} id
     * @param {Invoice} invoice
     * @returns {Promise<Invoice>}
     */
    async update(id, invoice) {
        const res = await httpInstance.put(`${this.resourceEndpoint}/${id}`, invoice)
        return new Invoice(res.data)
    }

    /**
     * Deletes an invoice by ID
     * @param {string} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        await httpInstance.delete(`${this.resourceEndpoint}/${id}`)
    }
}
