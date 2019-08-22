export interface IEditorBlockData { 
	type: string;
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