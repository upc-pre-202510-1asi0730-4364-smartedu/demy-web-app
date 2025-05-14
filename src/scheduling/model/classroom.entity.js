/**
 * @class Classroom
 * @description Represents a classroom entity within the scheduling system
 * Used for managing classroom information and availability
 */
export class Classroom {
    /**
     * Creates a new Classroom instance
     * @param {Object} params - The classroom initialization parameters
     * @param {number} [params.id=0] - Unique identifier for the classroom
     * @param {string} [params.code=''] - Code or identifier for the classroom
     * @param {number} [params.capacity=0] - Capacity of the classroom (number of students it can hold)
     * @param {string} [params.campus=''] - Campus where the classroom is located
     */
    constructor({id = '', code = '', capacity = 0, campus = ''}) {
        /**
         * @type {number}
         * @description Unique identifier for the classroom
         */
        this.id = id;

        /**
         * @type {string}
         * @description Code or identifier for the classroom
         */
        this.code = code;

        /**
         * @type {number}
         * @description Capacity of the classroom (number of students it can hold)
         */
        this.capacity = capacity;

        /**
         * @type {string}
         * @description Campus where the classroom is located
         */
        this.campus = campus;
    }
}