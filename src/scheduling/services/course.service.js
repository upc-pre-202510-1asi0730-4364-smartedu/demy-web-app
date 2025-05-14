import httpInstance from "../../shared/services/http.instance.js";
import {Course} from "../model/course.entity.js";

/**
 * @class CourseService
 * @description Service class for handling CRUD operations on courses using HTTP requests
 */
export class CourseService {
    /** @type {string} The API endpoint for courses */
    resourceEndpoint = import.meta.env.VITE_COURSES_ENDPOINT_PATH;

    /**
     * Retrieves all courses
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of courses
     */
    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    /**
     * Retrieves a course by its ID
     * @param {number|string} id - The ID of the course to retrieve
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the course object
     */
    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    /**
     * Creates a new course
     * @param {Course} course - The course object to create
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created course
     */
    create(course) {
        return httpInstance.post(this.resourceEndpoint, course);
    }

    /**
     * Updates an existing course
     * @param {number|string} id - The ID of the course to update
     * @param {Course} course - The updated course object
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the updated course
     */
    update(id, course) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, course);
    }

    /**
     * Deletes a course by its ID
     * @param {number|string} id - The ID of the course to delete
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves when the course is deleted
     */
    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }

    /**
     * Retrieves courses by name
     * @param {string} name - The name to search for
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of matching courses
     */
    getByName(name) {
        return httpInstance.get(`${this.resourceEndpoint}?name=${name}`);
    }
}
