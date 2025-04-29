export interface Board {
  boardId: number;
  boardName: string;
  integrationCode?: string;
}

export interface Room {
  roomTypeId: number;
  roomTypeName: string;
  roomCategoryId: number;
  roomCategoryName: string;
  integrationCode?: string;
}
export interface AccommodationMapping {
  _id: number;
  hotelId: number;
  hotelName: string;
  hotelCode?: string;
  cityId: number;
  cityName: string;
  integrationName: string;
  boards: { [key: string]: Board };
  rooms: { [key: string]: Room };
}

export interface HotelInterlook {
  _id: number;
  name: string;
  code: string;
  resort: string;
  category: number;
  regionId: number;
  resortId: number;
  integrationSettings?: {
    apiName: string;
    hotelCode: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
export interface IntegratedHotelResponse {
  hotelId: number;
  hotelName: string;
  settings: {
    hotelServer: string;
    hotelServerId: number;
    serverName: string;
  };
  mapped?: boolean;
}
