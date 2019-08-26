export interface IAsyncRequestWrapper {
	statusPayload: string;
	message?: string;
	status: 'success' | 'error' | 'warning';
}
