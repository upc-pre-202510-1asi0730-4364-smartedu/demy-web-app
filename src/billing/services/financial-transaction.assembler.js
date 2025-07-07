import { FinancialTransaction } from '../model/financial-transaction.entity.js'
import { PaymentAssembler } from './payment.assembler.js'

export class FinancialTransactionAssembler {
    static fromResource(resource) {
        return new FinancialTransaction({
            id: resource.id,
            type: resource.type,
            category: resource.category,
            concept: resource.concept,
            date: new Date(resource.date),
            payment: resource.payment
                ? PaymentAssembler.fromResource(resource.payment)
                : null
        })
    }
}