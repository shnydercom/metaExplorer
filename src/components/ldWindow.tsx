import ldBlueprint from 'ldaccess/ldBlueprint'
@ldBlueprint({
    consumeWebResource(){},
    forType:"test",
    interpreterRetriever:null,
    kvStores:null,
    getInterpretableKeys(){return null}
})
export class LDWindow {

}