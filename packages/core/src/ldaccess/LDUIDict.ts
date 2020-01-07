export enum LDUIDict {
	/**
	 * table display data type
	 */
	TupleTextTable = "http://ldui.net/TupleTextTable",
	/**
	 * a 1-tuple is a set with only one entry,
	 * equates to a single value in a containing object
	 */
	OneTuple = "http://ldui.net/1-Tuple",
	/**
	 * an n-Tuple is a set with more than one entry,
	 * equates to a POJO with 2 or more attributes.
	 * used as:
	 * - single table row
	 * - single element in a dropdown
	 */
	NTuple = "http://ldui.net/n-Tuple",
	/**
	 * An action for getting a 1-tuple from an n-tuple,
	 * equates to an array[index]-accessor or a map.get(index)-call
	 */
	PickAction = "http://ldui.net/PickAction",
}
export enum LDUIDictVerbs {
/**
	 * (string array)
	 * used as:
	 * - table headings
	 */
	headings = "http://ldui.net/headings",
	/**
	 * (flat object array)
	 * used as:
	 * - table rows
	 * - single select objects
	 */
	tuples = "http://ldui.net/tuples",
	/**
	 * used when describing the src-attribute of an html element
	 */
	htmlSrc = "http://ldui.net/html/src"
}
