import { Payment } from '../model/payment.entity.js'

export class PaymentAssembler {
    static fromResource(resource) {
        return new Payment({
            id: resource.id,
            invoiceId: resource.invoiceId,
            paidAt: new Date(resource.paidAt),
            method: resource.method,
            amount: resource.amount,
            currency: resource.currency
        })
    }
}
