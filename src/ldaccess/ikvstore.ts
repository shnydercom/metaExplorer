import { LDDict, LDDictWildCard } from "ldaccess/LDDict";

export interface IKvStore {
    key: LDDictWildCard;
    value: any;
    ldType: LDDictWildCard;
    intrprtrClass?: any;
}
