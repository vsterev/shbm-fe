import { Board, Hotel, HotelInterlook, HotelMap, HotelVariant, Room } from "../interfaces/hotel.interface";
import config from "./config";

const HotelService = {
    mappingVariants: async (data: { ilCode: number, parserCode?: string }, token: string): Promise<HotelVariant> => {
        const searchParams = new URLSearchParams({
            ilCode: data.ilCode.toString(),
            ...(data.parserCode && { parserCode: data.parserCode })
        });
        const response = await fetch(`${config.backEndUrl}/hotels/mapping-variants?${searchParams}`, {
            method: "GET",
            headers: { "Content-type": "application/json", Authorization: `Bearer ${token}` },
        });

        return await response.json();

    },
    getHotels: async (data: { hotelName: string }, token: string): Promise<Hotel[]> => {
        try {
            const searchParams = new URLSearchParams(data);
            const response = await fetch(`${config.backEndUrl}/hotels?${searchParams}`, {
                // body: JSON.stringify(data),
                method: 'GET',
                headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
            });
            return await response.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    editHotel: async (data: { parserCode: number; hotelId: number }, token: string): Promise<HotelMap> => {
        //checked
        try {
            const response = await fetch(`${config.backEndUrl}/hotels`, {
                body: JSON.stringify(data),
                method: 'PATCH',
                headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
            });
            return await response.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    allMappedHotels: async (token: string): Promise<HotelInterlook[]> => {
        try {
            const response = await fetch(`${config.backEndUrl}/hotels/mapped`, {
                method: 'GET',
                headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
            });
            return await response.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    //???????
    createMappingVariants: async (data: { ilCode: number; checkIn: string; checkOut: string }, token: string): Promise<unknown> => {
        try {
            await fetch(`${config.backEndUrl}/hotels/mapping-variants`, {
                body: JSON.stringify(data),
                method: 'POST',
                headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
            });
            // return await response.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    editMappingVariant: async (data: { boards: { [key: number]: Board }; rooms: { [key: string]: Room }; hotelId: number }, token: string): Promise<HotelMap> => {
        try {
            const response = await fetch(`${config.backEndUrl}/hotels/mapping-variants`, {
                body: JSON.stringify(data),
                method: 'PATCH',
                headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` }
            });
            return await response.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    deleteMappingVariants: async (data: { hotelId: number }, token: string): Promise<void> => {
        try {
            const response = await fetch(`${config.backEndUrl}/hotels/mapping-variants`, {
                body: JSON.stringify(data),
                method: 'DELETE',
                headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
            });
            await response.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
};
export default HotelService;