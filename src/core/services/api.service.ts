import axios, { AxiosResponse } from 'axios';
import Location from '../interfaces/Location.tsx';

const API_URL = 'http://localhost:3000';

export const ApiService = {
	async getLocations(): Promise<Location[]> {
		const response: AxiosResponse<Location[]> = await axios.get(`${API_URL}/api/locations`);

		return response.data;
	},

	async createLocation(location: Omit<Location, 'id'>): Promise<Location> {
		const response: AxiosResponse<Location> = await axios.post(`${API_URL}/api/locations`, location);

		return response.data;
	},

	async updateLocation(id: string, location: Partial<Location>): Promise<Location> {
		const response: AxiosResponse<Location> = await axios.put(`${API_URL}/api/locations/${id}`, location);

		return response.data;
	},

	async deleteLocation(id: string): Promise<void> {
		await axios.delete(`${API_URL}/api/locations/${id}`);
	},
};
