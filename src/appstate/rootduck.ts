import { combineReducers, Reducer } from 'redux';
import { combineEpics, Epic } from 'redux-observable';
import { isLoadingSchemaReducer, loadSchemaEpic } from './epicducks/schemameta';
import { isUploadingImgReducer, uploadImageEpic } from 'appstate/epicducks/image-upload';
import { ExplorerState } from 'appstate/store';
import { ldOptionsMapReducer, requestLDOptionsEpic } from 'appstate/epicducks/ldOptions-duck';
import { ldNonVisMapReducer } from 'appstate/epicducks/ldNonVisual-duck';

//at the level of the root reducer, next-action-predicates should be handled
export const rootReducer = combineReducers<ExplorerState>({
    isLoading:  isUploadingImgReducer,
    isSaving: isLoadingSchemaReducer,
    ldoptionsMap: ldOptionsMapReducer,
    ldNonVisualMap: ldNonVisMapReducer
});

export const rootEpic = combineEpics(
    uploadImageEpic,
    loadSchemaEpic,
    requestLDOptionsEpic
);
