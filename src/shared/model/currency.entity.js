export class Currency {
    constructor(code) {
        if (!Currency.isValidCurrencyCode(code)) {
            throw new Error(`Código de moneda inválido: ${code}`);
        }
        this._code = code;
    }

    get code() {
        return this._code;
    }

    formatAmount(amount, locale = "en-US") {
        const numericAmount = Number(amount);

        if (isNaN(numericAmount)) {
            throw new Error(`Cantidad inválida: ${amount}`);
        }

        return numericAmount.toLocaleString(locale, {
            style: "currency",
            currency: this._code,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    toString() {
        return this._code;
    }

    static isValidCurrencyCode(code) {
        return typeof code === "string" && /^[A-Z]{3}$/.test(code);
    }
}
