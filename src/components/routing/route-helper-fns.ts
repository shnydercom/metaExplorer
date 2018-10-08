import { LDRouteProps } from "appstate/LDProps";

export function cleanRouteString(destination: string, routes: LDRouteProps) {
	const { match, location } = routes;
	let route: string = destination;
	if (route.startsWith("/")) {//i.e attach to path/create sub-path
		route = route.substring(1);
		route = match.url.endsWith("/") ? match.url + route : `${match.url}/${route}`;
	} else {
		route = match.url.substr(0, match.url.lastIndexOf("/") + 1) + route;
	}
	let routeParts: string[] = route.split('/');
	let newRouteParts: string[] = [];
	for (let i = 0; i < routeParts.length; i++) {
		const element = routeParts[i];
		if ((i < routeParts.length - 1 && routeParts[i + 1] !== '..' && element !== '..') || i === routeParts.length - 1) {
			newRouteParts.push(element);
		}
	}
	route = newRouteParts.join('/');
	return route;
}