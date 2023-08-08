import locationsData from '../locations.json';

const findLocationDescription = (value, currentLanguage) => {
    let description = "default";
    for (let i = 0; i < locationsData.length; i++) {
        const location = locationsData[i];
        for (let j = 0; j < location.cities.length; j++) {
            const city = location.cities[j];
            if (city.id === value) {
                console.log("Location found");
                if (currentLanguage === "ar") {
                    description = location.arabic_description + "/" + city.arabic_description;
                } else {
                    description = location.english_description + "/" + city.english_description;
                }
            }
        }
    }
    return description;
};

export {findLocationDescription}