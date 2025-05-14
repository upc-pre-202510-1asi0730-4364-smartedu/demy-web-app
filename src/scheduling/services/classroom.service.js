// src/services/classroom.service.js
import httpInstance from "../../shared/services/http.instance.js";
import {Classroom} from "../model/classroom.entity.js";

/**
 * @class ClassroomService
 * @description Service class for handling CRUD operations on classrooms using HTTP requests
 */
export class ClassroomService {
    /** @type {string} The API endpoint for classrooms */
    resourceEndpoint = import.meta.env.VITE_CLASSROOMS_ENDPOINT_PATH;

    /**
     * Retrieves all classrooms
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of classrooms
     */
    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    /**
     * Retrieves a classroom by its ID
     * @param {number|string} id - The ID of the classroom to retrieve
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the classroom object
     */
    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    /**
     * Creates a new classroom
     * @param {Classroom} classroom - The classroom object to create
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created classroom
     */
    create(classroom) {
        return httpInstance.post(this.resourceEndpoint, classroom);
    }

    /**
     * Updates an existing classroom
     * @param {number|string} id - The ID of the classroom to update
     * @param {Classroom} classroom - The updated classroom object
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the updated classroom
     */
    update(id, classroom) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, classroom);
    }

    /**
     * Deletes a classroom by its ID
     * @param {number|string} id - The ID of the classroom to delete
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves when the classroom is deleted
     */
    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }

    /**
     * Retrieves classrooms by code
     * @param {string} code - The code to search for
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of matching classrooms
     */
    getByCode(code) {
        return httpInstance.get(`${this.resourceEndpoint}?code=${code}`);
    }
}