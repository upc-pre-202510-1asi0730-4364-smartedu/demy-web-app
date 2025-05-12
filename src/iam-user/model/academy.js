export class Academy {
    constructor({ id = 0, userId = '', periods = [], academy_name = '', ruc = '' } = {}) {
        this.id = id
        this.userId = userId
        this.periods = periods
        this.academy_name = academy_name
        this.ruc = ruc
    }
}
