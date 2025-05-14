import { Payment } from './payment.entity.js'

export const PartyType = Object.freeze({
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN',
    ACADEMY: 'ACADEMY',
    EXTERNAL: 'EXTERNAL'
})

export class FinancialTransaction {
    constructor({
                    id = 0,
                    source = PartyType.ACADEMY,
                    target = PartyType.ACADEMY,
                    type = '',
                    concept = '',
                    date = new Date(),
                    reference = '',
                    paymentId = '',
                    amount = 0,
                    method = ''
                } = {}) {
        this.id = id
        this.source = source
        this.target = target
        this.type = type
        this.concept = concept
        this.date = date ? new Date(date) : new Date()
        this.reference = reference
        this.paymentId = paymentId
        this.amount = amount
        this.method = method
    }
}
