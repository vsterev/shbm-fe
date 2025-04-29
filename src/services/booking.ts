import { Booking, SearchBookingsParams } from "../interfaces/booking.interface";
const API_URL = `${import.meta.env.VITE_BACKEND_API}`;

const BookingService = {
  length: async (
    data: SearchBookingsParams,
    token: string,
  ): Promise<number> => {
    const searchParams = new URLSearchParams(
      Object.entries({
        ...data,
        limit: data.limit.toString(),
        skip: data.skip.toString(),
      }).reduce(
        (acc, [key, value]) => {
          acc[key] = value.toString();
          return acc;
        },
        {} as Record<string, string>,
      ),
    );
    return fetch(`${API_URL}/bookings/length?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));
  },
  search: async (
    data: SearchBookingsParams,
    token: string,
  ): Promise<{ bookings: Booking[]; count: number }> => {
    const searchParams = new URLSearchParams(
      Object.entries({
        ...data,
        limit: data.limit.toString(),
        skip: data.skip.toString(),
      }).reduce(
        (acc, [key, value]) => {
          acc[key] = value.toString();
          return acc;
        },
        {} as Record<string, string>,
      ),
    );
    return fetch(`${API_URL}/bookings/search?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  get: async (
    data: { status: string; next: boolean },
    token: string,
    integrationName: string,
  ): Promise<Booking[]> => {
    try {
      const sendParams = new URLSearchParams(
        `status=${data.status}&integrationName=${integrationName}&next=${data.next}`,
      );
      const response = await fetch(`${API_URL}/bookings?${sendParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
  send: async (
    data: Booking[],
    token: string,
    integrationName: string,
    flag?: "new" | "change" | "cancel",
  ): Promise<{
    errors: number;
    sended: number;
    confirmed: number;
    notConfirmed: number;
    cancelled: number;
  }> => {
    const params = new URLSearchParams(
      flag ? { integrationName, flag: flag.toString() } : { integrationName },
    );
    const response = await fetch(`${API_URL}/bookings?${params}`, {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error: ${response.status} - ${error.error}`);
    }

    return await response.json();
  },
};
export default BookingService;
