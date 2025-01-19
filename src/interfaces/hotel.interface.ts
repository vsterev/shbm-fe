export interface Hotel {
    _id: string,
    name: string,
    resortId: string,
    resort: string,
    code: string,
    category: string,
    regionId: string,
    roomTypes: string,
    parserCode?: string,
    parserName?: string,
    parserHotelServer?: string
}

export interface HotelVariant {
    _id: string,
    hotelId: number,
    hotelName: string,
    hotelCode: string,
    cityId: number,
    cityName: string,
    parserCode: string
    boards: { [key: number]: { boardId: number, boardName: string, parserCode: string } },
    rooms: { [key: string]: { roomTypeId: number, roomTypeName: string, roomCategoryId: number, roomCategoryName: string, parserCode: string } },
    parserName: string,
    parserHotelServer: string
}
export interface Board {
    boardId: number;
    boardName: string;
    parserCode?: string;
}

export interface Room {
    roomTypeId: number;
    roomTypeName: string;
    roomCategoryId: number;
    roomCategoryName: string;
    parserCode?: string;
}
export interface HotelMap {
    _id: number;
    hotelId: number;
    hotelName: string;
    hotelCode?: string;
    cityId: number;
    cityName: string;
    boards: { [key: string]: Board };
    rooms: { [key: string]: Room };
    parserCode?: string;
    parserName?: string;
    parserHotelServer?: string;
}

export interface HotelInterlook {
    _id: number;
    name: string;
    code: string;
    resort: string;
    category: number;
    regionId: number;
    resortId: number;

}