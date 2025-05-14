export class AcademicPeriod {
    constructor({
                    id = '',
                    name = '',
                    academyId = '',
                    startDate = new Date(),
                    endDate = new Date(),
                    isActive = true
                } = {}) {
        this.id = id;
        this.name = name;
        this.academyId = academyId;
        this.startDate = startDate instanceof Date ? startDate : new Date(startDate);
        this.endDate = endDate instanceof Date ? endDate : new Date(endDate);
        this.isActive = isActive;
    }
}
