export enum ActionKeysDict {
	/**
	 * for Actions like button clicks, NavProcessAtom-confirms etc.
	 */
	action_confirm = "Action_Confirm",
	/**
	 * the act of selecting an item, e.g. from a list
	 */
	action_select = "Action_Select",
	/**
	 * kvStore with this key will be pushed to a registered ActionHandler
	 */
	action_internal = "Action_internal",
	/**
	 * when a Route is matched
	 */
	action_onRoute = "Action_onRoute",
	/**
	 * for the handler to declare it can handle a type
	 */
	canHandleType = "canHandleType",
	/**
	 * for the handler to declare it can handle an id
	 */
	canHandleId = "canHandleId",
	/**
	 * for actions that trigger saving or somehow costly functions
	 */
	action_save = "Action_Save",
	/**
	 * for actions that open (side drawers, folder structures, panels etc)
	 */
	action_open = "Action_Open",
	/**
	 * for actions that close (side drawers, folder structures, panels etc)
	 */
	action_close = "Action_Close",

	action_visibility_change = "Action_VisibilityChange",

	/**
	 * a key on a component that dispatches actions,
	 * after triggering will dispatch the action
	 */
	trigger = "action-trigger"
}

export enum ActionTypesDict {
	/**
	 * an Action inside the frontend, not to be confused with http://schema.org/Action
	 */
	metaExplorerAction = "MetaExplorerAction",
}

export interface ActionType {
	ldId: string;
	ldType: string;
	payload: any;
}
