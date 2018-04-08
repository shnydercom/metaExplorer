import { IItptRetriever } from "ldaccess/iinterpreter-retriever";
import ldBlueprint, { IBlueprintItpt, BlueprintConfig } from "ldaccess/ldBlueprint";
import { UserDefDict } from "ldaccess/UserDefDict";

export const DEFAULT_ITPT_RETRIEVER_NAME = "default";

export interface IItptInfoItem {
	canInterpretType: string;
	subItptOf: string;
	nameSelf: string;
	itpt: any;
	crudSkills: string;
	baseType: string;
	additionalTypes: Array<string>;
}

export class DefaultItptRetriever implements IItptRetriever {
	public name = DEFAULT_ITPT_RETRIEVER_NAME;
	private itptCollection: Array<IItptInfoItem> = [];
	private derivedItptMap: Map<string, IItptInfoItem> = new Map();

	constructor(name: string = DEFAULT_ITPT_RETRIEVER_NAME) {
		this.name = name;
	}
	searchForObjItpt(term: string | string[], crudSkills: string) {
		if (term === null) throw new Error("search term undefined");
		if (typeof term === "string") {
			return this.searchSingleObjItpt(term, crudSkills);
		}
		let multipleInterpreters: Array<IBlueprintItpt> = new Array();
		term.forEach((elem) => {
			multipleInterpreters.push(this.searchSingleObjItpt(elem, crudSkills));
		});
		if (multipleInterpreters.length === 0) return null;
		return multipleInterpreters;
	}

	searchForKVItpt(term: string, crudSkills: string) {
		throw new Error("Method not implemented.");
	}
	addItpt(typeName: string, itpt: any, crudSkills: string): void {
		//if the interpreter has a user defined name, add it using that name
		/*if (itpt["cfg"]) {
			let cfg: BlueprintConfig = itpt["cfg"];
			if (cfg.initialKvStores && cfg.initialKvStores.length > 0) {
				for (var i = 0; i < cfg.initialKvStores.length; i++) {
					var itm = cfg.initialKvStores[i];
					if (itm.key === UserDefDict.itptNameKey && itm.value) {
						typeName = itm.value;
						break;
					}
				}
			}
		}*/
		let preExisting: Array<IItptInfoItem> = this.itptCollection.filter(
			(curItm) => curItm.itpt["nameSelf"] === itpt["nameSelf"] && curItm.canInterpretType === typeName);
		if (preExisting && preExisting.length > 0) {
			let preExFirst = preExisting[0];
			crudSkills = this.extendCrudSkills(crudSkills, preExFirst.crudSkills);
			preExFirst.crudSkills = crudSkills;
			return;
		}
		if (itpt["cfg"]) {
			let cfg: BlueprintConfig = itpt["cfg"];
			let newItm: IItptInfoItem = {
				canInterpretType: typeName,
				subItptOf: null,
				nameSelf: cfg.nameSelf,
				itpt: itpt,
				crudSkills: crudSkills,
				baseType: this.getBaseTypeFromType(typeName),
				additionalTypes: this.getAdditionalTypesFromType(typeName)
			};
			this.itptCollection.push(newItm);
		}
	}

	getItptList(): IItptInfoItem[] {
		return this.itptCollection;
	}

	getItptByNameSelf(nameSelf: string) {
		let candidates: IItptInfoItem[] = this.itptCollection.filter(
			(curItm) => curItm.nameSelf === nameSelf);
		if (candidates == null) return null;
		if (candidates.length === 1) return candidates[0].itpt;
		return null;
	}

	setDerivedItpt(ldTokenVal: string, itpt: any): void {
		if (!itpt) {
			this.derivedItptMap.delete(ldTokenVal);
			return;
		}
		this.derivedItptMap.set(ldTokenVal, itpt);
	}
	hasDerivedItpt(ldTokenVal: string): boolean {
		return this.derivedItptMap.has(ldTokenVal);
	}
	getDerivedItpt(ldTokenVal: string) {
		if (this.hasDerivedItpt(ldTokenVal)) {
			return this.derivedItptMap.get(ldTokenVal);
		} else {
			return null;
		}
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

	private searchSingleObjItpt(term: string, crudSkills: string) {
		let searchBaseType: string = this.getBaseTypeFromType(term);
		let searchAdditionalTypes: string[] = this.getAdditionalTypesFromType(term);
		let candidates: IItptInfoItem[] = this.itptCollection.filter(
			(curItm) => curItm.baseType === searchBaseType);
		if (candidates == null) return null;
		if (candidates.length === 1) return candidates[0].itpt;
		let candidatesMatch2 = candidates.filter(
			(curItm) => curItm.crudSkills === crudSkills
		);
		if (candidatesMatch2 !== null || candidatesMatch2.length > 0) candidates = candidatesMatch2;
		if (candidates.length === 1) return candidates[0].itpt;
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
