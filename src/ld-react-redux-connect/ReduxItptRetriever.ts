import { InferableComponentEnhancerWithProps, connect } from "react-redux";
import { DefaultItptRetriever, IItptInfoItem } from "defaults/DefaultItptRetriever";
import { IBlueprintItpt, BlueprintConfig } from "ldaccess/ldBlueprint";
import { LDConnectedState, LDConnectedDispatch, LDOwnProps } from "appstate/LDProps";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";

export class ReduxItptRetriever extends DefaultItptRetriever {
	//maps by nameSelf of the Itpt
	private connectedItpts: Map<string, any> = new Map();

	searchForObjItpt(term: string | string[], crudSkills: string) {
		let searchResult = super.searchForObjItpt(term, crudSkills) as IBlueprintItpt;
		if (searchResult) {
			return this.connectedItpts.get(searchResult.cfg.nameSelf);
		}
		return null;
	}

	searchForObjItptAndDerive(term: string | string[], crudSkills: string, newLDTokenStr: string) {
		let prevItpt = this.getDerivedItpt(newLDTokenStr) as IBlueprintItpt;
		let searchResult = super.searchForObjItpt(term, crudSkills) as IBlueprintItpt;
		if (searchResult && (!prevItpt || prevItpt.cfg.nameSelf !== searchResult.cfg.nameSelf) ){
			this.setDerivedItpt(newLDTokenStr, searchResult);
		}
		return null;
	}

	searchForKVItpt(term: string, crudSkills: string) {
		throw new Error("Method not implemented.");
	}
	addItpt(typeName: string, intrprtr: any, crudSkills: string): void {
		super.addItpt(typeName, intrprtr, crudSkills);
		let intrprtrAsLDBP: IBlueprintItpt = intrprtr;
		let nameSelf = intrprtrAsLDBP.cfg.nameSelf;
		let connItpt = connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(intrprtr);
		this.connectedItpts.set(nameSelf, connItpt);
	}
	setDerivedItpt(ldTokenVal: string, itpt: any): void {
		super.setDerivedItpt(ldTokenVal, itpt);
		let intrprtrAsLDBP: IBlueprintItpt = itpt;
		let nameSelf = intrprtrAsLDBP.cfg.nameSelf;
		let connItpt = connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(itpt);
		this.connectedItpts.set(nameSelf, connItpt);
	}

	getDerivedItpt(ldTokenVal: string): any {
		let searchResult = super.getDerivedItpt(ldTokenVal) as IBlueprintItpt;
		if (searchResult) {
			return this.connectedItpts.get(searchResult.cfg.nameSelf);
		}
		return null;
	}

	getItptByNameSelf(nameSelf: string) {
		let searchResult = super.getItptByNameSelf(nameSelf) as IBlueprintItpt;
		if (searchResult) {
			return this.connectedItpts.get(searchResult.cfg.nameSelf);
		}
		return null;
	}

	getItptList(): Array<any> {
		return super.getItptList();
	}
	/**
	 * gets itpt that is not connected to Redux
	 * @param nameSelf the nameSelf-property in the BlueprintConfig of the itpt
	 */
	getUnconnectedByNameSelf(nameSelf: string) {
		let searchResult = super.getItptByNameSelf(nameSelf);
		if (searchResult) {
			return searchResult;
		} else {
			return null;
		}
	}

	hasConnectedByNameSelf(nameSelf: string) {
		return this.connectedItpts.has(nameSelf);
	}
}
