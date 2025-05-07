import { Integration } from '../contexts/integration.context';
const API_URL = `${import.meta.env.VITE_BACKEND_API}`;

const IntegrationService = {
  getIntegrations: async (token: string): Promise<Integration[]> => {
    try {
      const response = await fetch(`${API_URL}/integrations`, {
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

  getAccommodations: async (
    hotelId: number,
    integrationName: string,
    token: string
  ): Promise<{ rooms: string[]; boards: string[] }> => {
    try {
      const response = await fetch(
        // `${API_URL}/parser/hotel-props`
        `${API_URL}/integrations/accommodations/${hotelId}?integrationName=${integrationName}`,
        {
          method: 'GET',
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
};
export default IntegrationService;
