//import jasmine from 'jasmine';
import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../src/ldaccess/ldBlueprint';
import { ILDOptions } from '../src/ldaccess/ildoptions';
import { KVL } from '../src/ldaccess/KVL';

let bpCfg: BlueprintConfig = {
    //TODO: property forType needs to be renamed, maybe split up into multiple properties. I need a clear
    //conflicting use case to tackle the whole problem space though (e.g. schema:ViewAction vs. schema:image).
    //Needs to be re-designed with crud-skills in mind though. Clear separation of concerns and DRY should
    //be applicable to the end result
    subItptOf: null,
    canInterpretType: "http://metaexplorer.io/Testtype",
    nameSelf: "metaexplorer.io/testTypeInterpreter",
    ownKVLs: [],
    inKeys: [],
    crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class LDBlueprintContainerClass implements IBlueprintItpt {
    cfg: BlueprintConfig;
    outputKVMap: OutputKVMap;
    consumeLDOptions: (ldOptions: ILDOptions) => any;
    ownKVLs: KVL[];
}

describe("ldBlueprint decorator func", () => {

    //const wrappedContainerClass = ldBlueprint(bpCfg);
    //const wrapped2 = wrappedContainerClass(LDBlueprintContainerClass);
    describe("for a correct LDBlueprintContainerClass object to be constructed...", () => {
        var newLDContainer: LDBlueprintContainerClass = new LDBlueprintContainerClass();
        //var newLDContainer = bpCfg;
        //var dir: PureImgDisplay = new PureImgDisplay({});
        it("POJO should be created", () => {
            expect(newLDContainer).toBeDefined();
            //  expect(dir).toBeDefined();
        });
        /* it("should have a consumeWebResource function", () => {
             expect(newLDContainer.consumeLDOptions).toBeDefined();
         });*/
    });
});
