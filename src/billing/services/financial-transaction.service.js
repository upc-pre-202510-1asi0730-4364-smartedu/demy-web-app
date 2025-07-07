import httpInstance from '../../shared/services/http.instance.js'
import { FinancialTransaction } from '../model/financial-transaction.entity.js'
import { FinancialTransactionAssembler } from "./financial-transaction.assembler.js";

/**
 * @class FinancialTransactionService
 * @description Service for managing financial transaction operations
 */
export class FinancialTransactionService {
    resourceEndpoint = '/financial-transactions'
    invoicePaymentEndpoint = '/invoices'
    expenseEndpoint = '/financial-transactions/expenses'

    /**
     * Get all financial transactions
     * @returns {Promise<FinancialTransaction[]>}
     */
    async getAll() {
        const res = await httpInstance.get(`${this.resourceEndpoint}`)
        console.log("Respuesta cruda de backend:", res.data)
        return res.data.map(item => FinancialTransactionAssembler.fromResource(item))
    }

    /**
     * Get a financial transaction by ID
     * @param {number} id
     * @returns {Promise<FinancialTransaction>}
     */
    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`)
        return FinancialTransactionAssembler.fromResource(res.data)
    }

    /**
     * Create a general income or expense transaction
     * @param {object} dto - Must include: type, category, concept, date, amount, currency, method, paidAt, (optional) invoiceId
     * @returns {Promise<FinancialTransaction>}
     */
    async create(dto) {
        const res = await httpInstance.post(`${this.resourceEndpoint}`, dto)
        return FinancialTransactionAssembler.fromResource(res.data)
    }

    /**
     * Register payment for a specific invoice
     * @param {number} invoiceId
     * @param {object} dto - Must include: method (string)
     * @returns {Promise<FinancialTransaction>}
     */
    async registerPayment(invoiceId, dto) {
        const res = await httpInstance.post(`${this.invoicePaymentEndpoint}/${invoiceId}/payment`, dto)
        return FinancialTransactionAssembler.fromResource(res.data)
    }

    /**
     * Register an expense
     * @param {object} dto - Must include: category, concept, amount, currency, method, paidAt
     * @returns {Promise<FinancialTransaction>}
     */
    async registerExpense(dto) {
        const res = await httpInstance.post(`${this.expenseEndpoint}`, dto)
        return FinancialTransactionAssembler.fromResource(res.data)
    }
}
