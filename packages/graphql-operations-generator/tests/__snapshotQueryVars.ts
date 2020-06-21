export const snapshotQueryVars: string = `export const FindUserQueryVariables:BlueprintConfigFragment = {
	nameSelf : "FindUserQueryVariables",
	crudSkills : "cRUd",
	subItptOf: null,
	interpretableKeys: ["userId","username","emailInVar"],
	initialKvStores: [  {
			key: "userId",
			value: null,
			ldType: createTriple(Scalars['ID'], LDUIDictVerbs.required, true)
	},
		{
			key: "username",
			value: null,
			ldType: Scalars['String']
	},
		{
			key: "emailInVar",
			value: null,
			ldType: Scalars['String']
	},
	{
			key: "outputdata",
			value: undefined,
			ldType: LDUIDict.GQLQueryVars
	}],

	};`;
