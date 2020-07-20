export const snapshotFindUserQueryVariables: string = `export const FindUserQueryVariables:BlueprintConfigFragment = {
	nameSelf : "FindUserQueryVariables",
	crudSkills : "cRUd",
	subItptOf: null,
	inKeys: ["userId","username","emailInVar"],
	ownKVLs: [  {
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

export const snapshotFindUserQuery: string = `export const FindUserQuery:BlueprintConfigFragment = {
	nameSelf : "FindUserQuery",
	crudSkills : "cRUd",
	subItptOf: null,
	inKeys: ["variables"],
	ownKVLs: [
		{
			key: "variables",
			value: null,
			ldType: LDUIDict.GQLQueryVars
		}
	]
};`;

export const snapshotUserFieldsFragment: string = `export const UserFieldsFragment = {

};`;
