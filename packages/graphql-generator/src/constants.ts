export const ikvFragment = (key: string, value: string, ldType: string) => `{
	key: "${key}",
	value: ${value},
	ldType: ${ldType}
}`;

export const INITIAL_KV_STORES = 'initialKvStores';
