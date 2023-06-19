class Lookups {
    constructor(value, description, id){
        this.value = value;
        this.description = description;
        this.id = id;
    }
}

export const itemOrderByLookups = [
    new Lookups("publishedDate", "Published Date", 1),
    new Lookups("tradez", "Tradez No.", 2),
    new Lookups("approximateValue", "Approximate Value", 3)
]

export const itemOrderDirectionLookups = [
    new Lookups(1, "Ascending", 1),
    new Lookups(-1, "Descending", 2)
]

export const Role = {
    ADMIN: 'admin',
    USER: 'user' 
}

export const ItemStatus = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
}

export const ItemStatusLookups = [
    new Lookups(ItemStatus.APPROVED, "Approved", 1),
    new Lookups(ItemStatus.PENDING, "Pending", 2),
    new Lookups(ItemStatus.REJECTED, "Rejected", 3)
]