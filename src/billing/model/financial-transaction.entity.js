import { DateTime } from "../../shared/model/date-time.entity.js";
import { Payment } from "./payment.entity.js";

/**
 * Represents a financial transaction in the system.
 * Includes transaction metadata and associated payment.
 */
export class FinancialTransaction {
    constructor({
                    id = null,
                    type = '',
                    category = '',
                    concept = '',
                    date = null,
                    payment = null // objeto crudo o instancia de Payment
                } = {}) {
        this.id = id;
        this.type = type;
        this.category = category;
        this.concept = concept;

        // Usa DateTime
        this.date = date ? new DateTime(date) : new DateTime();

        // Acepta objeto plano o clase Payment ya instanciada
        this.payment = payment instanceof Payment ? payment : payment ? new Payment(payment) : null;
    }

    formatDate(locale = "es-PE") {
        return this.date.format(locale, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }

    get amount() {
        return this.payment?.amount ?? 0;
    }

    get currency() {
        return this.payment?.currency ?? '';
    }

    get method() {
        return this.payment?.method ?? '';
    }

    formatAmount(locale = "es-PE") {
        return this.payment ? this.payment.formatAmount(locale) : "S/ 0.00";
    }

    formatPaidAt(locale = "es-PE") {
        return this.payment ? this.payment.formatPaidAt(locale) : "-";
    }
}
