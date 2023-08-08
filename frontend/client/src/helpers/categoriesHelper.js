import categoriesData from '../categories.json';

const findCategoryDescription = (value, currentLanguage) => {
    let description = "default";
    for (let i = 0; i < categoriesData.length; i++) {
        const category = categoriesData[i];
        for (let j = 0; j < category.subcategories.length; j++) {
            const subCategory = category.subcategories[j];
            if (subCategory.id === value) {
                console.log("category found");
                if (currentLanguage === "ar") {
                    description = subCategory.arabic_description;
                } else {
                    description = subCategory.english_description;
                }
            }
        }
    }
    return description;
};

export {findCategoryDescription}