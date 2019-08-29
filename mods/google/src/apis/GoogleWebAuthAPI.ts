/*import googleapis, { GoogleApis } from 'googleapis';
import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import { getAPI } from 'googleapis/build/src/shared/src';*/

//test data, to be ld-input parameters later:
export let gwaTestCfg: GoogleWebAuthAPICfg = {
	scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
	apiKey: 'yourAPIKey',
	clientID: 'somelongid.apps.googleusercontent.com',
	docsToLoad: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
};

export interface GoogleWebAuthAPICfg {
	scope: string;
	apiKey: string;
	clientID: string;
	docsToLoad: string[];
}

export type GWebAuthState = "preAPIDownload" | "downloadingAPI" | "downloadAPIFailed" | "initial" |
	"signingIn" | "signedIn" | "notSignedIn";
export interface GoogleWebAuthState {
	generalState: GWebAuthState;
}

export const EVENT_GOOGLE_WEB_AUTH = "GoogleWebAuthEvent";
export interface GoogleWebAuthEvent extends Event {
	oldState: GWebAuthState;
	newState: GWebAuthState;
}

export type GoogleWebAuthEventListener = (evt: GoogleWebAuthEvent) => void;
export type GoogleWebAuthEventListenerObject = {
	handleEvent(evt: GoogleWebAuthEvent): void;
};
export type GoogleWebAuthEventListenerOrEventListenerObject = GoogleWebAuthEventListener | GoogleWebAuthEventListenerObject;

//TODO: shorter names for EventListeners maybe?
export class GoogleWebAuthAPI implements EventTarget {
	public static getSingleton(): GoogleWebAuthAPI {
		if (GoogleWebAuthAPI.singleton === null || GoogleWebAuthAPI.singleton === undefined) {
			let newSingleton: GoogleWebAuthAPI = new GoogleWebAuthAPI();
			newSingleton.initScriptLoad();
			GoogleWebAuthAPI.singleton = newSingleton;
		}
		return GoogleWebAuthAPI.singleton;
	}

	private static singleton: GoogleWebAuthAPI;

	private listeners = {};

	// tslint:disable-next-line:variable-name
	private _cfg: GoogleWebAuthAPICfg | undefined;
	// tslint:disable-next-line:variable-name
	private _state: GoogleWebAuthState;

	constructor() {
		//GoogleWebAuthAPI.getSingleton();
		this._state = {
			generalState: "preAPIDownload"
		};
	}

	addEventListener(type: string, listener: GoogleWebAuthEventListenerOrEventListenerObject): void {
		if (!(type in this.listeners)) {
			this.listeners[type] = [];
		}
		this.listeners[type].push(listener);
	}
	dispatchEvent(event: GoogleWebAuthEvent): boolean {
		if (!(event.type in this.listeners)) {
			return true;
		}
		var stack = this.listeners[event.type].slice();
		for (var i = 0, l = stack.length; i < l; i++) {
			stack[i].call(this, event);
		}
		return !event.defaultPrevented;
	}
	removeEventListener(type: string, callback: GoogleWebAuthEventListenerOrEventListenerObject): void {
		if (!(type in this.listeners)) {
			return;
		}
		var stack = this.listeners[type];
		for (var i = 0, l = stack.length; i < l; i++) {
			if (stack[i] === callback) {
				stack.splice(i, 1);
				return;
			}
		}
	}

	getState(): GoogleWebAuthState {
		return this._state;
	}

	setState(state: GoogleWebAuthState) {
		const oldState = this._state.generalState;
		const newState = state.generalState;
		this._state = state;
		this.dispatchEvent({
			oldState, newState,
			bubbles: false, cancelBubble: false, cancelable: false,
			composed: false,
			currentTarget: this, defaultPrevented: false, eventPhase: 0,
			isTrusted: true,
			returnValue: false,
			srcElement: null,
			target: this,
			timeStamp: Date.now(),
			type: EVENT_GOOGLE_WEB_AUTH,
			composedPath: () => [this],
			stopImmediatePropagation: () => { return; },
			stopPropagation: () => { return; },
			AT_TARGET: 0, BUBBLING_PHASE: 0, CAPTURING_PHASE: 0, NONE: 0,
			initEvent: () => { return; },
			preventDefault: () => { return; },
			//scoped: false,
			//deepPath: null,
		});
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
		this.setState({ ...this._state, generalState: "signingIn" });
		gapi.client.init({
			apiKey: this._cfg.apiKey,
			clientId: this._cfg.clientID,
			discoveryDocs: this._cfg.docsToLoad,
			scope: this._cfg.scope
		}).then(() => {
			// Listen for sign-in state changes.
			gapi.auth2.getAuthInstance().isSignedIn.listen(this._updateSigninStatus.bind(this));

			// Handle the initial sign-in state.
			this._updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			//authorizeButton.onclick = handleAuthClick;
			//signoutButton.onclick = handleSignoutClick;
			gapi.auth2.getAuthInstance().signIn();
		}).catch(() => {
			this.setState({ ...this._state, generalState: "notSignedIn" });
		});
	}

	reSignIn(): boolean {
		if (this._state.generalState === "notSignedIn") {
			gapi.auth2.getAuthInstance().signIn();
			return true;
		} else {
			return false;
		}
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