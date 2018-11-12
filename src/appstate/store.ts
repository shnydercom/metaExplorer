import { createStore, applyMiddleware, Store, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic, rootReducer } from './rootduck';
import { ImageUploadAPI } from 'apis/image-upload';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDOptionsAPI } from 'apis/ldoptions-api';
import DevTools from './devTools';
import { IBlueprintItpt } from 'ldaccess/ldBlueprint';
import { ItptLoadApi } from 'apis/itpt-load-api';

const imgUploader: ImageUploadAPI = new ImageUploadAPI();
const ldOptionsAPI: LDOptionsAPI = new LDOptionsAPI();
export const itptLoadApi = new ItptLoadApi();

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    imgULAPI: imgUploader,
    ldOptionsAPI: ldOptionsAPI
  }
});

export interface ILDOptionsMapStatePart {
  [s: string]: ILDOptions;
}

export interface ILDNonvisualIntrprtrMapStatePart {
  [s: string]: IBlueprintItpt;
}

const isProduction = process.env.NODE_ENV === 'production';

let middleWare = isProduction ? applyMiddleware(epicMiddleware) : compose(applyMiddleware(epicMiddleware), DevTools.instrument());

export interface ExplorerState {
  isSaving?: boolean;
  isLoading?: boolean;
  //error: string,
  ldoptionsMap: ILDOptionsMapStatePart;
  ldNonVisualMap: ILDNonvisualIntrprtrMapStatePart;
}
export function configureStore(initialState: ExplorerState): Store<ExplorerState> {
  const store: Store<ExplorerState> = createStore<ExplorerState, any, any, any>(
    rootReducer,
    initialState,
    middleWare
  );
  epicMiddleware.run(rootEpic as any);
  return store;
}


export default configureStore;
