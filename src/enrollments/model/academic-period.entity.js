export class AcademicPeriod {
    constructor({
                    id = 0,
                    periodName = '',
                    startDate = new Date(),
                    endDate = new Date(),
                    isActive = true
                } = {}) {
        this.id = id;
        this.periodName = periodName;
        this.startDate = startDate instanceof Date ? startDate : new Date(startDate);
        this.endDate = endDate instanceof Date ? endDate : new Date(endDate);
        this.isActive = isActive;
    }
}
