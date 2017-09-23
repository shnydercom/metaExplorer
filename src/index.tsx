import React from 'react'
import { render } from 'react-dom'

import * as redux from 'redux'
import { Provider } from 'react-redux'

import {ExplorerStore, configureStore} from 'appstate/store'

//import {Observable} from 'rxjs';
import EntryPointDesignerContainer from 'components/entrypointdesigner-container'
//import { DiagramEngine } from 'storm-react-diagrams'
import './styles/styles.scss';

const store: redux.Store<ExplorerStore> = configureStore();

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <p>React is working</p>
        <EntryPointDesignerContainer />
      </div>
    </Provider>
  )
}

//var test : Observable<string> = Observable.of<string>();

render(<App />, document.getElementById('app'))