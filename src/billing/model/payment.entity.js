export class Payment {
    constructor({
                    invoiceId = null,
                    paidAt = new Date(),
                    method = '',
                    amount = 0
                } = {}) {
        this.invoiceId = invoiceId
        this.paidAt = paidAt ? new Date(paidAt) : new Date()
        this.method = method
        this.amount = amount
    }
}
