import { SFC, Component } from 'react';

import { Store } from 'redux';
import { Provider, connect } from 'react-redux';

import { ExplorerState, configureStore, isProduction, modAPI, IAppConfigStatePart } from 'appstate/store';

//import {Observable} from 'rxjs';
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
	},
	isLoading: false
};

/*export type DemoCompleteReceiver = {
	isInitDemo: boolean,
	notifyDemoComplete: () => void
};*/
export interface AppRootProps {
	cfg: IAppConfigStatePart;
	isLoading: boolean;
}
export interface AppRootState {
	isDemoInitialized: boolean;
	cfg: IAppConfigStatePart;
	isLoading: boolean;
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
			|| prevState.isLoading !== nextProps.isLoading
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
			mode: "initial",
			isLoading: true
		};
	}

	render() {
		const { cfg, isLoading } = this.state;
		return (
			<>{!isLoading ?
				<Router>
					<Route path="/" render={(routeProps: LDRouteProps) => {
						return <LDApproot initiallyDisplayedItptName={cfg.mainItpt}
							ldTokenString={cfg.appKey} routes={routeProps} />;
					}} />
				</Router>
				: <div className="approot-loading">loading</div>}
			</>
		);
	}
}

const ReduxAppRoot = connect<AppRootProps>(mapStateToPropsRoot)(PureAppRoot);

export const AppRoot = () =>
	<Provider store={applicationStore}>
		<ReduxAppRoot />
	</Provider>;
