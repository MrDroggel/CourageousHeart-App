import de from "../locales/de.json";
import en from "../locales/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ns1";
    resources: {
      ns1: typeof de;
      ns1: typeof en;
    };
  }
}
