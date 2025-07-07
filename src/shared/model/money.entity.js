import { Currency } from "./currency.entity.js";

export class Money {
    constructor(amount, currency) {
        if (typeof amount !== "number" || isNaN(amount)) {
            throw new Error("Amount must be a valid number");
        }
        if (amount < 0) {
            throw new Error("Amount cannot be negative");
        }
        if (!(currency instanceof Currency)) {
            throw new Error("Currency must be an instance of Currency");
        }

        this._amount = amount;
        this._currency = currency;
    }

    get amount() {
        return this._amount;
    }

    get currency() {
        return this._currency;
    }

    toString() {
        return `${this._currency.code} ${this._amount.toFixed(2)}`;
    }

    format(locale = "en-US") {
        return this._currency.formatAmount(this._amount, locale);
    }

    add(other) {
        if (!(other instanceof Money)) {
            throw new Error("Can only add another Money instance");
        }
        if (this.currency.code !== other.currency.code) {
            throw new Error("Cannot add Money with different currencies");
        }
        return new Money(this.amount + other.amount, this.currency);
    }

    multiply(factor) {
        if (typeof factor !== "number" || factor < 0) {
            throw new Error("Factor must be a non-negative number");
        }
        return new Money(this.amount * factor, this.currency);
    }
}
