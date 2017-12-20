import { ExplorerState } from "appstate/store";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch } from "appstate/LDProps";
import { ILDOptions } from "ldaccess/ildoptions";
import * as redux from 'redux';
import { IKvStore } from "ldaccess/ikvstore";
import { ldOptionsClientSideCreateAction, ldOptionsClientSideUpdateAction } from "appstate/epicducks/ldOptions-duck";

//final:
export const mapStateToProps = (state: ExplorerState, ownProps: LDOwnProps): LDOwnProps & LDConnectedState => {
	let tokenString: string = ownProps ? ownProps.ldTokenString : null;
	let ldOptionsLoc: ILDOptions = tokenString ? state.ldoptionsMap[tokenString] : null;
	return {
		...ownProps,
		ldOptions: ldOptionsLoc
	};
};

export const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>, ownProps: LDOwnProps): LDConnectedDispatch => ({
	notifyLDOptionsChange: (ldOptions: ILDOptions) => {
		if (!ldOptions) {
			let kvStores: IKvStore[] = [/*ownProps.singleKV*/];
			let lang: string;
			let alias: string = ownProps.ldTokenString;
			dispatch(ldOptionsClientSideCreateAction(kvStores, lang, alias));
		} else {
			dispatch(ldOptionsClientSideUpdateAction(ldOptions));
		}
	}
});

//InterpreterReferenceMapType
/*export type LDConnectedDispatch = {
	notifyLDOptionsChange: (ldOptions: ILDOptions) => void;
};

const mapStateToProps = (state: ExplorerState, ownProps: AIDProps) => {
	let tokenString: string = ownProps ? ownProps.ldTokenString : null;
	let ldOptionsLoc: ILDOptions = tokenString ? state.ldoptionsMap[tokenString] : null;
	return {
		ldOptions: ldOptionsLoc
	};
};

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>, ownProps: AIDProps & LDOwnProps & AIDState): LDConnectedDispatch => ({
	notifyLDOptionsChange: (ldOptions: ILDOptions) => {
		if (!ownProps.ldTokenString) return;
		if (!ldOptions) {
			let alias: string = ownProps.ldTokenString; //i.e. interpreter.nameSelf
			let kvStores: IKvStore[] = [{
				key: undefined,
				ldType: alias,
				value: ownProps.serialized
			}];
			let lang: string;
			dispatch(ldOptionsClientSideCreateAction(kvStores, lang, alias));
		} else {
			dispatch(ldOptionsClientSideUpdateAction(ldOptions));
		}
	}
});*/

//GenericContainer:
/*
const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): LDConnectedState => {
	let tokenString: string = ownProps ? ownProps.ldTokenString : null;
	let ldOptionsLoc: ILDOptions = tokenString ? state.ldoptionsMap[tokenString] : null;
	return {
		ldOptions: ldOptionsLoc
	};
};

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>, ownProps: OwnProps): LDConnectedDispatch => ({
	notifyLDOptionsChange: (ldOptions: ILDOptions) => {
		if (!ownProps.ldTokenString) return;
		if (!ldOptions) {
			let kvStores: IKvStore[] = [{ key: undefined, value: undefined, ldType: null /*ownProps.displayedType*/ /* }];
			let lang: string;
			let alias: string = ownProps.ldTokenString;
			dispatch(ldOptionsClientSideCreateAction(kvStores, lang, alias));
		} else {
			dispatch(ldOptionsClientSideUpdateAction(ldOptions));
		}
	}
});
*/

//BaseDataTypeInput
/*const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): LDConnectedState => {
	let tokenString: string = ownProps ? ownProps.ldTokenString : null;
	let ldOptionsLoc: ILDOptions = tokenString ? state.ldoptionsMap[tokenString] : null;
	return {
		ldOptions: ldOptionsLoc
	};
};

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>, ownProps: OwnProps): LDConnectedDispatch => ({
	notifyLDOptionsChange: (ldOptions: ILDOptions) => {
		if (!ldOptions) {
			let kvStores: IKvStore[] = [ownProps.singleKV];
			let lang: string;
			let alias: string = ownProps.ldTokenString;
			dispatch(ldOptionsClientSideCreateAction(kvStores, lang, alias));
		} else {
			dispatch(ldOptionsClientSideUpdateAction(ldOptions));
		}
	}
});*/

//BaseDataTypePortSelector
/*const mapStateToProps = (state: ExplorerState, ownProps: BaseDataTypePortSelectorProps): LDConnectedState & BaseDataTypePortSelectorProps => {
	let tokenString: string = ownProps && ownProps.model ? ownProps.model.getID() : null;
	let ldOptionsLoc: ILDOptions = tokenString ? state.ldoptionsMap[tokenString] : null;
	return {
		...ownProps,
		ldOptions: ldOptionsLoc
	};
};

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>, ownProps: BaseDataTypePortSelectorProps): LDConnectedDispatch => ({
	notifyLDOptionsChange: (ldOptions: ILDOptions) => {
		if (!ownProps.ldTokenString) return;
		if (!ldOptions) {
			let kvStores: IKvStore[] = [ownProps.model.kv];
			let lang: string;
			let alias: string = ownProps.ldTokenString;
			dispatch(ldOptionsClientSideCreateAction(kvStores, lang, alias));
		} else {
			dispatch(ldOptionsClientSideUpdateAction(ldOptions));
		}
	}
});*/