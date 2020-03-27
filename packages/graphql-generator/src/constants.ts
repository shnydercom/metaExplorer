export const ikvFragment = (key: string, value: string, ldType: string) => `{
	key: "${key}",
	value: ${value},
	ldType: ${ldType}
}`;

export const INITIAL_KV_STORES = 'initialKvStores';
export const INTERPRETABLE_KEYS = 'interpretableKeys';

/**
 * wraps the three parameters in a function that is used to resolve a triplet of subject, verb and object
 * @param subject the subject
 * @param verb the verb
 * @param object the object
 */
export const wrapInSPOfunction = (subject: string, verb: string, object: string) => `createLDUINSUrl(${subject}, ${verb}, ${object})`;
