export const PartyType = Object.freeze({
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN',
    ACADEMY: 'ACADEMY',
    EXTERNAL: 'EXTERNAL'
})

export class FinancialTransaction {
    constructor({
                    id = '',
                    source = PartyType.ACADEMY,
                    target = PartyType.ACADEMY,
                    type = '',
                    category = '',
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
        this.category = category
        this.concept = concept
        this.date = date ? new Date(date) : new Date()
        this.reference = reference
        this.paymentId = paymentId
        this.amount = amount
        this.method = method
    }
}
