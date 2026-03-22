import cities from "./algeria_cities.json";
import { type cityType } from "../types/cityType";
export function dayraInWilaya(wilayaName: string):{
    id: number;
    EnName: string;
    ArName: string;
}[] {
    // Filter cities by wilaya_name
    const found = cities.filter(city => {
        if (!city.wilaya_name_ascii) return false;
        return city.wilaya_name_ascii.trim().toLowerCase() === wilayaName.trim().toLowerCase();
    });
    const repetedDairas =found.length>0? found.map((city: cityType, index: number) => {
                return {
                    id: index + 1,
                    EnName: city.daira_name_ascii,
                    ArName: city.daira_name,
                }
            }) : [];

    const noRepetedDairas: { id: number; EnName: string; ArName: string; }[] = [...new Map(repetedDairas.map(item => [item.EnName, item])).values()];
    return noRepetedDairas.map((dayra, index) => ({
        ...dayra,
        id: index + 1, 
    }));
}

