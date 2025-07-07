import httpInstance from '../../shared/services/http.instance.js'
import { Invoice } from '../model/invoice.entity.js'
import { InvoiceAssembler } from "./invoice.assembler.js";

export class InvoiceService {
    basePath = '/students'

    /**
     * Retrieves all invoices for a student by DNI
     * @param {string} dni
     * @returns {Promise<Invoice[]>}
     */
    async getByDni(dni) {
        const url = `${this.basePath}/${dni}/invoices`
        const res = await httpInstance.get(url)
        return InvoiceAssembler.fromResources(res.data)
    }

    /**
     * Creates a new invoice for a student
     * @param {string} dni
     * @param {object} data - must include amount, currency, dueDate
     * @returns {Promise<Invoice>}
     */
    async create(dni, data) {
        const url = `${this.basePath}/${dni}/invoices`
        const res = await httpInstance.post(url, data)
        return InvoiceAssembler.fromResource(res.data)
    }
}
