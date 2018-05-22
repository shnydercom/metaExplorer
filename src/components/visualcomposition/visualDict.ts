export enum VisualDict {
	//Base data types:
	headerItpt = "HeaderInterpreter",
	headerTxt = "HeaderText",
	subHeaderTxt = "SubHeaderText",
	description = "Description",
	freeContainer = "freeContainer", //e.g. for the bottomNavigation anything that is "top"

	//other
	footerItpt = "FooterInterpreter",
	popOverContent = "PopOverContent",
	iconImg = "IconImage",

	//Router-related Types
	route_added = "Route_Added",
	route_new = "Route_New",
	route_popLast = "Route_PopLast", //for back-navigation

	//NavigationElement-keys
	routeSend_search = "RouteSend_Search",
	routeSend_back = "RouteSend_Back",
	searchText = "searchText"

}
