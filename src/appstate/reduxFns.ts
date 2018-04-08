import { ExplorerState } from "appstate/store";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch } from "appstate/LDProps";
import { ILDOptions } from "ldaccess/ildoptions";
import { IKvStore } from "ldaccess/ikvstore";
import { ldOptionsClientSideCreateAction, ldOptionsClientSideUpdateAction } from "appstate/epicducks/ldOptions-duck";
import { ILDResource } from "ldaccess/ildresource";
import { UserDefDict } from "ldaccess/UserDefDict";
import { OutputKVMapElement, OutputKVMap, BlueprintConfig } from "ldaccess/ldBlueprint";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { linearSplitRequestAction } from "./epicducks/linearSplit-duck";
import { refMapREQUESTAction, refMapSUCCESSAction } from "./epicducks/refMap-duck";
import { Dispatch } from "redux";

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

export const mapDispatchToProps = (dispatch: Dispatch<ExplorerState>, ownProps: LDOwnProps): LDConnectedDispatch => ({
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
		dispatch(linearSplitRequestAction(ldOptions));
	},
	notifyLDOptionsRefMapSplitChange: (ldOptions: ILDOptions, refMap: BlueprintConfig) => {
		if (!ldOptions) return;
		dispatch(refMapREQUESTAction(ldOptions, refMap));
	},
	dispatchKvOutput: (thisLdTkStr: string, updatedKvMap: OutputKVMap) => {
		return;
	}
});
