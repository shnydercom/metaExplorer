import { AbstractDataTransformer } from "../../datatransformation";
import { BlueprintConfig, KVL, ldBlueprint, LDDict, UserDefDict } from "../../ldaccess";

export const IRI_MAILTO_TO = "iri/mailto/to";

export const IRI_MAILTO_SUBJECT = "iri/mailto/subject";

export const IRI_MAILTO_BODY = "iri/mailto/body";

export const IRI_MAILTO_FORMATTER_TYPE = "iri/mailto/Formatter-Type";

export const IRI_MAILTO_OUTPUTIRI_TYPE = LDDict.Text;

export const IRIMailtoFormatterName: string = "iri/mailto/Formatter";

export const IRIMailtoFormatterItptKeys: string[] = [IRI_MAILTO_TO, IRI_MAILTO_SUBJECT, IRI_MAILTO_BODY];
export const IRIMailtoFormatterOutputKVs: KVL[] = [
	{
		key: UserDefDict.outputData,
		value: undefined,
		ldType: IRI_MAILTO_OUTPUTIRI_TYPE
	}
];

const ownKVLs: KVL[] = [
	{
		key: IRI_MAILTO_TO,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: IRI_MAILTO_SUBJECT,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: IRI_MAILTO_BODY,
		value: undefined,
		ldType: LDDict.Text
	},
	...IRIMailtoFormatterOutputKVs
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: IRIMailtoFormatterName,
	ownKVLs: ownKVLs,
	inKeys: IRIMailtoFormatterItptKeys,
	crudSkills: "cRUd"
};
@ldBlueprint(bpCfg)
export class IRIMailtoFormatter extends AbstractDataTransformer {
	constructor() {
		super();
		this.itptKeys = IRIMailtoFormatterItptKeys;
		this.outputKvStores = IRIMailtoFormatterOutputKVs;
	}

	protected mappingFunction(
		inputParams: Map<string, KVL>,
		outputKvStores: Map<string, KVL>): KVL[] {
		let rv = [];
		const mailtoTo = inputParams.get(IRI_MAILTO_TO);
		const mailtoSubject = inputParams.get(IRI_MAILTO_SUBJECT);
		const mailtoBody = inputParams.get(IRI_MAILTO_BODY);

		let urlParts = [];

		const toFormatted = mailtoTo && mailtoTo.value ? `mailto:${encodeURI(mailtoTo.value)}` : 'mailto:';
		if (!mailtoTo || !mailtoTo.value) urlParts.push('to='); // address can be omitted
		const subjectFormatted = mailtoSubject && mailtoSubject.value ? `subject=${encodeURI(mailtoSubject.value)}` : null;
		const bodyFormatted = mailtoBody && mailtoBody.value ? `body=${encodeURI(mailtoBody.value)}` : null;
		urlParts.push(subjectFormatted, bodyFormatted);
		urlParts = urlParts.filter((val) => val !== null);

		const mailtoIRIcomplete = `${toFormatted}${urlParts.map((val, idx) => {
			if (idx === 0) return `?${val}`;
			return `&${val}`;
		}).reduce((prev, cur) => `${prev}${cur}`, "")}`;

		const outputDataKV = outputKvStores.get(UserDefDict.outputData);
		outputDataKV.value = mailtoIRIcomplete;
		rv = [
			outputDataKV
		];
		return rv;
	}
}
