import { IItptRetriever } from "../ldaccess/iitpt-retriever";
import { IBlueprintItpt, BlueprintConfig } from "../ldaccess/ldBlueprint";

export const DEFAULT_ITPT_RETRIEVER_NAME = "default";

export interface IItptInfoItem {
	canInterpretType: string;
	subItptOf: string;
	nameSelf: string;
	itpt: any;
	crudSkills: string;
	baseType: string;
	additionalTypes: Array<string>;
	tags: string[];
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
		let multipleItpts: Array<IBlueprintItpt> = new Array();
		term.forEach((elem) => {
			multipleItpts.push(this.searchSingleObjItpt(elem, crudSkills));
		});
		if (multipleItpts.length === 0) return null;
		return multipleItpts;
	}

	searchForKVItpt(term: string, crudSkills: string) {
		throw new Error("Method not implemented.");
	}
	addItpt(typeName: string, itpt: any, crudSkills: string, tags: string[]): void {
		let preExistingIdx = this.itptCollection.findIndex(
			(curItm) => curItm.itpt["nameSelf"] === itpt["nameSelf"] && curItm.canInterpretType === typeName);
		if (itpt["cfg"]) {
			let cfg: BlueprintConfig = itpt["cfg"];
			let newItm: IItptInfoItem = {
				canInterpretType: typeName,
				subItptOf: null,
				nameSelf: cfg.nameSelf,
				itpt: itpt,
				crudSkills: crudSkills,
				baseType: this.getBaseTypeFromType(typeName),
				additionalTypes: this.getAdditionalTypesFromType(typeName),
				tags
			};
			if (preExistingIdx >= 0) {
				this.itptCollection[preExistingIdx] = newItm;
			} else {
				this.itptCollection.push(newItm);
			}
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
	getDerivedItpt(ldTokenVal: string): any {
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
/*	private extendCrudSkills(crudSkillsA: string, crudSkillsB: string): string {
		if (crudSkillsA === crudSkillsB) return crudSkillsA;
		let rv: string = "";
		for (var i = 0; i < crudSkillsA.length; i++) {
			let a = crudSkillsA[i];
			let b = crudSkillsB[i];
			rv += a < b ? a : b;
		}
		return rv;
	}*/

	private searchSingleObjItpt(term: string, crudSkills: string) {
		let searchBaseType: string = this.getBaseTypeFromType(term);
		//let searchAdditionalTypes: string[] = this.getAdditionalTypesFromType(term);
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
