import axios, { AxiosResponse } from 'axios';
import Location from '../interfaces/Location.tsx';

const apiUrl = 'http://localhost:3000';

export const ApiService = {
	async getLocations(): Promise<Location[]> {
		const response: AxiosResponse<Location[]> = await axios.get(`${apiUrl}/api/locations`);

		return response.data;
	},

	async createLocation(location: Omit<Location, 'id'>): Promise<Location> {
		const response: AxiosResponse<Location> = await axios.post(`${apiUrl}/api/locations`, location);

		return response.data;
	},

	async updateLocation(id: string, location: Partial<Location>): Promise<Location> {
		const response: AxiosResponse<Location> = await axios.put(`${apiUrl}/api/locations/${id}`, location);

		return response.data;
	},

	async deleteLocation(id: string): Promise<void> {
		await axios.delete(`${apiUrl}/api/locations/${id}`);
	},
};
