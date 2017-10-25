import { IInterpreterRetriever } from './iinterpreter-retriever';
import { IKvStore } from './ikvstore';
import { LDError } from 'appstate/LDError';
import { ILDOptions } from './ildoptions';

export type ConsumeLDOptionsFunc = (ldOptions: ILDOptions) => any;

export interface IBlueprintInterpreter {
    consumeLDOptions: ConsumeLDOptionsFunc;
    initialKvStores: IKvStore[];
}

/**
 * initialKvStores will be overriden if defined in config
 */
export interface BlueprintConfig {
    forType: string;
    nameSelf: string;
    interpreterRetrieverFn: () => IInterpreterRetriever;
    initialKvStores?: IKvStore[];
    crudSkills: string;
    //consumeWebResource?: ConsumeWebResourceFunc;
    getInterpretableKeys(): any[];
}

function blueprintDecorator<T extends { new(...args: any[]): IBlueprintInterpreter }>(constructor: T, blueprintCfg: BlueprintConfig) {
    var newClass = class extends constructor {
        static forType = blueprintCfg.forType;
        static nameSelf = blueprintCfg.nameSelf;
        initialKvStores = blueprintCfg.initialKvStores ? blueprintCfg.initialKvStores : this.initialKvStores;
        //consumeWebResource = blueprintCfg.consumeWebResource;
        interpreterRetriever = blueprintCfg.interpreterRetrieverFn;
        getInterpretableKeys = blueprintCfg.getInterpretableKeys;
    };
    blueprintCfg.interpreterRetrieverFn().addInterpreter(blueprintCfg.forType, newClass, blueprintCfg.crudSkills);
    return newClass;
}

export default function ldBlueprint(blueprintCfg: BlueprintConfig) {
    //eval phase
    if (blueprintCfg == null) throw new LDError("blueprintCfg must not be null");
    if (blueprintCfg.forType == null) throw new LDError("blueprintCfg.forType must not be null");
    if (blueprintCfg.nameSelf == null) throw new LDError("blueprintCfg.nameSelf must not be null");
    if (blueprintCfg.interpreterRetrieverFn == null) throw new LDError("blueprintCfg.interpreterRetriever must not be null");
    if (blueprintCfg.crudSkills == null) throw new LDError("blueprintCfg.crudSkills must not be null");
    if (blueprintCfg.getInterpretableKeys == null) throw new LDError("blueprintCfg.getInterpretableKeys must not be null");
    //if (blueprintCfg.consumeWebResource == null) throw new LDError("blueprintCfg.consumeWebResource must not be null");
    return <T extends { new(...args: any[]): IBlueprintInterpreter }>(target: T) => {
        return blueprintDecorator(target, blueprintCfg);
    };
}
