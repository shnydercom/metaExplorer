import { LDDictWildCard } from "ldaccess/LDDict";

export interface IKvStore {
    key: LDDictWildCard;
    value: any; //TODO: check, if this can be typed. Candidates would be IKvStore || IKvStore[] || ObjectPropertyRef || ObjectPropertyRef[]
    ldType: LDDictWildCard;
    //intrprtrClass?: any; //REWRITE: remove
}
