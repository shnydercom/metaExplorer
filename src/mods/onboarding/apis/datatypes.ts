export interface IOnboardingAPIResponse {
	code: number;
	type: string;
	message: string;
}

export interface ILoginResponse extends IOnboardingAPIResponse {
	userName: string;
	content: string;
}

export const RESPONSE_CONTENT = "content";
