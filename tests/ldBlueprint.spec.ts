import jasmine from 'jasmine';
import {BlueprintConfig, IBlueprintInterpreter} from 'ldaccess/ldBlueprint';
import ldBlueprint from 'ldaccess/ldBlueprint';
import { mockInterpreterRetrieverFn } from '../testing/mockInterpreterRetriever';
import { ILDOptions } from 'ldaccess/ildoptions';
import { IKvStore } from 'ldaccess/ikvstore';

var testInterpreter = mockInterpreterRetrieverFn;

let bpCfg: BlueprintConfig = {
    //TODO: property forType needs to be renamed, maybe split up into multiple properties. I need a clear
    //conflicting use case to tackle the whole problem space though (e.g. schema:ViewAction vs. schema:image).
    //Needs to be re-designed with crud-skills in mind though. Clear separation of concerns and DRY should
    //be applicable to the end result
    forType: "http://shnyder.com/Testtype",
    nameSelf: "shnyder/testTypeInterpreter",
    interpreterRetrieverFn: testInterpreter,
    initialKvStores: null,
    interpretableKeys: null,
    crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class LDBlueprintContainerClass implements IBlueprintInterpreter {
    cfg: BlueprintConfig;
    consumeLDOptions: (ldOptions: ILDOptions) => any;
    initialKvStores: IKvStore[];
}

describe("ldBlueprint decorator func", () => {
    describe("for a correct LDBlueprintContainerClass object to be constructed...", () => {
        var newLDContainer: LDBlueprintContainerClass = new LDBlueprintContainerClass();
        it("POJO should be created", () => {
            expect(newLDContainer).toBeDefined();
        });
        it("should have a consumeWebResource function", () => {
            expect(newLDContainer.consumeLDOptions).toBeDefined();
        });
    });
});
