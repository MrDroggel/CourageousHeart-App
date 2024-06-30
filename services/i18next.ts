import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import de from "../locales/de.json";

const lanugageResources = {
  en: { ns1: en },
  de: { ns1: de },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  debug: true,
  lng: "de",
  fallbackLng: "en",
  defaultNS: "ns1",
  resources: lanugageResources,
});

export default i18next;
