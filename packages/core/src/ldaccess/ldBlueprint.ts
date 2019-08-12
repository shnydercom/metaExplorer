import { IKvStore } from './ikvstore';
import { LDError } from '../appstate/LDError';
import { ILDOptions } from './ildoptions';
import { UserDefDict } from './UserDefDict';
import { ObjectPropertyRef } from './ObjectPropertyRef';
import { ILDToken } from './ildtoken';

export type ConsumeLDOptionsFunc = (ldOptions: ILDOptions) => any;

export type OutputKVMapElement = { targetLDToken: ILDToken, targetProperty: string };
/**
 * maps the kvStores that produce/change values in this itpt to a token string and a target property
 * on the object that is referenced by the token string
 * e.g. { "http://schema.com/name": {targetLDToken: "someUID", targetProperty: "someTextField"}}
 */
export type OutputKVMap = { [key: string]: OutputKVMapElement[] };

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

function handleKVInheritance(baseClassKV: IKvStore[], subClassKV: IKvStore[], isReplace: boolean): IKvStore[] {
    let rv: IKvStore[] = [];
    if (isReplace) {
        rv = subClassKV ? subClassKV : baseClassKV;
    } else {
        if (!baseClassKV) {
            rv = subClassKV;
        } else {
            let baseCopy = baseClassKV.slice();
            subClassKV.forEach((kv, idx, arr) => {
                let findIdx = baseCopy.findIndex((findKv) => findKv.key === kv.key);
                rv.push(kv);
                if (findIdx >= 0) {
                    baseCopy.splice(findIdx, 1);
                }
            });
            rv.push(...baseCopy);
        }
    }
    return rv;
}

// tslint:disable-next-line:callable-types
function blueprintDecorator<T extends { new(...args: any[]): IBlueprintItpt }>(constructorFn: T, blueprintCfg: BlueprintConfig, replaceKVs: boolean = false) {
    var classToExtend = null;
    if (typeof constructorFn !== 'function') throw new LDError("blueprint was not decorated on a function, but on: " + constructorFn);
    classToExtend = class extends constructorFn {
        static nameSelf = blueprintCfg.nameSelf;
        static cfg = blueprintCfg;
        initialKvStores = this["initialKvStores"]
            ? handleKVInheritance(this["initialKvStores"], blueprintCfg.initialKvStores, replaceKVs)
            : blueprintCfg.initialKvStores;
        interpretableKeys = blueprintCfg.interpretableKeys;
    };
    return classToExtend;
}

export const ldBlueprint = (blueprintCfg: BlueprintConfig, replaceKVs: boolean = false) => {
    //eval phase
    if (blueprintCfg == null) throw new LDError("blueprintCfg must not be null");
    if (blueprintCfg.nameSelf == null) throw new LDError("blueprintCfg.nameSelf must not be null");
    if (blueprintCfg.canInterpretType == null) {
        //autmatically generate an itpt-specific Instance type
        blueprintCfg.canInterpretType = blueprintCfg.nameSelf + UserDefDict.standardItptObjectTypeSuffix;
    }
    if (blueprintCfg.crudSkills == null) throw new LDError("blueprintCfg.crudSkills must not be null");
    if (blueprintCfg.interpretableKeys == null) throw new LDError("blueprintCfg.interpretableKeys must not be null");
    // tslint:disable-next-line:callable-types
    return <T extends { new(...args: any[]): IBlueprintItpt }>(target: T) => {
        return blueprintDecorator(target, blueprintCfg, replaceKVs);
    };
};
