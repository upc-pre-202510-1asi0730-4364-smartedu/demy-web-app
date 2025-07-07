import { Money } from "../../shared/model/money.entity.js";
import { Currency } from "../../shared/model/currency.entity.js";
import { DateTime } from "../../shared/model/date-time.entity.js";

export class Invoice {
    constructor({
                    id = 0,
                    dni = '',
                    name = '',
                    amount = 0,
                    currency = 'PEN',
                    dueDate = null,
                    status = PaymentStatus.PENDING
                } = {}) {
        this.id = id;
        this.dni = dni;
        this.name = name;

        // Usa Money + Currency
        const currencyInstance = new Currency(currency);
        this.monetaryAmount = new Money(amount, currencyInstance);

        // Usa DateTime si la fecha existe
        this.dueDate = dueDate ? new DateTime(dueDate) : null;

        this.status = status;
    }

    // Métodos auxiliares opcionales
    get amount() {
        return this.monetaryAmount.amount;
    }

    get currency() {
        return this.monetaryAmount.currency.code;
    }

    formatAmount(locale = "es-PE") {
        return this.monetaryAmount.format(locale);
    }

    formatDueDate(locale = "es-PE") {
        return this.dueDate ? this.dueDate.format(locale) : "Sin fecha";
    }

    isPaid() {
        return this.status === PaymentStatus.PAID;
    }
}

export const PaymentStatus = Object.freeze({
    PENDING: 'PENDING',
    PAID: 'PAID',
    OVERDUE: 'OVERDUE'
});
