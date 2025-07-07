/**
 * Represents an Academy associated with a user.
 */
export class Academy {
    /**
     * Creates a new Academy instance.
     * @param {Object} [param0={}] - Academy properties.
     * @param {number} [param0.id=0] - Unique identifier for the academy.
     * @param {string} [param0.userId=''] - ID of the user who owns this academy.
     * @param {Array} [param0.periods=[]] - List of academic periods associated with the academy.
     * @param {string} [param0.academy_name=''] - Name of the academy.
     * @param {string} [param0.ruc=''] - RUC (unique taxpayer registry number).
     */
    constructor({ id = 0, userId = '', periods = [], academy_name = '', ruc = '' } = {}) {
        this.id = id
        this.userId = userId
        this.periods = periods
        this.academy_name = academy_name
        this.ruc = ruc
    }
}
