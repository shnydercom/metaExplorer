/*import googleapis, { GoogleApis } from 'googleapis';
import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import { getAPI } from 'googleapis/build/src/shared/src';*/

//test data, to be ld-input parameters later:
let testCfg: GoogleWebAuthAPICfg = {
	scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
	apiKey: 'AIzaSyBGoOzD583AP7izQdrdDjvCIKnXln1v38c',
	clientID: '988991312764-rj2bejoo1n2li9gala129dobmfpeminf.apps.googleusercontent.com',
	docsToLoad: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
};

export interface GoogleWebAuthAPICfg {
	scope: string;
	apiKey: string;
	clientID: string;
	docsToLoad: string[];
}

export interface GoogleWebAuthState {
	generalState: "preAPIDownload" | "downloadingAPI" | "downloadAPIFailed" | "initial" |
	"signingIn" | "signedIn" | "notSignedIn";
}

export class GoogleWebAuthAPI {
	public static getSingleton(): GoogleWebAuthAPI {
		if (GoogleWebAuthAPI.singleton == null) {
			let newSingleton: GoogleWebAuthAPI = new GoogleWebAuthAPI();
			newSingleton.initScriptLoad();
			GoogleWebAuthAPI.singleton = newSingleton;
    }
		return GoogleWebAuthAPI.singleton;
	}

	private static singleton: GoogleWebAuthAPI;

	// tslint:disable-next-line:variable-name
	private _cfg: GoogleWebAuthAPICfg | undefined;
	// tslint:disable-next-line:variable-name
	private _state: GoogleWebAuthState;

	constructor() {
		GoogleWebAuthAPI.getSingleton();
		this._state = {
			generalState: "preAPIDownload"
		};
	}

	getState(): GoogleWebAuthState {
		return this._state;
	}

	setState(state: GoogleWebAuthState) {
		this._state = state;
	}
	initScriptLoad() {
		const scriptPromise = new Promise((resolve, reject) => {
			const script = document.createElement('script');
			this.setState({ ...this._state, generalState: "downloadingAPI" });
			document.body.appendChild(script);
			script.onload = resolve;
			script.onerror = reject;
			script.async = true;
			script.src = 'https://apis.google.com/js/api.js';
		});
		scriptPromise
			.then(() => { this._handleClientLoad(); })
			.catch(() => {
				this.setState({ ...this._state, generalState: "downloadAPIFailed" });
			});
	}

	/**
	 *  Initializes the API client library and sets up sign-in state
	 *  listeners.
	 */
	initClient(cfg?: GoogleWebAuthAPICfg) {
		if (!cfg && !this._cfg) {
			console.warn("not initializing Auth Client, no configuration set");
			return;
		}
		this._cfg = cfg ? cfg : this._cfg;
		console.log("initialising google auth");
		this.setState({ ...this._state, generalState: "signingIn" });
		gapi.client.init({
			apiKey: this._cfg.apiKey,
			clientId: this._cfg.clientID,
			discoveryDocs: this._cfg.docsToLoad,
			scope: this._cfg.scope
		}).then(() => {
			// Listen for sign-in state changes.
			gapi.auth2.getAuthInstance().isSignedIn.listen(this._updateSigninStatus);

			// Handle the initial sign-in state.
			this._updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			//authorizeButton.onclick = handleAuthClick;
			//signoutButton.onclick = handleSignoutClick;
			gapi.auth2.getAuthInstance().signIn();
		}).catch(() => {
			this.setState({ ...this._state, generalState: "notSignedIn" });
		});
	}

	/**
	 *  Sign out the user
	 */
	signOut() {
		gapi.auth2.getAuthInstance().signOut();
	}
	/**
	 *  Called when the signed in status changes, to update the UI
	 *  appropriately. After a sign-in, the API is called.
	 */
	private _updateSigninStatus(isSignedIn) {
		console.log(isSignedIn);
		if (isSignedIn) {
			this.setState({ ...this._state, generalState: "signedIn" });
		} else {
			this.setState({ ...this._state, generalState: "notSignedIn" });
		}
	}

	/**
	 *  On load, called to load the auth2 library and API client library.
		 */
	private _handleClientLoad() {
		gapi.load('client:auth2',
			() => {
				this.setState({ ...this._state, generalState: "initial" });
			}
		);
	}
}

//functional code:
/*let authOpts: GoogleAuthOptions = {
	scopes: gScopes,
	projectId: gClientId
};

let test: GoogleAuth = new GoogleAuth(authOpts);

console.log(test.fromAPIKey(gApiKey));*/
