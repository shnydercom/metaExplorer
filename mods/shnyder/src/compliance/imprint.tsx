import React from 'react';
import { IKvStore, ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap,
	ILDOptions, LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState,
	VisualKeysDict, initLDLocalState, gdsfpLD, LDDict
} from '@metaexplorer/core';
import { Component } from 'react';

export const ImprintName = "shnyder/compliance/Imprint";

const schemaOrgName = "https://schema.org/name";
const schemaOrgAddressCountry = "https://schema.org/addressCountry";
const schemaOrgPostalCode = "https://schema.org/postalCode";
const schemaOrgAdressLocality = "https://schema.org/addressLocality";
const schemaOrgStreetAddress = "https://schema.org/streetAddress";

export const isImprintPersonNotOrganization = "isPersonNotOrganization";

let cfgIntrprtKeys: string[] =
	[VisualKeysDict.cssClassName, schemaOrgName, schemaOrgAddressCountry, schemaOrgPostalCode, schemaOrgAdressLocality, schemaOrgStreetAddress, isImprintPersonNotOrganization];

let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.cssClassName,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: schemaOrgName,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: schemaOrgAddressCountry,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: schemaOrgPostalCode,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: schemaOrgAdressLocality,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: schemaOrgStreetAddress,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: isImprintPersonNotOrganization,
		value: undefined,
		ldType: LDDict.Boolean
	},
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ImprintName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export interface ImprintState extends LDLocalState {
}

@ldBlueprint(bpCfg)
export class PureImprint extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, ImprintState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: ImprintState): null | ImprintState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [], cfgIntrprtKeys);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD };
		return {
			...rvNew
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	styleClassName: string;

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [],
			cfgIntrprtKeys);
		this.state = {
			...ldState,
		};
	}
	render() {
		const { localValues } = this.state;
		const cssClassName = localValues.get(VisualKeysDict.cssClassName);
		const vschemaOrgName = localValues.get(schemaOrgName);
		const vschemaOrgAddressCountry = localValues.get(schemaOrgAddressCountry);
		const vschemaOrgPostalCode = localValues.get(schemaOrgPostalCode);
		const vschemaOrgAdressLocality = localValues.get(schemaOrgAdressLocality);
		const vschemaOrgStreetAddress = localValues.get(schemaOrgStreetAddress);
		return <div className={cssClassName}>
			<p>
				<span className="imprint_imprint">Imprint</span><br/>
				<span className="imprint_name">{vschemaOrgName}</span><br/>
				<span className="imprint_street">{vschemaOrgStreetAddress}</span><br/>
				<span className="imprint_zipcode">{vschemaOrgPostalCode} </span>
				<span className="imprint_locality">{vschemaOrgAdressLocality}, </span>
				<span className="imprint_country">{vschemaOrgAddressCountry}</span>
			</p>
		</div>;
	}
}
