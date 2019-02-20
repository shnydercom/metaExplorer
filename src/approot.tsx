import { SFC, Component } from 'react';

import { Store } from 'redux';
import { Provider, connect } from 'react-redux';

import { ExplorerState, configureStore, isProduction, modAPI, IAppConfigStatePart } from 'appstate/store';

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
import { Button } from 'react-toolbox/lib/button';
import { mapStateToPropsRoot } from 'appstate/reduxFns';

export const APP_LD_KEY = "app";

const firstDisplayedBlock: string = "shnyder-website/main-page";

const initialState: ExplorerState = {
	appCfg: {
		appKey: APP_LD_KEY,
		mainItpt: firstDisplayedBlock
	},
	ldoptionsMap: {},
	ldNonVisualMap: {},
	mods: {
		isIdle: true,
		map: {}
	}
};

/*export type DemoCompleteReceiver = {
	isInitDemo: boolean,
	notifyDemoComplete: () => void
};*/
export interface AppRootProps {
	cfg: IAppConfigStatePart;
}
export interface AppRootState {
	isDemoInitialized: boolean;
	cfg: IAppConfigStatePart;
	mode: "editor" | "app" | "initial";
}
export const applicationStore: Store<ExplorerState> = configureStore(initialState);
function rootSetup(): void {
	appItptMatcherFn();
	initEssentialItpts();
	initBaseHtmlItpt();
	initMDitptFnAsDefault();
	initGameItpt();
	initLDConnect();
	initMods(modAPI);
	initShnyderItpts();
}

rootSetup();

export class PureAppRoot extends Component<AppRootProps, AppRootState>{

	static getDerivedStateFromProps(nextProps: AppRootProps, prevState: AppRootState): AppRootState | null {
		if (!prevState || !prevState.cfg ||
			prevState.cfg.appKey !== nextProps.cfg.appKey
			|| prevState.cfg.mainItpt !== nextProps.cfg.mainItpt
		) {
			return { ...prevState, ...nextProps };
		}
		return null;
	}

	constructor(props) {
		super(props);
		this.state = {
			isDemoInitialized: false,
			cfg: { appKey: "", mainItpt: "" },
			mode: "initial"
		};
	}

	render() {
		const { mode, cfg, isDemoInitialized } = this.state;
		return (
			<Router>
				<Route path="/" render={(routeProps: LDRouteProps) => {
					if (routeProps.location.search === "?mode=editor" && mode !== "editor") {
						this.setState({ ...this.state, mode: "editor" });
					}
					if (routeProps.location.search === "?mode=app" && mode !== "app") {
						this.setState({ ...this.state, mode: "app" });
					}
					if (!routeProps.location.search && mode === "initial") {
						this.setState({ ...this.state, mode: "app" });
					}
					if (mode === "editor") {
						return (
							<div style={{ flex: "1", background: "white" }}>
								<AppItptDesigner initiallyDisplayedItptName={cfg.mainItpt}
									ldTokenString={cfg.appKey} routes={routeProps} />
								{!isProduction && <DevTools />}
							</div>
						);
					} else
						if (mode === "app") {
							return (
								<div className="app-actual">
									<LDApproot initiallyDisplayedItptName={cfg.mainItpt}
										ldTokenString={cfg.appKey} routes={routeProps} />
									{!isProduction && <div className="mode-switcher">
										<Link to={{ pathname: routeProps.location.pathname, search: "?mode=editor" }}>
											Switch to Editor
											</Link>
									</div>
									}
								</div>
							);
						}
						else {
							return null;
						}
				}} />
			</Router>
		);
	}
}

const ReduxAppRoot = connect<AppRootProps>(mapStateToPropsRoot)(PureAppRoot);

export const AppRoot = () =>
	<Provider store={applicationStore}>
		<ReduxAppRoot />
	</Provider>;
