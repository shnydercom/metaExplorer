import { Component } from "react";
import { Button, IconButton } from "react-toolbox/lib/button";
import TreeView, { TreeEntry } from "metaexplorer-react-components/lib/components/treeview/treeview";
import { IBlueprintItpt } from "ldaccess/ldBlueprint";
import { IItptInfoItem } from "defaults/DefaultItptRetriever";
import { EditorTrayItem } from "./EditorTrayItem";
import { ITPT_TAG_ATOMIC, ITPT_TAG_COMPOUND } from "ldaccess/iitpt-retriever";
import * as appStyles from 'styles/styles.scss';
import { DropRefmapResult } from "./RefMapDropSpace";

export interface FlatContentInfo {
	flatContentURLs: string[];
	itpts: IBlueprintItpt[];
}

export interface EditorTrayProps {
	itpts: IItptInfoItem[];
	onZoomAutoLayoutPress: () => void;
	onClearBtnPress: () => void;
	onEditTrayItem: (data: any) => DropRefmapResult;
}

export interface EditorTrayState {
	trayitpts: IItptInfoItem[];
	trayElems: JSX.Element;
}

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
		const specialNodesText: string = "Set standard values, mark a value for later input or build forms with as many interpreters as you want";
		const specialNodesTreeItem: TreeEntry = {
			flatContent: [
				<EditorTrayItem isCompoundBlock={false} onLongPress={(data) => nextProps.onEditTrayItem(data)} key={1} model={{ type: "bdt" }} name="Simple Data Type" color={appStyles["$editor-secondary-color"]} />,
				<EditorTrayItem isCompoundBlock={false} onLongPress={(data) => nextProps.onEditTrayItem(data)} key={2} model={{ type: "inputtype" }} name="External Input Marker" color={appStyles["$editor-secondary-color"]} />,
				<EditorTrayItem isCompoundBlock={false} onLongPress={(data) => nextProps.onEditTrayItem(data)} key={3} model={{ type: "outputtype" }} name="External Output Marker" color={appStyles["$editor-secondary-color"]} />,
				<EditorTrayItem isCompoundBlock={false} onLongPress={(data) => nextProps.onEditTrayItem(data)} key={4} model={{ type: "lineardata" }} name="Linear Data Display" color={appStyles["$editor-secondary-color"]} />
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

		const hydraNodesText: string = "Interact with outside data from a hydra endpoint";
		const hydraNodesTreeItem: TreeEntry & FlatContentInfo = {
			flatContentURLs: [],
			flatContent: [],
			label: 'Hydra Blocks',
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
		EditorTray.createFlatContentFromItpts(atomicNodesTreeItem, nextProps.onEditTrayItem, false);
		EditorTray.createFlatContentFromItpts(compoundNodesTreeItem, nextProps.onEditTrayItem, true);
		return <div style={{ paddingBottom: "40px", flex: 1 }} className="mdscrollbar">
			<TreeView entry={specialNodesTreeItem}>{specialNodesText}</TreeView>
			<TreeView entry={atomicNodesTreeItem}>{atomicNodesText}</TreeView>
			<TreeView entry={compoundNodesTreeItem}>{compoundNodesText}</TreeView>
		</div>;
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
		onEditTrayItem: (data: any) => DropRefmapResult, isCompoundBlock: boolean) {
		tree.itpts.forEach((itpt, idx) => {
			let ldBPCfg = itpt.cfg;
			let trayName = ldBPCfg ? ldBPCfg.nameSelf : "unnamed";
			let trayItptType = ldBPCfg ? ldBPCfg.canInterpretType : ldBPCfg.canInterpretType;
			let remainingName = tree.flatContentURLs[idx];
			tree.flatContent.push(<EditorTrayItem isCompoundBlock={isCompoundBlock} onLongPress={(data) => onEditTrayItem(data)}
				key={trayName}
				model={{ type: "ldbp", bpname: trayName, canInterpretType: trayItptType, subItptOf: null }}
				name={remainingName}
				color={appStyles["$editor-secondary-color"]} />
			);
		});
		tree.subEntries.forEach((treeEntry: TreeEntry & FlatContentInfo, idx) => {
			EditorTray.createFlatContentFromItpts(treeEntry, onEditTrayItem, isCompoundBlock);
		});
	}

	constructor(props: EditorTrayProps) {
		super(props);
		this.state = { trayitpts: null, isTrayElemsDirty: false, trayElems: null };
	}

	render() {
		const { trayitpts, trayElems } = this.state;
		return <div className="editor-tray">
			{this.props.children}
			<div className="mdscrollbar">
				{trayitpts ? trayElems : null}
			</div>
			<div className="button-row">
				<Button className="newbtn" icon="add" label="new" onClick={(ev) => {
					this.props.onClearBtnPress();
				}} />
				<Button style={{ color: "white" }} label="beautify" onClick={(ev) => {
					this.props.onZoomAutoLayoutPress();
				}
				} />
			</div>
		</div>;
	}
}
