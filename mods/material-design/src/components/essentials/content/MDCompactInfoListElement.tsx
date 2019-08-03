import {ldBlueprint, VisualKeysDict,  AbstractCompactInfoListElement, CompactInfoListElementCfg } from "@metaexplorer/core";
import { ListItem, ListItemText } from "@material-ui/core";
import React from "react";

@ldBlueprint(CompactInfoListElementCfg)
export class MDCompactInfoListElement extends AbstractCompactInfoListElement {

	render() {
		const { localValues, compInfos } = this.state;
		const leftIconItpt = compInfos.has(VisualKeysDict.primaryItpt) && compInfos.get(VisualKeysDict.primaryItpt)
			? this.renderSub(VisualKeysDict.primaryItpt) : null;
		const rightIconItpt = compInfos.has(VisualKeysDict.secondaryItpt) && compInfos.get(VisualKeysDict.secondaryItpt)
			? this.renderSub(VisualKeysDict.secondaryItpt) : null;
		return <ListItem>
			{leftIconItpt}
			<ListItemText
				primary={localValues.get(VisualKeysDict.headerTxt)}
				secondary={localValues.get(VisualKeysDict.subHeaderTxt)} />
			{rightIconItpt}
		</ListItem>;
	}
}
