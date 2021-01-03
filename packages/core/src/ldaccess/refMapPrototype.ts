import { UserDefDict } from ".";
import { BlueprintConfig } from "./ldBlueprint";

export function createRefMapPrototype(
	containerID,
	nameSelf,
	mainSubItptOf,
	mainCanInterpretType
): BlueprintConfig {
	const newBpCfg: BlueprintConfig = {
		subItptOf: containerID,
		canInterpretType: `${nameSelf}${UserDefDict.standardItptObjectTypeSuffix}`,
		nameSelf,
		ownKVLs: [
			{
				key: UserDefDict.intrprtrBPCfgRefMapKey,
				value: {
					[containerID]: {
						subItptOf: mainSubItptOf,
						canInterpretType: mainCanInterpretType,
						nameSelf: containerID,
						ownKVLs: [],
						crudSkills: "cRud"
					}
				},
				ldType: UserDefDict.intrprtrBPCfgRefMapType
			}
		],
		crudSkills: "cRud",
		inKeys: []
	};
	return newBpCfg;
}
