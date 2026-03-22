import { type wilayaType } from "../types/wilayaType";
import data from "./algeria_cities.json";
const wilayat: wilayaType[] = (() => {
  const seen = new Map<string, wilayaType>();
  for (const item of data) {
    const key = item.wilaya_name_ascii;
    if (!seen.has(key)) {
      seen.set(key, {
        num: seen.size + 1,
        EnName: item.wilaya_name_ascii,
        ArName: item.wilaya_name,
      });
    }
  }
  
  const array = Array.from(seen.values());
  return array;
})();

export { wilayat };
