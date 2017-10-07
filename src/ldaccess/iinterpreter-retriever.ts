export interface IInterpreterRetriever {
    /*
     * searches for interpreters that:
     * a) can interpret the 'term' -> rdfs:class or rdfs:property
     * b) offer some or all CRUD functions, as a string in the following format:
     * UPPERCASE for supported functions, lower-case for unsupported functions
     * e.g. crudSkills = 'cRuD' can read and delete, but not create and update
     *
     **/
    searchForObjIntrprtr(term: string, crudSkills: string): any;
    searchForKVIntrprtr(term: string, crudSkills: string): any;
    addInterpreter(typeName: string, intrprtr: any, crudSkills: string): void;
}
