import { combineReducers, Reducer } from 'redux'
import { combineEpics, Epic } from 'redux-observable'
import { isLoadingSchemaReducer, loadSchemaEpic } from './epicducks/schemameta'

//at the level of the root reducer, next-action-predicates should be handled
export const rootReducer = combineReducers({
    isLoadingSchemaReducer
})

export const rootEpic = combineEpics(
    loadSchemaEpic
);