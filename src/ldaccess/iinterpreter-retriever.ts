export const ITPT_LINEAR_SPLIT = 'l';
export const ITPT_REFMAP_BASE = "rmb";

export interface IItptRetriever {
    /**
     * the interpreter has a name-attribute so
     * that different ILDOptions-typed objects can use their
     * visualInfo property to choose their own retriever
     */
    name: string;
    /*
     * searches for interpreters that:
     * a) can interpret the 'term' -> rdfs:class or rdfs:property
     * b) offer some or all CRUD functions, as a string in the following format:
     * UPPERCASE for supported functions, lower-case for unsupported functions
     * e.g. crudSkills = 'cRuD' can read and delete, but not create and update
     *
     **/
    searchForObjItpt(term: string | Array<string>, crudSkills: string): any;
    searchForKVItpt(term: string, crudSkills: string): any;
    addItpt(typeName: string, itpt: any, crudSkills: string): void;
    getItptList(): Array<any>;
    getItptByNameSelf(nameSelf: string): any;

    /**
     * sets an interpreter that is derived from other existing interpreters,
     * for a specific ldTokenVal (which are unique).
     * Derived Interpreters will not be used for automatic matching, they're
     * used for sub-Interpreters in ReferenceMaps e.g.
     * @param ldTokenVal the ldTokenValue as found in the application's state
     * @param itpt the interpreter function or class
     */
    setDerivedItpt(ldTokenVal: string, itpt: any): void;
    /**
     * checks whether an interpreter exists for this ldTokenVal
     * @param ldTokenVal the ldTokenValue as found in the application's state
     */
    hasDerivedItpt(ldTokenVal: string): boolean;
    /**
     * retrieves the interpreter for this ldTokenVal, if it exists
     * @param ldTokenVal the ldTokenValue as found in the application's state
     * @returns the interpreter or null
     */
    getDerivedItpt(ldTokenVal: string): any;
}
