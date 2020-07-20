import { UserDefDict, LDUIDict } from '@metaexplorer/core';

export const ikvFragment = (key: string, value: string, ldType: string) => `{
	key: "${key}",
	value: ${value},
	ldType: ${ldType}
}`;

export const OUTPUT_KV_FRAGMENT = ikvFragment(UserDefDict.outputData, undefined, 'LDUIDict.GQLQueryVars');

export const INITIAL_KV_STORES = 'ownKVLs';
export const INTERPRETABLE_KEYS = 'inKeys';
export const NAME_SELF = 'nameSelf';
export const SUBITPTOF = 'subItptOf';
export const BLUEPRINT_CFG_FRAGMENT = 'BlueprintConfigFragment';
export const CRUD_SKILLS = 'crudSkills';
export const CAN_INTERPRET_TYPE = 'canInterpretType';

/**
 * wraps the three parameters in a function that is used to resolve a triple of subject, verb and object
 * @param subject the subject
 * @param verb the verb
 * @param object the object
 */
export const wrapInSPOfunction = (subject: string, verb: string, object: string) => `createTriple(${subject}, ${verb}, ${object})`;
