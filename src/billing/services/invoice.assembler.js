import { Invoice } from '../model/invoice.entity.js'

export class InvoiceAssembler {
    static fromResource(resource) {
        return new Invoice({
            id: resource.id,
            dni: resource.dni,
            name: resource.name,
            amount: resource.amount,
            currency: resource.currency,
            dueDate: resource.dueDate ? new Date(resource.dueDate) : null,
            status: resource.status
        })
    }

    static fromResources(resources) {
        return resources.map(this.fromResource)
    }
}