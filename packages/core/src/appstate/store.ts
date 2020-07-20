import { createStore, applyMiddleware, Store, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic, rootReducer } from './rootduck';
import { ImageUploadAPI } from '../apis/image-upload';
import { ILDOptions } from '../ldaccess/ildoptions';
import { LDOptionsAPI } from '../apis/ldoptions-api';
//import { DevTools } from './devTools';
import { IBlueprintItpt } from '../ldaccess/ldBlueprint';
import { IModStatePart } from './modstate';
import { ModAPI } from '../apis/mod-api';

const imgUploader: ImageUploadAPI = new ImageUploadAPI();
const ldOptionsAPI: LDOptionsAPI = new LDOptionsAPI();
export const modAPI: ModAPI = new ModAPI();

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    imgULAPI: imgUploader,
    ldOptionsAPI,
    modAPI
  }
});

export interface ILDOptionsMapStatePart {
  [s: string]: ILDOptions;
}

export interface ILDActionsHandlerStatePart {
  typehandler: {
    [s: string]: string;
  };
  idHandler: {
    [s: string]: string;
  };
}

export interface ILDNonvisualIntrprtrMapStatePart {
  [s: string]: IBlueprintItpt;
}

export const isProduction = process.env.NODE_ENV === 'production';

export const isDemo = process.env.METAEXPLORER_MODE === 'demo';
export const isStateDebug = process.env.METAEXPLORER_MODE === 'statedebug';

let composeEnhancers = null;

if (typeof window !== "undefined") {
  composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
} else {
  composeEnhancers = compose;
}

let middleWare = composeEnhancers(applyMiddleware(epicMiddleware)); // /*isProduction ?*/ applyMiddleware(epicMiddleware); /* :
//isStateDebug ? compose(applyMiddleware(epicMiddleware), DevTools.instrument()) : applyMiddleware(epicMiddleware);*/

export interface IAppConfigStatePart {
  appKey: string;
  mainItpt: string;
  errorMsg: string;
}

export interface ExplorerState {
  mods: IModStatePart;
  appCfg: IAppConfigStatePart;
  isSaving?: boolean;
  isLoading: boolean;
  //error: string,
  ldoptionsMap: ILDOptionsMapStatePart;
  ldNonVisualMap: ILDNonvisualIntrprtrMapStatePart;
  actionHandlerMap: ILDActionsHandlerStatePart;
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
