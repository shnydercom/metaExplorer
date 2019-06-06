import appItptRetrFn from "appconfig/appItptRetriever";
import { IModStatus, SingleModStateKeysDict } from "appstate/modstate";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";
import { LDDict } from "ldaccess/LDDict";
import { MaterialDesignDateTimeInput, MaterialDesignDateInput, MaterialDesignTextInput, MaterialDesignDoubleInput, MaterialDesignIntInput, MaterialDesignBoolInput } from "./components/BaseDataTypeInput";
import { SectionedListName } from "components/md/content/AbstractSectionedList";
import { SectionedList } from "./components/SectionedList";
import { VisualTypesDict } from "components/visualcomposition/visualDict";
import { CompactInfoListElement } from "./components/CompactInfoListElement";
import { SingleImageSelectorName } from "components/md/content/AbstractSingleImageSelector";
import { SingleImageSelector } from "./components/SingleImageSelector";
import { Card3itptLTRName, PureCard3itptLTR } from "./components/interaction/Card_3itptLTR";
import { MDButton } from "./components/interaction/MDButton";

export const MOD_MATERIALDESIGN_ID = "material-design";
export const MOD_MATERIALDESIGN_NAME = "Material Design Mod";

export function initMaterialDesignMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve, reject) => {
		//register base data type inputs:
		appIntRetr.addItpt(LDDict.Boolean, MaterialDesignBoolInput, "crud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(LDDict.Integer, MaterialDesignIntInput, "CRUd", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(LDDict.Double, MaterialDesignDoubleInput, "CRUd", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(LDDict.Text, MaterialDesignTextInput, "CRUd", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(LDDict.Date, MaterialDesignDateInput, "CRUd", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(LDDict.DateTime, MaterialDesignDateTimeInput, "CRUd", [ITPT_TAG_ATOMIC]);

		//register list-itpts
		appIntRetr.addItpt(SectionedListName, SectionedList, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(VisualTypesDict.compactInfoElement, CompactInfoListElement, "cRud", [ITPT_TAG_ATOMIC]);

		//register Action itpts
		appIntRetr.addItpt(LDDict.Action, MDButton, "cRud", [ITPT_TAG_ATOMIC]);

		appIntRetr.addItpt(SingleImageSelectorName, SingleImageSelector, "cRud", [ITPT_TAG_ATOMIC]);

		//register visual composition itpts.
		appIntRetr.addItpt(NavBarInputContainerName, PureNavBarInputContainer, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(NavBarWActionsName, PureNavBarWActions, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(BottomNavigationName, PureBottomNavigation, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(TopNavigationName, PureTopNavigation, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(NavSearchBarName, PureNavSearchBar, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(NavProcessAtomName, PureNavProcessAtom, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(SimpleTextTableName, PureSimpleTextTable, "cRud", [ITPT_TAG_ATOMIC]);

		appIntRetr.addItpt(Card3itptLTRName, PureCard3itptLTR, "cRud", [ITPT_TAG_ATOMIC]);

		resolve({ id: MOD_MATERIALDESIGN_ID, name: MOD_MATERIALDESIGN_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}
