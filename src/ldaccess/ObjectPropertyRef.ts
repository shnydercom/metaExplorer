/**
 * flat nesting isn't possible with DAG-like data structures, that's why we need to be able to reference objects and properties in a different way
 */
export interface ObjectPropertyRef {
	objRef: string;
	propRef: string;
}

export var OBJECT_REF: string = "objRef";
export var OBJECT_PROP_REF: string = "propRef";
//TODO: check, if this can be handled more elegantly. Interfaces are not available after compile-time
