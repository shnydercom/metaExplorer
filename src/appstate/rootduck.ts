import { combineReducers, Reducer } from 'redux'
import { combineEpics, Epic } from 'redux-observable'
import { isLoadingSchemaReducer, loadSchemaEpic } from './epicducks/schemameta'


export const rootReducer = combineReducers({
    isLoadingSchemaReducer
})

export const rootEpic = combineEpics(
    loadSchemaEpic
);