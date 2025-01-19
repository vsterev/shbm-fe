import { Booking, SearchBookingsParams } from "../interfaces/booking.interface";
import config from "./config";

const BookingService = {
    length: async (data: SearchBookingsParams, token: string): Promise<number> => {
        const searchParams = new URLSearchParams({
            ...data,
            limit: data.limit.toString(),
            skip: data.skip.toString(),
        });
        return fetch(`${config.backEndUrl}/bookings/length?${searchParams}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .catch((e) => console.log(e));
    },
    find: async (data: SearchBookingsParams, token: string): Promise<Booking[]> => {
        const searchParams = new URLSearchParams({
            ...data,
            limit: data.limit.toString(),
            skip: data.skip.toString(),
        });
        return fetch(`${config.backEndUrl}/bookings?${searchParams}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .catch((e) => console.error(e));
    },
};
export default BookingService;