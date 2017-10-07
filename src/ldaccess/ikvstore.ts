import { LDDict } from "ldaccess/LDDict";

export interface IKvStore {
    key: LDDict;
    value: any;
    ldType: LDDict;
    intrprtrClass?: any;
}
