import { ParserHotelInfoResponse, ParserHotelResponse } from '../interfaces/parser.interface';
import { Report } from '../interfaces/report.interface';
import config from './config';

const parserService = {

  hotelInfo: async (data: { parserCode: number }, token: string): Promise<ParserHotelInfoResponse> => {
    try {
      const response = await fetch(`${config.backEndUrl}/parser/hotel-props`, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  compareHotel: async (token: string): Promise<{ parserHotels: ParserHotelResponse[], interLookHotels: string[] }> => {
    //checked
    try {
      const response = await fetch(`${config.backEndUrl}/parser/hotels-compare`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  getReports: async (token: string): Promise<Report[]> => {
    return fetch(`${config.backEndUrl}/parser/reports`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
};
export default parserService;
