import httpInstance from '../../shared/services/http.instance.js'
import { Payment } from '../model/payment.entity.js'

/**
 * @class PaymentService
 * @description Service for managing payment-related API operations
 */
export class PaymentService {
    resourceEndpoint = import.meta.env.VITE_PAYMENTS_ENDPOINT_PATH

    /**
     * Retrieves all payments
     * @returns {Promise<Payment[]>}
     */
    async getAll() {
        const res = await httpInstance.get(this.resourceEndpoint)
        return res.data.map(payment => new Payment(payment))
    }

    /**
     * Retrieves a payment by ID
     * @param {number|string} id
     * @returns {Promise<Payment>}
     */
    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`)
        return new Payment(res.data)
    }

    /**
     * Creates a new payment
     * @param {Payment} payment
     * @returns {Promise<Payment>}
     */
    async create(payment) {
        const res = await httpInstance.post(this.resourceEndpoint, payment)
        return new Payment(res.data)
    }

    /**
     * Updates a payment by ID
     * @param {number|string} id
     * @param {Payment} payment
     * @returns {Promise<Payment>}
     */
    async update(id, payment) {
        const res = await httpInstance.put(`${this.resourceEndpoint}/${id}`, payment)
        return new Payment(res.data)
    }

    /**
     * Deletes a payment by ID
     * @param {number|string} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        await httpInstance.delete(`${this.resourceEndpoint}/${id}`)
    }
}
