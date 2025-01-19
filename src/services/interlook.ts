import { Booking } from "../interfaces/booking.interface";
import config from "./config";
const HotelsInterlook = {
  getBookings: async (data: { action: string, next: boolean }, token: string): Promise<Booking[]> => {
    try {
      const response = await fetch(`${config.backEndUrl}/il/get-bookings`, {
        body: JSON.stringify(data),
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (response.status === 204) {
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  sendBookings: async (data: Booking[], token: string): Promise<{ errors: number, sended: number, confirmed: number, notConfirmed: number, cancelled: number }> => {
    try {
      const response = await fetch(`${config.backEndUrl}/il/send-bookings`, {
        body: JSON.stringify(data),
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
export default HotelsInterlook;
