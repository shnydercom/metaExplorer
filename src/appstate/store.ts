import { createStore, applyMiddleware, Store } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic, rootReducer } from './rootduck';
import { ajax } from 'rxjs/observable/dom/ajax';
import { ImageUploadAPI } from 'apis/image-upload'

const imgUploader : ImageUploadAPI = new ImageUploadAPI();

const epicMiddleware = createEpicMiddleware(rootEpic, {dependencies: { imgULAPI: imgUploader }} );

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