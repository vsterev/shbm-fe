export interface ParserBooking {
	Hotel: string;
	RoomType: string;
	CheckIn: string;
	CheckOut: string;
	Booked: string;
	Voucher: string;
	Board: string;
	Market: string;
	Remark?: string;
	Status: string;
	Comments?: string;
	Flight_Arr?: string;
	Flight_Arr_Time?: string;
	Flight_Dep?: string;
	Flight_Dep_Time?: string;
	Names: {
		name: string;
		birthDate?: string;
	}[];
}
export interface ParserBookingResponse {
	Adults: number;
	Age1: number;
	Age2?: number;
	Age3?: number;
	Age4?: number;
	Age5?: number;
	Age6?: number;
	Age7?: number;
	Board: string;
	CheckIn: string;
	CheckOut: string;
	Children: number;
	ConfirmationNo: string;
	Hotel: string;
	Name1: string;
	Name2?: string;
	Name3?: string;
	Name4?: string;
	Name5?: string;
	Name6?: string;
	Name7?: string;
	PriceAmount: number;
	PriceCurrency: string;
	ResponseText: string;
	ResvID: number;
	RoomType: string;
	Vocher: string;
	isCancelled: string;
}
export interface Message {
	id: string;
	sender?: string;
	isRead: boolean;
	text: string;
	isOutgoing: boolean;
	dateCreate: string;
}
export interface Tourist {
	name: string;
	birthDate?: string;
	sex?: string;
	hotelServiceId?: number;
}
export interface HotelServiceBooking {
	serviceId: number;
	serviceName: string;
	bookingCode: string;
	hotelId: number;
	hotel: string;
	pansionId: number;
	pansion: string;
	roomTypeId: number;
	roomType: string;
	roomMapCode: string;
	roomAccommodationId: number;
	roomAccommodation: string;
	roomCategoryId: number;
	roomCategory: string;
	confirmationNumber: string;
	checkIn: string;
	checkOut: string;
	status: string;
	note: string;
	tourists: Tourist[];
	priceRemark?: string;
	log?: {
		send: ParserBooking;
		response: ParserBookingResponse;
		manual: {
			[key: string]: {
				booking: string;
				message: string;
				confirmationNumber?: string;
			}
		};
		sendDate?: Date;
	};
}
export interface Flight {
	flightArr: string;
	flightDep: string;
}

export interface Booking {
	_id?: string;
	bookingName: string;
	bookingId: number;
	action: string;
	creationDate?: string;
	cancelDate?: string;
	changeDate?: string;
	marketId: number;
	marketName: string;
	messages: Message[];
	hotelServices: HotelServiceBooking[];
	flightInfo?: Flight;
	dateInputed?: string;
}

export interface SearchBookingsParams {
	booking: string;
	dateFrom: string;
	dateTo: string;
	limit: number;
	skip: number;
	isCreateDate: boolean;
}
