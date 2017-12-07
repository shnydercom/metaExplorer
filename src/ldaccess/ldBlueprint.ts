import { IInterpreterRetriever } from 'ldaccess/iinterpreter-retriever';
import { IKvStore } from 'ldaccess/ikvstore';
import { LDError } from 'appstate/LDError';
import { ILDOptions } from 'ldaccess/ildoptions';

export type ConsumeLDOptionsFunc = (ldOptions: ILDOptions) => any;

export interface IBlueprintInterpreter {
    cfg: BlueprintConfig;
    consumeLDOptions: ConsumeLDOptionsFunc;
    initialKvStores: IKvStore[];
    //getInterpretableKeys: () => any[];
}

/**
 * initialKvStores will be overriden if defined in config.
 * The order of initialKvStores and getInterpretableKeys is important, especially for
 * visual components, e.g.: display image as header, then text as heading, text as subheading, then text as description
 */
export interface BlueprintConfig {
    forType: string;
    nameSelf: string;
    //interpreterRetrieverFn: () => IInterpreterRetriever;
    initialKvStores?: IKvStore[];
    crudSkills: string;
    //consumeWebResource?: ConsumeWebResourceFunc;
    interpretableKeys: string[];
}

function blueprintDecorator<T extends { new(...args: any[]): IBlueprintInterpreter }>(constructor: T, blueprintCfg: BlueprintConfig) {
    var newClass = class extends constructor {
        static cfg = blueprintCfg;
        static nameSelf = blueprintCfg.nameSelf;
        initialKvStores = blueprintCfg.initialKvStores ? blueprintCfg.initialKvStores : this.initialKvStores;
        //consumeWebResource = blueprintCfg.consumeWebResource;
        //interpreterRetriever = blueprintCfg.interpreterRetrieverFn;
        interpretableKeys = blueprintCfg.interpretableKeys;
    };
    //blueprintCfg.interpreterRetrieverFn().addInterpreter(blueprintCfg.forType, newClass, blueprintCfg.crudSkills);
    return newClass;
}

export default function ldBlueprint(blueprintCfg: BlueprintConfig) {
    //eval phase
    if (blueprintCfg == null) throw new LDError("blueprintCfg must not be null");
    if (blueprintCfg.forType == null) throw new LDError("blueprintCfg.forType must not be null");
    if (blueprintCfg.nameSelf == null) throw new LDError("blueprintCfg.nameSelf must not be null");
    //if (blueprintCfg.interpreterRetrieverFn == null) throw new LDError("blueprintCfg.interpreterRetriever must not be null");
    if (blueprintCfg.crudSkills == null) throw new LDError("blueprintCfg.crudSkills must not be null");
    if (blueprintCfg.interpretableKeys == null) throw new LDError("blueprintCfg.interpretableKeys must not be null");
    //if (blueprintCfg.consumeWebResource == null) throw new LDError("blueprintCfg.consumeWebResource must not be null");
    return <T extends { new(...args: any[]): IBlueprintInterpreter }>(target: T) => {
        return blueprintDecorator(target, blueprintCfg);
    };
}
