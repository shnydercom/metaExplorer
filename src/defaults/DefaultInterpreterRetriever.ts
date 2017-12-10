import { IInterpreterRetriever } from "ldaccess/iinterpreter-retriever";
import ldBlueprint, { IBlueprintInterpreter, BlueprintConfig } from "ldaccess/ldBlueprint";
import { UserDefDict } from "ldaccess/UserDefDict";

export interface IInterpreterInfoItem {
	type: string;
	nameSelf: string;
	interpreter: any;
	crudSkills: string;
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
		//if the interpreter has a user defined name, add it using that name
		/*if (intrprtr["cfg"]) {
			let cfg: BlueprintConfig = intrprtr["cfg"];
			if (cfg.initialKvStores && cfg.initialKvStores.length > 0) {
				for (var i = 0; i < cfg.initialKvStores.length; i++) {
					var itm = cfg.initialKvStores[i];
					if (itm.key === UserDefDict.intrprtrNameKey && itm.value) {
						typeName = itm.value;
						break;
					}
				}
			}
		}*/
		let preExisting: Array<IInterpreterInfoItem> = this.interpreterCollection.filter(
			(curItm) => curItm.interpreter["nameSelf"] === intrprtr["nameSelf"] && curItm.type === typeName);
		if (preExisting && preExisting.length > 0) {
			let preExFirst = preExisting[0];
			crudSkills = this.extendCrudSkills(crudSkills, preExFirst.crudSkills);
			preExFirst.crudSkills = crudSkills;
			return;
		}
		if (intrprtr["cfg"]) {
			let cfg: BlueprintConfig = intrprtr["cfg"];
			let newItm: IInterpreterInfoItem = {
				type: typeName,
				nameSelf: cfg.nameSelf,
				interpreter: intrprtr,
				crudSkills: crudSkills,
				baseType: this.getBaseTypeFromType(typeName),
				additionalTypes: this.getAdditionalTypesFromType(typeName)
			};
			this.interpreterCollection.push(newItm);
		}
		//throw new Error("Method not implemented.");
	}

	getInterpreterList(): IInterpreterInfoItem[] {
		return this.interpreterCollection;
		//throw new Error("Method not implemented.");
	}

	getInterpreterByNameSelf(nameSelf: string) {
		let candidates: IInterpreterInfoItem[] = this.interpreterCollection.filter(
			(curItm) => curItm.nameSelf === nameSelf);
		if (candidates == null) return null;
		if (candidates.length === 1) return candidates[0].interpreter;
		return null;
	}

	/**
	 * will combine two crudSkills by choosing the most permissive skills
	 * @param crudSkillsA
	 * @param crudSkillsB
	 */
	private extendCrudSkills(crudSkillsA: string, crudSkillsB: string): string {
		if (crudSkillsA === crudSkillsB) return crudSkillsA;
		let rv: string = "";
		for (var i = 0; i < crudSkillsA.length; i++) {
			let a = crudSkillsA[i];
			let b = crudSkillsB[i];
			rv += a < b ? a : b;
		}
		return rv;
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
		if (candidates.length === 1) return candidates[0].interpreter;
		return null;
		//TODO: perform a mapping against the additionalTypes
	}

	private getBaseTypeFromType(rawType: string): string {
		return rawType;
	}

	private getAdditionalTypesFromType(rawType: string): string[] {
		return null;
	}

}
