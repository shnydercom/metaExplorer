import { IInterpreterRetriever } from "ldaccess/iinterpreter-retriever";
import { IBlueprintInterpreter } from "ldaccess/ldBlueprint";

interface IInterpreterInfoItem {
	type: string;
	interpreter: any;
	crudSkills: any;
	baseType: string;
	additionalTypes: Array<string>;
}

export class DefaultInterpreterRetriever implements IInterpreterRetriever {
	private interpreterCollection: Array<IInterpreterInfoItem> = [];

	searchForObjIntrprtr(term: string | string[], crudSkills: string) {
		if (term === null) throw new Error("search term undefined");
		if (typeof term === "string") {
			return this.searchSingleObjInterpreter(term, crudSkills);
		}
		let multipleInterpreters: Array<IBlueprintInterpreter> = new Array();
		term.forEach((elem) => {
			multipleInterpreters.push(this.searchSingleObjInterpreter(elem, crudSkills));
		});
		if (multipleInterpreters.length === 0) return null;
		return multipleInterpreters;
	}

	searchForKVIntrprtr(term: string, crudSkills: string) {
		throw new Error("Method not implemented.");
	}
	addInterpreter(typeName: string, intrprtr: any, crudSkills: string): void {
		let newItm: IInterpreterInfoItem = {
			type: typeName,
			interpreter: intrprtr,
			crudSkills: crudSkills,
			baseType: this.getBaseTypeFromType(typeName),
			additionalTypes: this.getAdditionalTypesFromType(typeName)
		};
		this.interpreterCollection.push(newItm);
		//throw new Error("Method not implemented.");
	}

	private searchSingleObjInterpreter(term: string, crudSkills: string) {
		let searchBaseType: string = this.getBaseTypeFromType(term);
		let searchAdditionalTypes: string[] = this.getAdditionalTypesFromType(term);
		let candidates: IInterpreterInfoItem[] = this.interpreterCollection.filter(
			(curItm) => curItm.baseType === searchBaseType);
		if (candidates == null) return null;
		if (candidates.length === 1) return candidates[0].interpreter;
		let candidatesMatch2 = candidates.filter(
			(curItm) => curItm.crudSkills === crudSkills
		);
		if (candidatesMatch2 !== null || candidatesMatch2.length > 0) candidates = candidatesMatch2;
		return candidates[0].interpreter;
		//TODO: perform a mapping against the additionalTypes
	}

	private getBaseTypeFromType(rawType: string): string {
		return rawType;
	}

	private getAdditionalTypesFromType(rawType: string): string[] {
		return null;
	}

}
