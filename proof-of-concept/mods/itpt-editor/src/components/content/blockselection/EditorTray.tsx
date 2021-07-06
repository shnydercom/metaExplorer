import { Component } from "react";
import TreeView, { TreeEntry } from "metaexplorer-react-components/lib/components/treeview/treeview";
import { IBlueprintItpt, IItptInfoItem, ITPT_TAG_ATOMIC, ITPT_TAG_COMPOUND } from "@metaexplorer/core";
import { DraggableEditorTrayItem } from "./EditorTrayItem";
import { StylableDragItemProps, DragItem } from "metaexplorer-react-components";
import React from "react";
import { EditorDNDItemType, IEditorBlockData } from "../../editorInterfaces";

export interface FlatContentInfo {
	flatContentURLs: string[];
	itpts: IBlueprintItpt[];
}

export interface EditorTrayProps {
	itpts: IItptInfoItem[];
	onZoomAutoLayoutPress: () => void;
	onEditTrayItem: (data: any) => void;
	onTriggerPreview: (data) => void;
}

export interface EditorTrayState {
	trayitpts: IItptInfoItem[];
	trayElems: JSX.Element;
}

const editorDragItem: DragItem<EditorDNDItemType, IEditorBlockData> = {
	id: 'a',
	type: EditorDNDItemType.block,
	sourceBhv: 'sCopy',
	targetBhv: 'tGone',
	data: {
		type: 'bdt',
		label: "base data type"
	}
};

const editorStylableDragItem: StylableDragItemProps<EditorDNDItemType, IEditorBlockData> = {
	...editorDragItem,
	isWithDragHandle: false,
	className: 'block-dragcontainer',
	dragOrigin: { left: 0, top: 0 }
};

export class EditorTray extends Component<EditorTrayProps, EditorTrayState> {

	static getDerivedStateFromProps(nextProps: EditorTrayProps, prevState: EditorTrayState): EditorTrayState {
		if (
			(!prevState.trayitpts && nextProps.itpts) ||
			(prevState.trayitpts && !nextProps.itpts) ||
			(prevState.trayitpts.length !== nextProps.itpts.length)
		) {
			return { trayitpts: nextProps.itpts, trayElems: EditorTray.trayItemsFromItptList(nextProps, nextProps.itpts) };
		}
		for (let i = 0; i < prevState.trayitpts.length; i++) {
			const prevItpt = prevState.trayitpts[i];
			if (prevItpt.nameSelf !== nextProps.itpts[i].nameSelf) {
				return { trayitpts: nextProps.itpts, trayElems: EditorTray.trayItemsFromItptList(nextProps, nextProps.itpts) };
			}
		}
		return null;
	}

	protected static trayItemsFromItptList(nextProps: EditorTrayProps, trayitpts: IItptInfoItem[]) {

		const baseDragProps: StylableDragItemProps<EditorDNDItemType, IEditorBlockData> = {
			...editorStylableDragItem
		};
		const itpts = trayitpts.slice();
		itpts.shift(); //rm basecontainer
		itpts.shift(); //rm refMap
		itpts.sort((a, b) => {
			var x = a.nameSelf.toLowerCase();
			var y = b.nameSelf.toLowerCase();
			if (x < y) { return -1; }
			if (x > y) { return 1; }
			return 0;
		});
		const specialNodesText: string = "Set standard values, mark a value for later input or build forms with as many blocks as you want";
		const specialBlocksCommonProps = {
			...baseDragProps,
			isCompoundBlock: false,
			onTriggerPreview: (data) => { /*nextProps.onEditTrayItem(data), */ },
			onEditBtnPress: (data) => nextProps.onEditTrayItem(data)
		};
		const specialNodesTreeItem: TreeEntry = {
			flatContent: [
				<DraggableEditorTrayItem isOpen={false} {...specialBlocksCommonProps} key={1} data={{ type: "bdt", label: "Simple Data Type" }} />,
				<DraggableEditorTrayItem isOpen={false} {...specialBlocksCommonProps} key={2} data={{ type: "inputtype", label: "External Input Marker" }} />,
				<DraggableEditorTrayItem isOpen={false} {...specialBlocksCommonProps} key={3} data={{ type: "outputtype", label: "External Output Marker" }} />,
				<DraggableEditorTrayItem isOpen={false} {...specialBlocksCommonProps} key={4} data={{ type: "lineardata", label: "Linear Data Display" }} />
			],
			label: 'Special Blocks',
			subEntries: []
		};
		const atomicNodesText: string = "Drag and drop these elements to create compound blocks. As basic functional blocks, they can't be split up into smaller parts";
		const atomicNodesTreeItem: TreeEntry & FlatContentInfo = {
			flatContentURLs: [],
			flatContent: [],
			label: 'Atomic Blocks',
			subEntries: [],
			itpts: []
		};

		const compoundNodesText: string = "Click on a block to see how it's been made, or drag and drop it to the right to re-use your creations";
		const compoundNodesTreeItem: TreeEntry & FlatContentInfo = {
			flatContentURLs: [],
			flatContent: [],
			label: 'Compound Blocks',
			subEntries: [],
			itpts: []
		};
		itpts.forEach((iItptInfoItm, idx) => {
			let ldBPCfg = (iItptInfoItm.itpt as IBlueprintItpt).cfg;
			let trayName = ldBPCfg ? ldBPCfg.nameSelf : "unnamed";
			if (iItptInfoItm.tags.includes(ITPT_TAG_ATOMIC)) {
				EditorTray.addItptToTree(atomicNodesTreeItem, iItptInfoItm, trayName);
			} else
				if (iItptInfoItm.tags.includes(ITPT_TAG_COMPOUND)) {
					EditorTray.addItptToTree(compoundNodesTreeItem, iItptInfoItm, trayName);
				}
		});
		EditorTray.createFlatContentFromItpts(atomicNodesTreeItem, nextProps.onEditTrayItem, nextProps.onTriggerPreview, false, nextProps);
		EditorTray.createFlatContentFromItpts(compoundNodesTreeItem, nextProps.onEditTrayItem, nextProps.onTriggerPreview, true, nextProps);
		return <>
			<TreeView entry={specialNodesTreeItem}>{specialNodesText}</TreeView>
			<TreeView entry={atomicNodesTreeItem}>{atomicNodesText}</TreeView>
			<TreeView entry={compoundNodesTreeItem}>{compoundNodesText}</TreeView>
		</>;
	}

	protected static addItptToTree(tree: TreeEntry & FlatContentInfo, infoItm: IItptInfoItem, remainingName: string) {
		let remainerSplit = remainingName.split('/');
		let isCreateHere: boolean = false;
		if (remainerSplit.length === 1) {
			isCreateHere = true;
		}
		if (!isCreateHere) {
			let treeToAddToIdx: number = tree.subEntries.findIndex((val) => val.label === remainerSplit[0]);
			let treeToAddTo: TreeEntry = tree.subEntries[treeToAddToIdx];
			let remainerIdx: number = 1;
			if (!treeToAddTo) {
				let urlPathStartPattern = new RegExp('^' + remainerSplit[0] + "\/");
				treeToAddToIdx = tree.subEntries.findIndex((val, idx) => urlPathStartPattern.test(val.label));
				treeToAddTo = tree.subEntries[treeToAddToIdx];
				if (treeToAddTo) {
					let searchTerm = remainerSplit[0];
					for (let idx = 1; idx < remainerSplit.length; idx++) {
						let newSearchTerm = searchTerm + '/' + remainerSplit[idx];
						remainerIdx = idx;
						if (!treeToAddTo.label.startsWith(newSearchTerm)) {
							break;
						}
						searchTerm = newSearchTerm;
					}
					if (treeToAddTo.label !== searchTerm) {
						let splitTreeLabelA = treeToAddTo.label.slice(searchTerm.length + 1);
						treeToAddTo.label = splitTreeLabelA;
						let newRoot: TreeEntry & FlatContentInfo = {
							flatContent: [],
							flatContentURLs: [],
							label: searchTerm,
							subEntries: [
								treeToAddTo
							],
							itpts: []
						};
						treeToAddTo = newRoot;
					}
				}
			}
			if (treeToAddTo) {
				remainerSplit = remainerSplit.slice(remainerIdx);
				tree.subEntries.splice(treeToAddToIdx, 1, treeToAddTo);
				EditorTray.addItptToTree(treeToAddTo as TreeEntry & FlatContentInfo, infoItm, remainerSplit.join('/'));
				return;
			}
		}
		if (!isCreateHere) {
			let urlPathStartPattern = new RegExp('^' + remainerSplit[0] + "\/");
			let similarItm = tree.flatContentURLs.findIndex((val, idx) => urlPathStartPattern.test(val));
			if (similarItm === -1) {
				isCreateHere = true;
			} else {
				let similarString: string = tree.flatContentURLs[similarItm];
				let stringRemainerIdx: number = 1;
				let searchTerm = remainerSplit[0];
				for (let idx = 1; idx < remainerSplit.length; idx++) {
					let newSearchTerm = searchTerm + '/' + remainerSplit[idx];
					stringRemainerIdx = idx;
					if (!similarString.startsWith(newSearchTerm)) {
						break;
					}
					searchTerm = newSearchTerm;
				}
				let remainerA = similarString.slice(searchTerm.length + 1);
				let newTree: TreeEntry & FlatContentInfo = {
					label: searchTerm,
					flatContentURLs: [remainerA],
					flatContent: [],
					subEntries: [],
					itpts: [tree.itpts[similarItm]]
				};
				remainerSplit = remainerSplit.slice(stringRemainerIdx);
				tree.subEntries.push(newTree);
				tree.itpts.splice(similarItm, 1);
				tree.flatContentURLs.splice(similarItm, 1);
				EditorTray.addItptToTree(newTree, infoItm, remainerSplit.join('/'));
				return;
			}
		}
		if (isCreateHere) {
			tree.flatContentURLs.push(remainingName);
			tree.itpts.push(infoItm.itpt);
		}
	}

	protected static createFlatContentFromItpts(
		tree: TreeEntry & FlatContentInfo,
		onEditTrayItem: (data: any) => void, 
		onTriggerPreview: (data: any) => void, 
		isCompoundBlock: boolean,
		nextProps: EditorTrayProps) {
		const baseDragProps: StylableDragItemProps<EditorDNDItemType, IEditorBlockData> = {
			...editorStylableDragItem
		};
		tree.itpts.forEach((itpt, idx) => {
			let ldBPCfg = itpt.cfg;
			let trayName = ldBPCfg ? ldBPCfg.nameSelf : "unnamed";
			let trayItptType = ldBPCfg ? ldBPCfg.canInterpretType : ldBPCfg.canInterpretType;
			let remainingName = tree.flatContentURLs[idx];
			tree.flatContent.push(<DraggableEditorTrayItem isOpen={false} {...baseDragProps} isCompoundBlock={isCompoundBlock}
				onTriggerPreview={(data) => onTriggerPreview(data)}
				onEditBtnPress={(data) => onEditTrayItem(data)}
				key={trayName}
				data={{ type: "ldbp", label: remainingName, bpname: trayName, canInterpretType: trayItptType, subItptOf: null }} />
			);
		});
		tree.subEntries.forEach((treeEntry: TreeEntry & FlatContentInfo, idx) => {
			EditorTray.createFlatContentFromItpts(treeEntry, onEditTrayItem, onTriggerPreview, isCompoundBlock, nextProps);
		});
	}

	constructor(props: EditorTrayProps) {
		super(props);
		this.state = { trayitpts: null, trayElems: null };
	}

	render() {
		const { trayitpts, trayElems } = this.state;
		return <div className="editor-tray">
			{this.props.children}
			<div className="mdscrollbar" style={{ paddingBottom: "36px", flex: 1 }}>
				{trayitpts ? trayElems : null}
			</div>
			<div className="button-row">
				<button className="editorbtn editorbtn-small editorbtn-action editorbtn-autolayout" onClick={(ev) => {
					ev.preventDefault();
					ev.stopPropagation();
					this.props.onZoomAutoLayoutPress();
				}
				} >beautify</button>
			</div>
		</div>;
	}
}
