import { LDDictWildCard } from "./LDDict";

/**
 * previously IKVStore, now KeyValueLinkeddatatype
 */
export interface KVL {
    key: LDDictWildCard;
    value: any; //TODO: check, if this can be typed. Candidates would be KVL || KVL[] || ObjectPropertyRef || ObjectPropertyRef[]
    ldType: LDDictWildCard;
}
