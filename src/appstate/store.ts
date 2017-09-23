import { createStore, applyMiddleware, Store } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic, rootReducer } from './rootduck';
import { ajax } from 'rxjs/observable/dom/ajax';

const epicMiddleware = createEpicMiddleware(rootEpic, {dependencies: { getJSON: ajax.getJSON }} );

export type ExplorerStore = {
  //isSaving: boolean,
  //isLoading: boolean,
  //error: string,
}

export function configureStore(): Store<ExplorerStore> {
  const store : Store<ExplorerStore> = createStore(
    rootReducer,
    applyMiddleware(epicMiddleware)
  );
  return store;
}

export default configureStore;