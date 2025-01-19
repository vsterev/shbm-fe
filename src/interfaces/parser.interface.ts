export interface ParserHotelInfoResponse {
    boards: string[];
    rooms: {
        MaxAdults: number | null,
        MaxChildren: number | null,
        MaxPax: number | null,
        MinAdults: number | null,
        MinChildren: number | null,
        MinPax: number | null,
        RoomCategory: string | null,
        RoomType: string | null
    }[];
};

export interface ParserHotelResponse {
    Hotel: string,
    HotelID: number,
    HotelServer: string,
    PMS_ServerID: number,
    ServerName: string,
    mapped: boolean
};