import { IKvStore } from 'ldaccess/ikvstore';
import { LDError } from 'appstate/LDError';
import { ILDOptions } from 'ldaccess/ildoptions';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { ObjectPropertyRef } from 'ldaccess/ObjectPropertyRef';
import { InferableComponentEnhancerWithProps } from 'react-redux';
import { LDDictWildCard } from 'ldaccess/LDDict';
import { ILDToken } from 'ldaccess/ildtoken';

export type ConsumeLDOptionsFunc = (ldOptions: ILDOptions) => any;

export type OutputKVMapElement = {targetLDToken: ILDToken, targetProperty: string};
/**
 * maps the kvStores that produce/change values in this interpreter to a token string and a target property
 * on the object that is referenced by the token string
 * e.g. { "http://schema.com/name": {targetLDToken: "someUID", targetProperty: "someTextField"}}
 */
export type OutputKVMap = { [key: string]: OutputKVMapElement};

export interface IBlueprintItpt {
    cfg: BlueprintConfig;
    consumeLDOptions: ConsumeLDOptionsFunc;
    initialKvStores: IKvStore[];
}

/**
 * initialKvStores will be overriden if defined in config.
 * The order of initialKvStores and getInterpretableKeys is important, especially for
 * visual components, e.g.: display image as header, then text as heading, text as subheading, then text as description
 */
export interface BlueprintConfig {
    subItptOf: string;
    canInterpretType?: string;
    nameSelf: string;
    initialKvStores?: IKvStore[];
    crudSkills: string;
    interpretableKeys: (string | ObjectPropertyRef)[];
}

function blueprintDecorator<T extends { new(...args: any[]): IBlueprintItpt }>(constructorFn: T, blueprintCfg: BlueprintConfig) {
    var classToExtend = null;
    //var reduxClass = null;
    /*if (constructorFn["WrappedComponent"]) {
        classToExtend = constructorFn["WrappedComponent"];
        reduxClass = constructorFn;
    }*/
    //console.log("isWrapped");
    classToExtend = class extends constructorFn {
        static nameSelf = blueprintCfg.nameSelf;
        static cfg = blueprintCfg;
        initialKvStores = blueprintCfg.initialKvStores ? blueprintCfg.initialKvStores : this.initialKvStores;
        //consumeWebResource = blueprintCfg.consumeWebResource;
        //interpreterRetriever = blueprintCfg.interpreterRetrieverFn;
        interpretableKeys = blueprintCfg.interpretableKeys;
    };
    /*if (reduxClass) {
        reduxClass["WrappedComponent"] = classToExtend;
        return reduxClass;
    } else {*/
    return classToExtend;
    //}
    //blueprintCfg.interpreterRetrieverFn().addInterpreter(blueprintCfg.forType, newClass, blueprintCfg.crudSkills);
}

export default function ldBlueprint(blueprintCfg: BlueprintConfig) {
    //eval phase
    if (blueprintCfg == null) throw new LDError("blueprintCfg must not be null");
    if (blueprintCfg.nameSelf == null) throw new LDError("blueprintCfg.nameSelf must not be null");
    if (blueprintCfg.canInterpretType == null) {
        //autmatically generate an interpreter-specific Instance type
        blueprintCfg.canInterpretType = blueprintCfg.nameSelf + UserDefDict.standardInterpreterObjectTypeSuffix;
    }
    //if (blueprintCfg.interpreterRetrieverFn == null) throw new LDError("blueprintCfg.interpreterRetriever must not be null");
    if (blueprintCfg.crudSkills == null) throw new LDError("blueprintCfg.crudSkills must not be null");
    if (blueprintCfg.interpretableKeys == null) throw new LDError("blueprintCfg.interpretableKeys must not be null");
    //if (blueprintCfg.consumeWebResource == null) throw new LDError("blueprintCfg.consumeWebResource must not be null");
    return <T extends { new(...args: any[]): IBlueprintItpt }>(target: T) => {
        return blueprintDecorator(target, blueprintCfg);
    };
}
