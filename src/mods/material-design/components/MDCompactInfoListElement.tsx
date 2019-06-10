import { AbstractCompactInfoListElement, CompactInfoListElementCfg } from "components/md/content/AbstractCompactInfoListElement";
import { VisualKeysDict } from "components/visualcomposition/visualDict";
import ldBlueprint from "ldaccess/ldBlueprint";

@ldBlueprint(CompactInfoListElementCfg)
export class MDCompactInfoListElement extends AbstractCompactInfoListElement {

	render() {
		const { localValues, compInfos } = this.state;
		const leftIconItpt = compInfos.has(VisualKeysDict.primaryItpt) && compInfos.get(VisualKeysDict.primaryItpt)
			? this.renderSub(VisualKeysDict.primaryItpt) : null;
		const rightIconItpt = compInfos.has(VisualKeysDict.secondaryItpt) && compInfos.get(VisualKeysDict.secondaryItpt)
			? this.renderSub(VisualKeysDict.secondaryItpt) : null;
		return <div>CompactInfoListElement</div>;
		/*
		return <ListItem leftIcon={leftIconItpt}
			rightIcon={rightIconItpt}
			caption={localValues.get(VisualKeysDict.headerTxt)}
			legend={localValues.get(VisualKeysDict.subHeaderTxt)} />;
	*/
		}
}
