import { IItptRetriever } from 'ldaccess/iitpt-retriever';
export class MockItptRetriever implements IItptRetriever {
	name: string;
	setDerivedItpt(ldTokenVal: string, itpt: any): void {
		throw new Error("Method not implemented.");
	}
	hasDerivedItpt(ldTokenVal: string): boolean {
		throw new Error("Method not implemented.");
	}
	getDerivedItpt(ldTokenVal: string) {
		throw new Error("Method not implemented.");
	}
	getItptList(): Array<any> {
		throw new Error("Method not implemented.");
	}
	searchForObjItpt(term: string, crudSkills: string) {
		//throw new Error("Method not implemented.");
	}
	searchForKVItpt(term: string, crudSkills: string) {
		//throw new Error("Method not implemented.");
	}
	addItpt(typeName: string, intrprtr: any, crudSkills: string) {
		//throw new Error("Method not implemented.");
		return null;
	}
	getItptByNameSelf(nameSelf: string): any { return null; }
}

export let mockItptRetrieverFn = () => new MockItptRetriever();
//"http://localhost:5000/static/productTestObjs/{identifier}.json",