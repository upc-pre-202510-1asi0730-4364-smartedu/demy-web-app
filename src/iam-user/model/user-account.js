export class UserAccount {

    constructor({ id = 0, fullName = '', email = '', passwordHash = '', role = 'TEACHER', status = 'INACTIVE' }) {
        this.id = id
        this.fullName = fullName
        this.email = email
        this.passwordHash = passwordHash
        this.role = role
        this.status = status
    }

    activate() {
        this.status = 'ACTIVE'
    }

    deactivate() {
        this.status = 'INACTIVE'
    }

    block() {
        this.status = 'BLOCKED'
    }

    changePassword(newHash) {
        this.passwordHash = newHash
    }

    updateEmail(newEmail) {
        this.email = newEmail
    }
}