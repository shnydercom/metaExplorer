import {IInterpreterRetriever} from './iinterpreter-retriever'
import {IKvStore} from './ikvstore'

export interface BlueprintConfig {
    consumeWebResource(),
    forType:string,
    interpreterRetriever:IInterpreterRetriever,
    kvStores:IKvStore[],
    getInterpretableKeys():any[]
}

function blueprintDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
        newProperty = "new property";
        hello = "override";
    }
}

export default function ldBlueprint(blueprintCfg : BlueprintConfig){
    return function(target){
        blueprintDecorator(target);
    }
}