import { IInterpreterRetriever } from 'ldaccess/iinterpreter-retriever';
export class MockInterpreterRetriever implements IInterpreterRetriever {
	getInterpreterList(): Array<any> {
		throw new Error("Method not implemented.");
	}
	searchForObjIntrprtr(term: string, crudSkills: string) {
		//throw new Error("Method not implemented.");
	}
	searchForKVIntrprtr(term: string, crudSkills: string) {
		//throw new Error("Method not implemented.");
	}
	addInterpreter(typeName: string, intrprtr: any, crudSkills: string) {
		//throw new Error("Method not implemented.");
		return null;
	}
	getInterpreterByNameSelf(nameSelf: string): any { return null; }
}

export let mockInterpreterRetrieverFn = () => new MockInterpreterRetriever();
//"http://localhost:3000/dist/static/productTestObjs/{identifier}.json",