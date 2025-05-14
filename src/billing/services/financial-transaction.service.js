import httpInstance from '../../shared/services/http.instance.js'
import { FinancialTransaction } from '../model/financial-transaction.entity.js'

/**
 * @class FinancialTransactionService
 * @description Service for managing financial transaction operations
 */
export class FinancialTransactionService {
    resourceEndpoint = import.meta.env.VITE_FINANCIAL_TRANSACTIONS_ENDPOINT_PATH

    /**
     * Retrieves all financial transactions
     * @returns {Promise<FinancialTransaction[]>}
     */
    async getAll() {
        const res = await httpInstance.get(this.resourceEndpoint)
        return res.data.map(tx => new FinancialTransaction(tx))
    }

    /**
     * Retrieves a transaction by ID
     * @param {string} id
     * @returns {Promise<FinancialTransaction>}
     */
    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`)
        return new FinancialTransaction(res.data)
    }

    /**
     * Creates a new financial transaction
     * @param {FinancialTransaction} transaction
     * @returns {Promise<FinancialTransaction>}
     */
    async create(transaction) {
        const res = await httpInstance.post(this.resourceEndpoint, transaction)
        return new FinancialTransaction(res.data)
    }

    /**
     * Updates a financial transaction by ID
     * @param {string} id
     * @param {FinancialTransaction} transaction
     * @returns {Promise<FinancialTransaction>}
     */
    async update(id, transaction) {
        const res = await httpInstance.put(`${this.resourceEndpoint}/${id}`, transaction)
        return new FinancialTransaction(res.data)
    }

    /**
     * Deletes a transaction by ID
     * @param {string} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        await httpInstance.delete(`${this.resourceEndpoint}/${id}`)
    }
}
