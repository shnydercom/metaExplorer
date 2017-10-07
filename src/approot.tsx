import React from 'react';

import * as redux from 'redux';
import { Provider } from 'react-redux';

import { ExplorerState, configureStore } from 'appstate/store';

//import {Observable} from 'rxjs';
import AppInterpreterDesigner from 'components/appinterpreter-designer';
import ImageUploadComponent from 'components/imageupload-component';
//import { DiagramEngine } from 'storm-react-diagrams'
import './styles/styles.scss';

const initialState: ExplorerState = {
  demoObj : null
};
const store: redux.Store<ExplorerState> = configureStore(initialState);

export const AppRoot = () => {
	return (
		<Provider store={store}>
			<div>
				<p>React is working</p>
				<AppInterpreterDesigner />
				<ImageUploadComponent/>
			</div>
		</Provider>
	);
};
