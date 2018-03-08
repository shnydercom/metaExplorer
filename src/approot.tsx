import React from 'react';

import * as redux from 'redux';
import { Provider } from 'react-redux';

import { Toolkit } from "storm-react-diagrams";
import { ExplorerState, configureStore } from 'appstate/store';

//import {Observable} from 'rxjs';
import AppInterpreterDesigner from 'components/appinterpreter-designer';
import ImageUploadComponent from 'components/imageupload-component';
//import { DiagramEngine } from 'storm-react-diagrams'
import './styles/styles.scss';
import DevTools from './appstate/devTools';
import { initLDConnect } from 'sidefx/nonVisualConnect';
import {
	BrowserRouter as Router
} from 'react-router-dom';

const initialState: ExplorerState = {
	ldoptionsMap: {},
	ldNonVisualMap: {}
};

const isProduction = process.env.NODE_ENV === 'production';

export interface AppRootProps { }
export const applicationStore: redux.Store<ExplorerState> = configureStore(initialState);
initLDConnect();
const appinterpreterToken: string = Toolkit.UID();

export const AppRoot: React.SFC<AppRootProps> = () => {
	return (
		<Provider store={applicationStore}>
			<Router>
				<div>
					<AppInterpreterDesigner ldTokenString={appinterpreterToken} outputKVMap={null} />
					{!isProduction && <DevTools />}
				</div>
			</Router>
		</Provider>
	);
};
AppRoot.defaultProps = {};

// for Redux-DevTools, add:
// <ImageUploadComponent />
