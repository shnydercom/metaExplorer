import { createStore, applyMiddleware, Store } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic, rootReducer } from './rootduck';
import { ajax } from 'rxjs/observable/dom/ajax';
import { ImageUploadAPI } from 'apis/image-upload';

const imgUploader: ImageUploadAPI = new ImageUploadAPI();

const epicMiddleware = createEpicMiddleware(rootEpic, { dependencies: { imgULAPI: imgUploader } });

export interface ExplorerState {
  //isSaving: boolean,
  //isLoading: boolean,
  //error: string,
  demoObj: any;
}

export function configureStore(initialState: ExplorerState): Store<ExplorerState> {
  const store: Store<ExplorerState> = createStore<ExplorerState>(
    rootReducer,
    initialState,
    applyMiddleware(epicMiddleware)
  );
  return store;
}

export default configureStore;
