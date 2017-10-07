import jasmine from 'jasmine';
import {BlueprintConfig, IBlueprintInterpreter} from 'ldaccess/ldBlueprint';
import ldBlueprint from 'ldaccess/ldBlueprint';
import { MockInterpreterRetriever } from '../testing/mockInterpreterRetriever';
import { ILDOptions } from 'ldaccess/ildoptions';
import { IKvStore } from 'ldaccess/ikvstore';

var testInterpreter = new MockInterpreterRetriever();

let bpCfg: BlueprintConfig = {
    consumeWebResource: (ldOptions: ILDOptions) => {return; },
    forType: "http://shnyder.com/Testtype",
    interpreterRetriever: testInterpreter,
    initialKvStores: null,
    getInterpretableKeys(){return null; },
    crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class LDBlueprintContainerClass implements IBlueprintInterpreter {
    initialKvStores: IKvStore[];
    consumeWebResource: (ldOptions: ILDOptions) => any;
}

describe("ldBlueprint decorator func", () => {
    describe("for a correct LDBlueprintContainerClass object to be constructed...", () => {
        var newLDContainer: LDBlueprintContainerClass = new LDBlueprintContainerClass();
        it("POJO should be created", () => {
            expect(newLDContainer).toBeDefined();
        });
        it("should have a consumeWebResource function", () => {
            expect(newLDContainer.consumeWebResource).toBeDefined();
        });
    });
});
