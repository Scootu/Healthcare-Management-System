 import cities from "./algeria_cities.json";
export function communesInDayra(dayraName: string):{
    id: number;
    EnName: string;
    ArName: string;
}[] {
    const found = cities.filter(city => city.daira_name_ascii.trim().toLowerCase() === dayraName.trim().toLowerCase());
    return found.map((city, index) => ({
        id: index + 1,
        EnName: city.commune_name_ascii,
        ArName: city.commune_name,
    }));
}