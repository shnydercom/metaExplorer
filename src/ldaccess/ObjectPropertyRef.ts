/**
 * flat nesting isn't possible with DAG-like data structures, that's why we need to be able to reference objects and properties in a different way
 */
export interface ObjectPropertyRef {
	objRef: string;
	propRef: string;
}
