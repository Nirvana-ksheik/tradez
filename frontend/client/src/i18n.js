import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en.json"; // Import your translation files
import translationAR from "./locales/ar.json";

const resources = {
  en: {
    translation: translationEN
  },
  ar: {
    translation: translationAR
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Set the default language
    fallbackLng: "en", // Fallback language if translation is missing
    interpolation: {
      escapeValue: false // React already escapes the values
    }
  });

export default i18n;
