export interface IEditorBlockData { 
	type: string;
	label: string;
	bpname?: string;
	canInterpretType?: string;
	subItptOf?: string 
}

//export type EDITOR_DND_ITEMTYPE = 'block' | 'preview';

export enum EditorDNDItemType {
	block = 'block',
	preview = 'preview'
}