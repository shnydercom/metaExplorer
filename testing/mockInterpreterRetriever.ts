import {IInterpreterRetriever} from 'ldaccess/iinterpreter-retriever';
export class MockInterpreterRetriever implements IInterpreterRetriever{
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
}
