/**
 * @class Course
 * @description Represents a course entity within the scheduling system
 * Used for managing course information and availability
 */
export class Course {
    /**
     * Creates a new Course instance
     * @param {Object} params - The course initialization parameters
     * @param {number} [params.id=0] - Unique identifier for the course
     * @param {string} [params.name=''] - Name of the course
     * @param {string} [params.code=''] - Code associated with the course
     * @param {string} [params.description=''] - Detailed description of the course content
     */
    constructor({id = 0, name = '', code = '', description = ''}) {
        /**
         * @type {number}
         * @description Unique identifier for the course
         */
        this.id = id;

        /**
         * @type {string}
         * @description Name of the course
         */
        this.name = name;

        /**
         * @type {string}
         * @description Code associated with the course
         */
        this.code = code;

        /**
         * @type {string}
         * @description Detailed description of the course content
         */
        this.description = description;
    }
}