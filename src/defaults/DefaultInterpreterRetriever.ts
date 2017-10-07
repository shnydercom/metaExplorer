import { IInterpreterRetriever } from "ldaccess/iinterpreter-retriever";

interface IInterpreterInfoItem {
	type: string;
	interpreter: any;
	crudSkills: any;
	baseType: string;
	additionalTypes: Array<string>;
}

export class DefaultInterpreterRetriever implements IInterpreterRetriever{
	private interpreterCollection: Array<IInterpreterInfoItem> = [];

	searchForObjIntrprtr(term: string, crudSkills: string) {
		let searchBaseType: string = this.getBaseTypeFromType(term);
		let searchAdditionalTypes: string[] = this.getAdditionalTypesFromType(term);
		let candidates: IInterpreterInfoItem[] = this.interpreterCollection.filter(
			(curItm) => curItm.baseType === searchBaseType);
		if (candidates !== null && candidates.length === 1) return candidates[0].interpreter;
		return null;
		//TODO: perform a mapping against the additionalTypes
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

	private getBaseTypeFromType(rawType: string): string{
		return rawType;
	}

	private getAdditionalTypesFromType(rawType: string): string[]{
		return null;
	}

}
