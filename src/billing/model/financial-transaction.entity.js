import { Payment } from './payment.entity.js'

export const PartyType = Object.freeze({
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN',
    ACADEMY: 'ACADEMY'
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
                    payment = new Payment()
                } = {}) {
        this.id = id
        this.source = source
        this.target = target
        this.type = type
        this.concept = concept
        this.date = date ? new Date(date) : new Date()
        this.reference = reference
        this.payment = new Payment(payment)
    }
}
