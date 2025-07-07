export class DateTime {
    constructor(value) {
        const now = new Date();

        if (!value) {
            this._date = now;
        } else {
            const parsedDate = new Date(value);
            if (isNaN(parsedDate.getTime())) {
                throw new Error("Invalid date value provided");
            }
            this._date = parsedDate;
        }
    }

    get value() {
        return this._date;
    }

    format(locale = "en-US", options) {
        const defaultOptions = options ?? {
            year: "numeric",
            month: "long",
            day: "numeric"
        };

        return this._date.toLocaleDateString(locale, defaultOptions);
    }

    toString() {
        return this._date.toISOString();
    }
}