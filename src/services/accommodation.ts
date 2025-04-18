import {
	Board,
	AccommodationMapping,
	Room,
} from '../interfaces/hotel.interface';
const API_URL = `${import.meta.env.VITE_BACKEND_API}`;

const AccommodationService = {
	get: async (
		data: { ilCode: number; },
		token: string
	): Promise<AccommodationMapping | { error: string }> => {
		const searchParams = new URLSearchParams({
			ilCode: data.ilCode.toString()
		});
		const response = await fetch(
			`${API_URL}/accommodations?${searchParams}`,
			{
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return await response.json();
	},

	create: async (
		data: { ilCode: number; checkIn: string; checkOut: string, integrationCode: string },
		token: string
	): Promise<any> => {
		try {
			const response = await fetch(`${API_URL}/accommodations/`, {
				body: JSON.stringify(data),
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.status === 404) {
				return await response.json();
			}
		} catch (e) {
			console.error(e);
			throw e;
		}
	},
	edit: async (
		data: {
			boards: { [key: number]: Board };
			rooms: { [key: string]: Room };
			hotelId: number;
		},
		token: string
	): Promise<AccommodationMapping> => {
		try {
			const response = await fetch(
				`${API_URL}/accommodations/`,
				{
					body: JSON.stringify(data),
					method: 'PATCH',
					headers: {
						'Content-type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return await response.json();
		} catch (e) {
			console.error(e);
			throw e;
		}
	},

	delete: async (
		id: number,
		token: string
	): Promise<void> => {
		try {
			await fetch(`${API_URL}/accommodations/${id}/`, {
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
};
export default AccommodationService;
