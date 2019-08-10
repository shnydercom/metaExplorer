import { LDOwnProps } from "../../appstate/LDProps";
import { IBlueprintItpt } from "../../ldaccess/ldBlueprint";

export interface IReactCompInfoItm {
	compClass: React.ComponentClass<LDOwnProps> & IBlueprintItpt;
	key: string;
	ldTokenString: string;
}

export interface ReactCompInfoMap extends Map<string, IReactCompInfoItm | IReactCompInfoItm[]>{}

export interface ReactBlueprint {
	compInfos: ReactCompInfoMap;
}
