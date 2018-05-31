import { isValidElement } from "react";

export function isClassComponent(component) {
	return (
		typeof component === 'function' &&
		!!component.prototype.isReactComponent
	) ? true : false;
}

export function isFunctionComponent(component) {
	return (
		typeof component === 'function' &&
		String(component).includes('return React.createElement')
	) ? true : false;
}

export function isReactComponent(component) {
	if (!component) return false;
	return (
		isClassComponent(component) ||
		isFunctionComponent(component) ||
		isCompositeTypeElement(component) ||
		isRouteWrappedComponent(component)
	) ? true : false;
}

export function isRouteWrappedComponent(component) {
	return !!Object.getPrototypeOf(component).WrappedComponent;
}

export function isElement(element) {
	return isValidElement(element);
}

export function isDOMTypeElement(element) {
	return isElement(element) && typeof element.type === 'string';
}

export function isCompositeTypeElement(element) {
	return isElement(element) && typeof element.type === 'function';
}
