export const PaymentStatus = Object.freeze({
    PENDING: 'PENDING',
    PAID: 'PAID',
    OVERDUE: 'OVERDUE'
})

export class Invoice {
    constructor({
                    id = '',
                    subscriptionId = null,
                    amount = 0,
                    dueDate = null,
                    status = PaymentStatus.PENDING,
                    studentId = ''
                } = {}) {
        this.id = id;
        this.subscriptionId = subscriptionId;
        this.amount = amount;
        this.dueDate = dueDate ? new Date(dueDate) : null;
        this.status = status;
        this.studentId = studentId;
    }
}
