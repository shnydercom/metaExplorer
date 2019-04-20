import { LDError } from "appstate/LDError";
//isn't yet an ES6 module, has to be imported like this
import Keycloak = require("keycloak-js");

export const EVENT_KEYCLOAK_WEB_AUTH = "KeycloakEvent";

export interface KeycloakState {
	isAuthenticated: boolean;
	token: string;
}

export interface KeycloakEvent extends Event {
	isAuthChanged: boolean;
	kcState: KeycloakState;
}

export type KeycloakEventListener = (evt: KeycloakEvent) => void;
export type KeycloakEventListenerObject = {
	handleEvent(evt: KeycloakEvent): void;
};
export type KeycloakEventListenerOrEventListenerObject = KeycloakEventListener | KeycloakEventListenerObject;

export class KeyCloakAuthAPI {

	public static getKC() {
		return KeyCloakAuthAPI.getKeyCloakAuthAPISingleton();
	}

	public static getKeyCloakAuthAPISingleton(cfgSrc?: string): KeyCloakAuthAPI {
		if (KeyCloakAuthAPI.kcSingleton == null) {
			KeyCloakAuthAPI.kcSingleton = KeyCloakAuthAPI.initKeycloak(cfgSrc);
		}
		return KeyCloakAuthAPI.kcSingleton;
	}

	private static kcSingleton: KeyCloakAuthAPI;

	private static initKeycloak(cfgSrc?: string): KeyCloakAuthAPI {
		let rv = new KeyCloakAuthAPI();
		rv.kc = Keycloak(cfgSrc);
		rv.kc.init({}).success((authenticated) => {
			console.log("authenticated: " + authenticated);
			if (!authenticated) {
				rv.setState({ isAuthenticated: false, token: "" });
			}else{
				let token = rv.kc.token;
				rv.setState({ isAuthenticated: false, token });
			}
		}).error(() => {
			throw new LDError("Keycloak client adapter failed to initialize");
		});
		return rv;
	}

	protected isAuthenticated: boolean = false;
	protected authToken: string;
	protected kc: Keycloak.KeycloakInstance;

	protected listeners = {};

	// tslint:disable-next-line:variable-name
	protected _state: KeycloakState;

	constructor() {
		this._state = {
			isAuthenticated: false,
			token: ""
		};
	}
	//public function section

	public getIsAuthenticated(): boolean {
		return this.isAuthenticated;
	}

	public getAuthToken(): string {
		return this.authToken;
	}

	public getState(): KeycloakState {
		return this._state;
	}

	//event handling section

	addEventListener(type: string, listener: KeycloakEventListenerOrEventListenerObject): void {
		if (!(type in this.listeners)) {
			this.listeners[type] = [];
		}
		this.listeners[type].push(listener);
	}
	dispatchEvent(event: KeycloakEvent): boolean {
		if (!(event.type in this.listeners)) {
			return true;
		}
		var stack = this.listeners[event.type].slice();
		for (var i = 0, l = stack.length; i < l; i++) {
			stack[i].call(this, event);
		}
		return !event.defaultPrevented;
	}
	removeEventListener(type: string, callback: KeycloakEventListenerOrEventListenerObject): void {
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

	//protected function section

	protected setState(state: KeycloakState) {
		const oldState = this._state;
		this._state = state;
		let isAuthChanged = oldState.isAuthenticated !== this._state.isAuthenticated;
		this.dispatchEvent({
			isAuthChanged,
			kcState: state,
			bubbles: false, cancelBubble: false, cancelable: false,
			composed: false,
			currentTarget: this, defaultPrevented: false, eventPhase: 0,
			isTrusted: true,
			returnValue: false,
			srcElement: null,
			target: this,
			timeStamp: Date.now(),
			type: EVENT_KEYCLOAK_WEB_AUTH,
			composedPath: () => [this],
			stopImmediatePropagation: () => { return; },
			stopPropagation: () => { return; },
			AT_TARGET: 0, BUBBLING_PHASE: 0, CAPTURING_PHASE: 0, NONE: 0,
			initEvent: () => { return; },
			preventDefault: () => { return; },
			scoped: false,
			deepPath: null,
		});
	}
}
