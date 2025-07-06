import httpInstance from '../../shared/services/http.instance.js'
import { Payment } from '../model/payment.entity.js'
import { PaymentAssembler } from "./payment.assembler.js";

/**
 * @class PaymentService
 * @description Service for managing payment-related API operations
 */
export class PaymentService {
    basePath = '/api/v1'
    financialTransactionsEndpoint = '/financialTransactions'

    /**
     * Registers a payment for a given invoice ID.
     * @param {number} invoiceId
     * @param {object} dto - Should include: method (string)
     * @returns {Promise<Payment>}
     */
    async registerPayment(invoiceId, dto) {
        const res = await httpInstance.post(
            `${this.basePath}${this.financialTransactionsEndpoint}/invoices/${invoiceId}/payment`,
            dto
        )
        if (!res.data || !res.data.payment) {
            throw new Error('Payment data missing in response')
        }
        return PaymentAssembler.fromResource(res.data.payment)
    }
}
