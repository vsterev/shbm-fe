import { HotelInterlook, IntegratedHotelResponse } from '../interfaces/hotel.interface';
const API_URL = `${import.meta.env.VITE_BACKEND_API}`;

const HotelService = {
  get: async (
    data: { hotelName: string; integrationName: string },
    token: string
  ): Promise<HotelInterlook[]> => {
    try {
      const searchParams = new URLSearchParams(data);
      const response = await fetch(`${API_URL}/hotels?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  edit: async (
    data: {
      integrationName: string;
      integrationValue: number;
      hotelId: number;
    },
    token: string
  ): Promise<HotelInterlook | Error> => {
    try {
      const response = await fetch(`${API_URL}/hotels`, {
        body: JSON.stringify(data),
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (e) {
      console.log('tuk2' + e);
      throw e;
    }
  },

  getMapped: async (token: string, integrationCode: string): Promise<HotelInterlook[]> => {
    try {
      const response = await fetch(`${API_URL}/hotels/mapped/${integrationCode}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  delete: async (
    data: { hotelId: number; integrationName: string },
    token: string
  ): Promise<void> => {
    try {
      await fetch(`${API_URL}/hotels`, {
        body: JSON.stringify(data),
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  getAll: async (
    token: string,
    apiName: string
  ): Promise<{
    integratedHotels: IntegratedHotelResponse[];
    interLookHotels: number[];
  }> => {
    //checked
    try {
      const response = await fetch(`${API_URL}/hotels/all?integrationName=${apiName}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
export default HotelService;
