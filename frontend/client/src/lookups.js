class Lookups {
    constructor(value, description, description_ar, id){
        this.value = value;
        this.description = description;
        this.description_ar = description_ar;
        this.id = id;
    }
}

export const itemOrderByLookups = [
    new Lookups("publishedDate", "Published Date", "تاريخ النشر", 1),
    new Lookups("tradez", "Tradez No.", "الصفقات", 2),
    new Lookups("approximateValue", "Approximate Value", "السعر المقدر", 3)
]

export const charityOrderByLookups = [
    new Lookups("createdDate", "Published Date","تاريخ النشر", 1),
    new Lookups("annualTurnover", "Annual Turnover","الإيرادات السنوية", 2)
]

export const itemOrderDirectionLookups = [
    new Lookups(1, "Ascending", "تصاعدياً", 1),
    new Lookups(-1, "Descending", "تنازلياً",  2)
]

export const Role = {
    ADMIN: 'admin',
    USER: 'user',
    CHARITY: 'charity'
}

export const ItemStatus = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
}

export const ItemStatusLookups = [
    new Lookups(ItemStatus.APPROVED, "Approved", "موافق", 1),
    new Lookups(ItemStatus.PENDING, "Pending", "قيد الإنتظار", 2),
    new Lookups(ItemStatus.REJECTED, "Rejected", "مرفوض", 3)
]