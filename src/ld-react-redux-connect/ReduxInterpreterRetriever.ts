import { InferableComponentEnhancerWithProps, connect } from "react-redux";
import { DefaultItptRetriever } from "defaults/DefaultInterpreterRetriever";
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
	getItptList(): Array<any> {
		return super.getItptList();
	}
	getItptByNameSelf(nameSelf: string) {
		let searchResult = super.getItptByNameSelf(nameSelf) as IBlueprintItpt;
		if (searchResult) {
			return this.connectedItpts.get(searchResult.cfg.nameSelf);
		}
		return null;
	}
	getUnconnectedByNameSelf(nameSelf: string) {
		let searchResult = super.getItptByNameSelf(nameSelf);
		if (searchResult) {
			return searchResult;
		} else {
			return null;
		}
	}
}
