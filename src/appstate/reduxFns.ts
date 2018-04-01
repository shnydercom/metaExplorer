import { ExplorerState } from "appstate/store";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch } from "appstate/LDProps";
import { ILDOptions } from "ldaccess/ildoptions";
import * as redux from 'redux';
import { IKvStore } from "ldaccess/ikvstore";
import { ldOptionsClientSideCreateAction, ldOptionsClientSideUpdateAction } from "appstate/epicducks/ldOptions-duck";
import { ILDResource } from "ldaccess/ildresource";
import { UserDefDict } from "ldaccess/UserDefDict";
import { OutputKVMapElement } from "ldaccess/ldBlueprint";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { linearSplitAction } from "./epicducks/linearSplit-duck";
import { refMapPREFILLAction, refMapFILLAction } from "./epicducks/refMap-duck";

//final:
export const mapStateToProps = (state: ExplorerState, ownProps: LDOwnProps): LDOwnProps & LDConnectedState => {
	let tokenString: string = ownProps ? ownProps.ldTokenString : null;
	let ldOptionsLoc: ILDOptions = tokenString ? state.ldoptionsMap[tokenString] : null;
	//ldOptionsLoc = ldOptionsLoc ? {...ldOptionsLoc} : null; //only spread if exists
	if (ldOptionsLoc) {
		ldOptionsLoc = ldTkStrRefToFilledProp(state, ownProps, ldOptionsLoc);
		//ldOptionsLoc = ldOptionsDeepCopy(ldOptionsLoc); //causes circular calls
	}
	return {
		...ownProps,
		ldOptions: (ldOptionsLoc)
	};
};

const ldTkStrRefToFilledProp = (state: ExplorerState, ownProps: LDOwnProps, ldOptionsLoc: ILDOptions): ILDOptions => {
	let rv: ILDOptions = { ...ldOptionsLoc };
	let ldTokenString: string = ldOptionsLoc.ldToken.get();
	let newKVStores = ldOptionsLoc.resource.kvStores.map((val, idx) => {
		if (val.ldType !== UserDefDict.ldTokenStringReference) return val;
		let ldOptionsSub = state.ldoptionsMap[val.value];
		if (!ldOptionsSub) return val;
		let outPutKVMap = ldOptionsSub.resource.kvStores.find((elem) => elem.key === UserDefDict.outputKVMapKey);
		if (!outPutKVMap) return val;
		outPutKVMap = outPutKVMap.value;
		if (!outPutKVMap) return val;
		let rvInner = null;
		for (const key in outPutKVMap) {
			if (outPutKVMap.hasOwnProperty(key)) {
				const element: OutputKVMapElement = outPutKVMap[key];
				if (element.targetLDToken.get() !== ldTokenString) continue;

				if (element.targetProperty !== val.key) continue;
				rvInner = ldOptionsSub.resource.kvStores.find((elem) => elem.key === key);
			}
		}
		if (!rvInner) return val;
		return rvInner;
	});
	let newResource: ILDResource = {
		kvStores: newKVStores,
		webInResource: ldOptionsLoc.resource.webInResource,
		webOutResource: ldOptionsLoc.resource.webOutResource
	};
	return rv;
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
	},
	notifyLDOptionsLinearSplitChange: (ldOptions: ILDOptions) => {
		if (!ldOptions) return;
		dispatch(linearSplitAction(ldOptions));
	},
	notifyLDOptionsRefMapSplitChange: (ldOptions: ILDOptions) => {
		if (!ldOptions) return;
		dispatch(refMapPREFILLAction(ldOptions));
		dispatch(refMapFILLAction(ldOptions));
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
