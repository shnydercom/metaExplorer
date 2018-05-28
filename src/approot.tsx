import { SFC } from 'react';

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
	BrowserRouter as Router
} from 'react-router-dom';
import { appItptMatcherFn } from 'appconfig/appItptMatcher';
import { initReactToolBoxRetrieverFnAsDefault } from 'components/react-toolbox/initReactToolBoxRetrieverSetup';

const initialState: ExplorerState = {
	ldoptionsMap: {},
	ldNonVisualMap: {}
};

const isProduction = true; //process.env.NODE_ENV === 'production';

export interface AppRootProps { }
export const applicationStore: Store<ExplorerState> = configureStore(initialState);
const appItptToken: string = "tID"; //TODO: uncomment Toolkit.UID();
function rootSetup(): void {
	appItptMatcherFn();
	initReactToolBoxRetrieverFnAsDefault();
	initLDConnect();
}

rootSetup();
export const AppRoot: SFC<AppRootProps> = () => {
	return (
		<Provider store={applicationStore}>
			<Router>
				<div>
					<AppItptDesigner ldTokenString={appItptToken}/>
					{!isProduction && <DevTools />}
				</div>
			</Router>
		</Provider>
	);
};
AppRoot.defaultProps = {};
// for Redux-DevTools, add:
// <ImageUploadComponent />
