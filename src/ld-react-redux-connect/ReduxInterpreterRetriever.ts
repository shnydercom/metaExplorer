import { IInterpreterRetriever } from "ldaccess/iinterpreter-retriever";
import { InferableComponentEnhancerWithProps, connect } from "react-redux";
import { DefaultInterpreterRetriever } from "defaults/DefaultInterpreterRetriever";
import { IBlueprintInterpreter, BlueprintConfig } from "ldaccess/ldBlueprint";
import { LDConnectedState, LDConnectedDispatch, LDOwnProps } from "appstate/LDProps";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";

export class ReduxInterpreterRetriever extends DefaultInterpreterRetriever {
	//maps by nameSelf of the interpreter
	private connectedInterpreters: Map<string, any> = new Map();

	searchForObjIntrprtr(term: string | string[], crudSkills: string) {
		let searchResult = super.searchForObjIntrprtr(term, crudSkills) as IBlueprintInterpreter;
		if (searchResult) {
			return this.connectedInterpreters.get(searchResult.cfg.nameSelf);
		}
		return null;
	}
	searchForKVIntrprtr(term: string, crudSkills: string) {
		throw new Error("Method not implemented.");
	}
	addInterpreter(typeName: string, intrprtr: any, crudSkills: string): void {
		super.addInterpreter(typeName, intrprtr, crudSkills);
		let intrprtrAsLDBP: IBlueprintInterpreter = intrprtr;
		let nameSelf = intrprtrAsLDBP.cfg.nameSelf;
		let connIntrprtr = connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(intrprtr);
		this.connectedInterpreters.set(nameSelf, connIntrprtr);
	}
	getInterpreterList(): Array<any> {
		return super.getInterpreterList();
	}
	getInterpreterByNameSelf(nameSelf: string) {
		let searchResult = super.getInterpreterByNameSelf(nameSelf) as IBlueprintInterpreter;
		if (searchResult) {
			return this.connectedInterpreters.get(searchResult.cfg.nameSelf);
		}
		return null;
	}
	getUnconnectedByNameSelf(nameSelf: string) {
		let searchResult = super.getInterpreterByNameSelf(nameSelf);
		if (searchResult) {
			return searchResult;
		} else {
			return null;
		}
	}
}
