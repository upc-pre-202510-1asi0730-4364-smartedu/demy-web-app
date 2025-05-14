/**
 * Represents a weekly schedule entity in the system
 */
export class ScheduleWeekly {
    /**
     * Creates a new ScheduleWeekly instance
     * @param {Object} scheduleWeekly - The weekly schedule initialization object
     * @param {number} [scheduleWeekly.id=0] - The schedule ID
     * @param {string} [scheduleWeekly.name=''] - The name of the weekly schedule
     * @param {Array} [scheduleWeekly.weekSchedule=[]] - The list of schedules for each day of the week
     */
    constructor(scheduleWeekly = {}) {
        /** Unique identifier for the weekly schedule */
        this.id = scheduleWeekly.id || 0;
        // /** Academy ID associated with the weekly schedule */
        // this.academyId = scheduleWeekly.academyId || 0;  // Uncomment when the academy ID field is needed
        /** Name of the weekly schedule */
        this.name = scheduleWeekly.name || '';
        /** A list of daily schedules for the entire week */
        this.weekSchedule = Array.isArray(scheduleWeekly.weekSchedule)
            ? scheduleWeekly.weekSchedule
            : [];
    }
}