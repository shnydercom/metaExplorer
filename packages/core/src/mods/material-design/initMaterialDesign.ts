import appItptRetrFn from "appconfig/appItptRetriever";
import { IModStatus, SingleModStateKeysDict } from "appstate/modstate";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";
import { LDDict } from "ldaccess/LDDict";
import { MDDateTimeInput, MDDateInput, MDTextInput, MDDoubleInput, MDIntInput, MDBoolInput } from "./components/essentials/content/MDBaseDataTypeInput";
import { SectionedListName } from "components/essentials/content/AbstractSectionedList";
import { MDSectionedList } from "./components/essentials/content/MDSectionedList";
import { VisualTypesDict } from "components/visualcomposition/visualDict";
import { MDCompactInfoListElement } from "./components/essentials/content/MDCompactInfoListElement";
import { SingleImageSelectorName } from "components/essentials/content/AbstractSingleImageSelector";
import { MDSingleImageSelector } from "./components/essentials/content/MDSingleImageSelector";
import { Card3itptLTRName, PureCard3itptLTR } from "./components/Card_3itptLTR";
import { MDButton } from "./components/essentials/interaction/MDButton";
import { TopNavigationName, BottomNavigationName } from "components/essentials/navigation/AbstractNavW5Choices";
import { MDBottomNavigation } from "./components/essentials/navigation/MDBottomNavigation";
import { MDNavSearchBar, NavSearchBarName } from "./components/essentials/navigation/MDNavSearchBar";
import { NavBarInputContainerName } from "components/essentials/navigation/AbstractNavBarInputContainer";
import { MDNavBarInputContainer } from "./components/essentials/navigation/MDNavBarInputContainer";
import { NavBarWActionsName } from "components/essentials/navigation/AbstractNavBarWActions";
import { MDNavBarWActions } from "./components/essentials/navigation/MDNavBarWActions";
import { NavProcessAtomName } from "components/essentials/navigation/AbstractNavProcessAtom";
import { MDNavProcessAtom } from "./components/essentials/navigation/MDNavProcessAtom";
import { SimpleTextTableName } from "components/essentials/content/AbstractSimpleTextTable";
import { MDTopNavigation } from "./components/essentials/navigation/MDTopNavigation";
import { MDSimpleTextTable } from "./components/essentials/content/MDSimpleTextTable";
import { ThemeProviderDarkName, ThemeProviderLightName, ThemeProviderLight, ThemeProviderDark } from "./components/essentials/content/DarkLightThemeProviders";

export const MOD_MATERIALDESIGN_ID = "material-design";
export const MOD_MATERIALDESIGN_NAME = "Material Design Mod";

export function initMaterialDesignMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve, reject) => {
		//register base data type inputs:
		appIntRetr.addItpt(LDDict.Boolean, MDBoolInput, "crud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(LDDict.Integer, MDIntInput, "CRUd", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(LDDict.Double, MDDoubleInput, "CRUd", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(LDDict.Text, MDTextInput, "CRUd", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(LDDict.Date, MDDateInput, "CRUd", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(LDDict.DateTime, MDDateTimeInput, "CRUd", [ITPT_TAG_ATOMIC]);

		//register list-itpts
		appIntRetr.addItpt(SectionedListName, MDSectionedList, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(VisualTypesDict.compactInfoElement, MDCompactInfoListElement, "cRud", [ITPT_TAG_ATOMIC]);

		//register Action itpts
		appIntRetr.addItpt(LDDict.Action, MDButton, "cRud", [ITPT_TAG_ATOMIC]);

		appIntRetr.addItpt(SingleImageSelectorName, MDSingleImageSelector, "cRud", [ITPT_TAG_ATOMIC]);

		//register visual composition itpts.
		//default core overrides
		appIntRetr.addItpt(NavBarInputContainerName, MDNavBarInputContainer, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(NavBarWActionsName, MDNavBarWActions, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(BottomNavigationName, MDBottomNavigation, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(TopNavigationName, MDTopNavigation, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(NavSearchBarName, MDNavSearchBar, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(NavProcessAtomName, MDNavProcessAtom, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(SimpleTextTableName, MDSimpleTextTable, "cRud", [ITPT_TAG_ATOMIC]);

		//composition itpts new from this mod
		appIntRetr.addItpt(Card3itptLTRName, PureCard3itptLTR, "cRud", [ITPT_TAG_ATOMIC]);

		//theming for this mod:
		appIntRetr.addItpt(ThemeProviderDarkName, ThemeProviderDark, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(ThemeProviderLightName, ThemeProviderLight, "cRud", [ITPT_TAG_ATOMIC]);

		resolve({ id: MOD_MATERIALDESIGN_ID, name: MOD_MATERIALDESIGN_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}
