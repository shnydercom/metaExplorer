import { SFC, Component } from 'react';

import { Store } from 'redux';
import { Provider } from 'react-redux';

import { Toolkit } from "storm-react-diagrams";
import { ExplorerState, configureStore } from 'appstate/store';

//import {Observable} from 'rxjs';
import AppItptDesigner from 'components/itpt-designer/appitpt-designer';
import ImageUploadComponent from 'components/imageupload-component';
//import { DiagramEngine } from 'storm-react-diagrams'
import './styles/styles.scss';
import DevTools from './appstate/devTools';
import { initLDConnect } from 'sidefx/nonVisualConnect';
import {
	BrowserRouter as Router, Link
} from 'react-router-dom';
import { appItptMatcherFn } from 'appconfig/appItptMatcher';
import { initMDitptFnAsDefault } from 'components/md/initMDitptRetrieverSetup';
import { Route } from 'react-router';
import { LDRouteProps } from 'appstate/LDProps';
import { initEssentialItpts } from 'defaults/initEssentialItpts';
import 'mods/google/components/GWebAuthenticator';
import { initGameItpt } from 'components/game/initGameItpts';
import { initBaseHtmlItpt } from 'components/basic-html/initBaseHtmlItpt';
import LDApproot, { PureLDApproot } from 'ldapproot';
import { initShnyderItpts } from 'components/shnyder/initShnyderItpts';
import { initMods } from 'mods/initMods';

const initialState: ExplorerState = {
	ldoptionsMap: {},
	ldNonVisualMap: {}
};

const isProduction = process.env.NODE_ENV === 'production';

export type DemoCompleteReceiver = {
	isInitDemo: boolean,
	notifyDemoComplete: () => void
};
export interface AppRootProps {
}
export interface AppRootState {
	mode: "designer" | "app";
	isDemoInitialized: boolean;
}
export const applicationStore: Store<ExplorerState> = configureStore(initialState);
const appItptToken: string = "tID"; //TODO: uncomment Toolkit.UID();
function rootSetup(): void {
	appItptMatcherFn();
	initEssentialItpts();
	initBaseHtmlItpt();
	initMDitptFnAsDefault();
	initGameItpt();
	initLDConnect();
	initMods();
	initShnyderItpts();
}

rootSetup();
export class AppRoot extends Component<AppRootProps, AppRootState>{
	constructor(props) {
		super(props);
		this.state = { mode: "app", isDemoInitialized: false };
	}

	render() {
		console.log("isDemoInitialized: " + this.state.isDemoInitialized);
		return (
			<Provider store={applicationStore}>
				<Router>
					<Route path="/" render={(routeProps: LDRouteProps) => {
						if (routeProps.location.search === "?mode=designer" && this.state.mode !== "designer") {
							console.log("switching to designer");
							this.setState({ ...this.state, mode: "designer" });
							this.forceUpdate();
						}
						if (routeProps.location.search === "?mode=app" && this.state.mode !== "app") {
							console.log("switching to app");
							this.setState({ ...this.state, mode: "app" });
						}
						if (this.state.mode === "designer") {
							return (
								<div style={{ flex: "1", background: "white" }}>
									<AppItptDesigner ldTokenString={appItptToken} routes={routeProps} isInitDemo={!this.state.isDemoInitialized}
										notifyDemoComplete={() => this.setState({ ...this.state, isDemoInitialized: true })}/>
									{!isProduction && <DevTools />}
									<div className="mode-switcher">
										<Link to={{ pathname: routeProps.location.pathname, search: "?mode=app" }}>
											Switch to App
										</Link>
									</div>
								</div>
							);
						} else {
							return (
								<div className="app-actual">
									<LDApproot ldTokenString={appItptToken} routes={routeProps} isInitDemo={!this.state.isDemoInitialized}
										notifyDemoComplete={() => this.setState({ ...this.state, isDemoInitialized: true })}/>
									<div className="mode-switcher">
										<Link to={{ pathname: routeProps.location.pathname, search: "?mode=designer" }}>
											Switch to Designer
										</Link>
									</div>
								</div>
							);
						}
					}} />
				</Router>
			</Provider>
		);
	}
}
// for Redux-DevTools, add:
// <ImageUploadComponent />
