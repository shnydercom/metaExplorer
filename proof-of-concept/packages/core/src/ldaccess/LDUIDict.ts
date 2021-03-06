export enum LDUIDict {
	/**
	 * table display data type
	 */
	TupleTextTable = "http://ldui.net/TupleTextTable",
	/**
	 * a 1-tuple is a set with only one entry,
	 * equates to a single value in a containing object
	 */
	OneTuple = "http://ldui.net/1Tuple",
	/**
	 * an n-Tuple is a set with more than one entry,
	 * equates to a POJO with 2 or more attributes.
	 * used as:
	 * - single table row
	 * - single element in a dropdown
	 */
	NTuple = "http://ldui.net/NTuple",
	/**
	 * An action for getting a 1-tuple from an n-tuple,
	 * equates to an array[index]-accessor or a map.get(index)-call
	 */
	PickAction = "http://ldui.net/PickAction",
	/**
	 * query variables in GraphQL can only contain input types and scalars,
	 * so they need special handling
	 */
	GQLQueryVars = "http://ldui.net/GQLQueryVariables",
	GQLQueryType = "http://ldui.net/GQLQuery",
	/**
	 * from declarative to functional: such a component will assemble data from
	 * disparate data
	 */
	DataTypeAssembler = "http://ldui.net/DataTypeAssembler",

	/**
	 * the graphical control element "button", although the appearance can change a lot the
	 * functionality of buttons hasn't really changed
	 */
	Button = "http://ldui.net/interaction/Button",
	Top = "http://ldui.net/layout/Top",
	Right = "http://ldui.net/layout/Right",
	Bottom = "http://ldui.net/layout/Bottom",
	Left = "http://ldui.net/layout/Left",
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
	htmlSrc = "http://ldui.net/html/src",
	/**
	 * used to mark a field required. Default behaviour is "not required"
	 */
	required = "http://ldui.net/required",
	/**
	 * predicate to indicate the type of a subject. We use a namespace of ldui.net for this
	 * general capability to be able to narrow down the maximum supported version of types
	 * (because "type" can mean a lot of different things in different programming languages)
	 */
	typed = "http://ldui.net/typed",
	/**
	 * indicates whether a visual component or part of it is open.
	 * e.g. for panels, drawers, parts of a treeview etc
	 */
	isOpen = "http://ldui.net/isOpen",
	/**
	 * used for visual constraints, i.e. side sheets opening up from, slide in animations etc.
	 */
	anchor = "http://ldui.net/anchor",
	/**
	 * used to determine whether a UI element should be exclusive (modal)
	 */
	isModal = "http://ldui.net/isModal",
}
