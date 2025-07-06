import httpInstance from '../../shared/services/http.instance.js'
import { UserAccount } from '../model/user-account.js'

/**
 * Service to manage user accounts (login, CRUD, session, etc.)
 */
export class UserAccountService {
    resourceEndpoint = import.meta.env.VITE_USER_ACCOUNT_ENDPOINT_PATH

    /**
     * Logs in the user by email and password.
     * Stores the JWT token and user data in localStorage.
     *
     * @param {Object} credentials - The user credentials.
     * @param {string} credentials.email - User's email.
     * @param {string} credentials.password - User's password.
     * @returns {Promise<UserAccount>} The logged-in user.
     * @throws {Error} If login response is invalid.
     */
    async login({ email, password }) {
        const response = await httpInstance.post('/users/sign-in', { email, password });
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));


        return new UserAccount(user);
    }

    /**
     * Logs out the current user.
     * Removes token and user data from localStorage.
     */
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    }

    /**
     * Gets the currently logged-in user from localStorage.
     *
     * @returns {UserAccount|null} The current user or null if not logged in.
     */
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? new UserAccount(JSON.parse(user)) : null;
    }

    /**
     * Checks if a user is authenticated.
     *
     * @returns {boolean} True if a token is stored.
     */
    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }


    /**
     * Fetches all user accounts from the backend.
     *
     * @returns {Promise<Array>} List of user data.
     */
    async getAllUsers() {
        const res = await httpInstance.get(this.resourceEndpoint);
        return res.data;
    }

    /**
     * Fetches a single user by ID.
     *
     * @param {number|string} id - The ID of the user.
     * @returns {Promise<UserAccount>} The user instance.
     */
    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`);
        return new UserAccount(res.data);
    }

    /**
     * Creates a new user with admin role.
     *
     * @param {Object} userData - The user data.
     * @param {string} userData.fullName - Full name of the user.
     * @param {string} userData.email - Email of the user.
     * @param {string} userData.password - Password for the user.
     * @returns {Promise<Object>} The response containing the new user and possibly a message.
     */
    async createUser({ fullName, email, password }) {
        const payload = { fullName, email, password };
        const res = await httpInstance.post('/users/admins/sign-up', payload);

        return res.data.user;
    }

}

/**
 * Factory function to create a new instance of UserAccountService.
 *
 * @returns {UserAccountService} The service instance.
 */
export function useUserAccountService() {
    return new UserAccountService()
}