import { combineReducers, Reducer } from 'redux';
import { combineEpics, Epic } from 'redux-observable';
import { isLoadingSchemaReducer, loadSchemaEpic } from './epicducks/schemameta';
import { isUploadingImgReducer, uploadImageEpic } from 'appstate/epicducks/image-upload';
import { ExplorerState } from 'appstate/store';
import { ldOptionsMapReducer, requestLDOptionsEpic } from 'appstate/epicducks/ldOptions-duck';
import { ldNonVisMapReducer } from 'appstate/epicducks/ldNonVisual-duck';
import { refMapReducer, refMapEpic } from './epicducks/refMap-duck';
import reduceReducers from './reduceReducers';
import { linearReducer, linearSplitEpic } from './epicducks/linearSplit-duck';
import loadModEpic, { modStatePartReducer } from './epicducks/mod-duck';
import { appCfgStatePartReducer } from './epicducks/appCfg-duck';
import { isLoadingReducer, loadingEpic } from './epicducks/isLoading-duck';
import { actionHandlerReducer } from './epicducks/action-duck';

const combLdOptionsMapReducer = reduceReducers(ldOptionsMapReducer, refMapReducer, linearReducer);

//at the level of the root reducer, next-action-predicates should be handled
export const rootReducer = combineReducers<ExplorerState>({
    appCfg: appCfgStatePartReducer,
    isLoading: isLoadingReducer,
    isSaving: isLoadingSchemaReducer,
    ldoptionsMap: combLdOptionsMapReducer,
    ldNonVisualMap: ldNonVisMapReducer,
    mods: modStatePartReducer,
    actionHandlerMap: actionHandlerReducer
});

export const rootEpic = combineEpics(
    linearSplitEpic,
    uploadImageEpic,
    loadSchemaEpic,
    requestLDOptionsEpic,
    refMapEpic,
    loadModEpic,
    loadingEpic
);
