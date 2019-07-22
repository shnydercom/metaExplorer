import { ILoginResponse } from "./datatypes";

export class OnboardingAPI {
	public static getOnboardingAPISingleton(): OnboardingAPI {
		if (OnboardingAPI.onboardingSingleton == null) {
			OnboardingAPI.onboardingSingleton = new OnboardingAPI();
		}
		return OnboardingAPI.onboardingSingleton;
	}
	protected static onboardingSingleton: OnboardingAPI = null;

	public loginFetch(resolve, reject, tokenValue) {
		fetch('http://localhost:3333/signinorsignup'
			//'/api/login'
		, {
			headers: new Headers(
				{
					Authorization: 'Bearer ' + tokenValue,
				}
			)
		}
		).then((response) => {
			if (response.status >= 400) {
				reject("Bad response from server");
			}
			response.json().then((bodyVal: ILoginResponse) => {
				resolve(bodyVal);
			}).catch((reason) => {
				reject(reason);
			});
		});
	}
}
