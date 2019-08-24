export interface IEditorBlockData { 
	type: "bdt" | "inputtype" | "outputtype" | "lineardata" | "ldbp";
	label: string;
	bpname?: string;
	canInterpretType?: string;
	subItptOf?: string 
}

export interface IEditorPreviewData {
}

export enum EditorDNDItemType {
	block = 'block',
	preview = 'preview'
}