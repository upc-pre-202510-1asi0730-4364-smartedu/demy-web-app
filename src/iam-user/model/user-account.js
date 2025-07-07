
/**
 * Represents a user account within the application.
 */
export class UserAccount {

    /**
     * Creates a new UserAccount instance.
     * @param {Object} param0 - The user properties.
     * @param {number} param0.id - Unique identifier for the user.
     * @param {string} param0.fullName - Full name of the user.
     * @param {string} param0.email - Email address of the user.
     * @param {string} param0.passwordHash - Hashed password for authentication.
     * @param {string} param0.role - Role assigned to the user (e.g., 'ADMIN', 'TEACHER').
     * @param {string} param0.status - Current account status (e.g., 'ACTIVE', 'INACTIVE', 'BLOCKED').
     */
    constructor({ id = 0, fullName = '', email = '', passwordHash = '', role = 'TEACHER', status = 'INACTIVE' }) {
        this.id = id
        this.fullName = fullName
        this.email = email
        this.passwordHash = passwordHash
        this.role = role
        this.status = status
    }

    /**
     * Sets the user's status to 'ACTIVE'.
     */
    activate() {
        this.status = 'ACTIVE'
    }

    /**
     * Sets the user's status to 'INACTIVE'.
     */
    deactivate() {
        this.status = 'INACTIVE'
    }

    /**
     * Sets the user's status to 'BLOCKED'.
     */
    block() {
        this.status = 'BLOCKED'
    }

    /**
     * Updates the user's password hash.
     * @param {string} newHash - The new hashed password.
     */
    changePassword(newHash) {
        this.passwordHash = newHash
    }

    /**
     * Updates the user's email address.
     * @param {string} newEmail - The new email address.
     */
    updateEmail(newEmail) {
        this.email = newEmail
    }
}