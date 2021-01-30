import React, { useRef } from "react";
import useIntersectionObserver from "./intersector-hook";

export const DividerHR = () => {
	const hrRef = useRef<HTMLHRElement | null>(null);
	const [isVisible, entry] = useIntersectionObserver({
		elementRef: hrRef,
	});
    console.log(isVisible);
	console.log(entry);
	return <hr ref={hrRef} />;
};
