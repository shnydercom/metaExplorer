import jasmine from 'jasmine';
import {LDWindow} from 'components/ldWindow';

describe("ldWindow", () => {
    it("new LDWindow object gets constructed", () => {
        var newLDWindow = new LDWindow();
        expect(newLDWindow).toBeDefined();
        //expect(newLDWindow["hello"]).toBeDefined();
    });
});
