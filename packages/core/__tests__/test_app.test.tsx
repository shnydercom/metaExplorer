import React from "react";
import { AppRoot } from "../src/index";

describe("approot object test", () => {
	it("should create an approot-object", () => {
		const appRootTestObj = <AppRoot />;
		expect(appRootTestObj !== null);
	}
	);
});
