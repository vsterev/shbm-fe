import { ParserBooking } from "./booking.interface";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Report {
    dateInputed: string;
    parserHotels: string[];
    ip: string;
    sendedBookings: ParserBooking[];
    errorMappings?: ParserBooking[];
}