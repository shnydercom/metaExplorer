import React from 'react';
import { Component } from 'react';
import { Store } from 'redux';
import { Provider, connect } from 'react-redux';
import { ExplorerState, configureStore, modAPI, IAppConfigStatePart } from './appstate/store';
//import './styles/styles.scss';
//import { DevTools } from './appstate/devTools';
import { initLDConnect } from './sidefx/nonVisualConnect';
import {
	BrowserRouter as Router
} from 'react-router-dom';
import { appItptMatcherFn } from './appconfig/appItptMatcher';
import { initEssentialInterpreters } from './components/essentials/initEssentialItptRetrieverSetup';
import { Route, Switch } from 'react-router';
import { LDRouteProps } from './appstate/LDProps';
import { initEssentialItpts } from './defaults/initEssentialItpts';
import { initGameItpt } from './components/game/initGameItpts';
import { initBaseHtmlItpt } from './components/basic-html/initBaseHtmlItpt';
import { LDApproot } from './ldapproot';
import { initRequiredMods } from './modding/initMods';
import { mapStateToPropsRoot } from './appstate/reduxFns';
import { IModSpec } from './apis/mod-api';
import { initIRIFormatter } from './components/iri-formatter/initIRIFormatter';
import { initMathsBlocks } from './components/maths/initMathsBlocks';
import { initAnalyticsItpt } from './components';

export const APP_LD_KEY = "app";

const firstDisplayedBlock: string = "metaexplorer.io/index";

const initialState: ExplorerState = {
	appCfg: {
		appKey: APP_LD_KEY,
		mainItpt: firstDisplayedBlock,
		errorMsg: null
	},
	ldoptionsMap: {},
	ldNonVisualMap: {},
	mods: {
		isIdle: true,
		map: {}
	},
	isLoading: false,
	actionHandlerMap: {
		idHandler: {},
		typehandler: {}
	}
};

export interface AppRootProps {
	cfg: IAppConfigStatePart;
	isLoading: boolean;
}
export interface AppRootState {
	isDemoInitialized: boolean;
	cfg: IAppConfigStatePart;
	isLoading: boolean;
}
let applStore = null;
export const getApplicationStore: () => Store<ExplorerState> = () => {
	if (applStore) return applStore;
	applStore = configureStore(initialState);
	return applStore;
};

export function rootSetup(requiredMods: IModSpec[]): void {
	appItptMatcherFn();
	initEssentialItpts();
	initMathsBlocks();
	initAnalyticsItpt();
	initBaseHtmlItpt();
	initEssentialInterpreters();
	initIRIFormatter();
	initGameItpt();
	initLDConnect();
	initRequiredMods(modAPI, requiredMods);
}

export class PureAppRoot extends Component<AppRootProps, AppRootState>{

	static getDerivedStateFromProps(nextProps: AppRootProps, prevState: AppRootState): AppRootState | null {
		if (!prevState || !prevState.cfg ||
			prevState.cfg.appKey !== nextProps.cfg.appKey
			|| prevState.cfg.mainItpt !== nextProps.cfg.mainItpt
			|| prevState.isLoading !== nextProps.isLoading
			|| !!nextProps.cfg.errorMsg
		) {
			return { ...prevState, ...nextProps };
		}
		return null;
	}

	constructor(props) {
		super(props);
		this.state = {
			isDemoInitialized: false,
			cfg: { appKey: "", mainItpt: "", errorMsg: null },
			isLoading: true
		};
	}

	render() {
		const { cfg, isLoading } = this.state;
		const errorMsg = cfg.errorMsg;
		if (errorMsg) {
			return <div>encountered an error while loading a Mod: {errorMsg}</div>;
		}
		return (
			<>
				{!isLoading ?
					<Router>
						<Switch>
							<Route path="/" render={(routeProps: LDRouteProps) => {
								return <LDApproot initiallyDisplayedItptName={cfg.mainItpt}
									ldTokenString={cfg.appKey} routes={routeProps} />;
							}} />
							{/*<Route component={FourOhFournomatch} />*/}
						</Switch>
					</Router>
					: <div className="approot-loading">loading</div>}
				{/*isProduction ? null : isStateDebug ? <DevTools /> : null*/}
			</>
		);
	}
}

export const AppRoot = () => {
	const ReduxAppRoot = connect<AppRootProps>(mapStateToPropsRoot)(PureAppRoot);
	return <Provider store={getApplicationStore()}>
		<ReduxAppRoot />
	</Provider>;
};
