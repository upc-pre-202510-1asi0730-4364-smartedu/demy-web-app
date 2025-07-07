import { Money } from "../../shared/model/money.entity.js";
import { Currency } from "../../shared/model/currency.entity.js";
import { DateTime } from "../../shared/model/date-time.entity.js";

/**
 * Represents a payment made by a student.
 * Linked to an invoice and includes amount, method, date, and optional invoice ID.
 */
export class Payment {
    constructor({
                    id = null,
                    invoiceId = null,
                    amount = 0,
                    currency = 'PEN',
                    method = '',
                    paidAt = null
                } = {}) {
        this.id = id;
        this.invoiceId = invoiceId;

        // Usa Money y Currency
        this.monetaryAmount = new Money(amount, new Currency(currency));

        this.method = method;

        // Usa DateTime
        this.paidAt = paidAt ? new DateTime(paidAt) : new DateTime();
    }

    // Métodos auxiliares

    get amount() {
        return this.monetaryAmount.amount;
    }

    get currency() {
        return this.monetaryAmount.currency.code;
    }

    formatAmount(locale = "es-PE") {
        return this.monetaryAmount.format(locale);
    }

    formatPaidAt(locale = "es-PE") {
        return this.paidAt.format(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }
}
