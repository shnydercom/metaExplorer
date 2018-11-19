import { Component } from "react";
import { DesignerLogic } from "./designer-logic";
import { Button, IconButton } from "react-toolbox/lib/button";
import TreeView, { TreeEntry } from "metaexplorer-react-components/lib/components/treeview/treeview";
import { IBlueprintItpt } from "ldaccess/ldBlueprint";
import { IItptInfoItem } from "defaults/DefaultItptRetriever";
import { DesignerTrayItem } from "./DesignerTrayItem";
import { ITPT_TAG_ATOMIC, ITPT_TAG_COMPOUND } from "ldaccess/iitpt-retriever";
import * as appStyles from 'styles/styles.scss';
import { DropRefmapResult } from "./RefMapDropSpace";

export interface FlatContentInfo {
	flatContentURLs: string[];
	itpts: IBlueprintItpt[];
}

export interface DesignerTrayProps {
	logic: DesignerLogic;
	onZoomAutoLayoutPress: () => void;
	onClearBtnPress: () => void;
	onEditTrayItem: (data: any) => DropRefmapResult;
}

export interface DesignerTrayState { }

export class DesignerTray extends Component<DesignerTrayProps, DesignerTrayState> {

	constructor(props: DesignerTrayProps) {
		super(props);
		this.state = {};
	}
	public trayItemsFromItptList() {
		let itpts: IItptInfoItem[] = this.props.logic.getItptList();
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
				<DesignerTrayItem onLongPress={(data) => this.props.onEditTrayItem(data)} key={1} model={{ type: "bdt" }} name="Simple Data Type" color={appStyles["$designer-secondary-color"]} />,
				<DesignerTrayItem onLongPress={(data) => this.props.onEditTrayItem(data)} key={2} model={{ type: "inputtype" }} name="External Input Marker" color={appStyles["$designer-secondary-color"]} />,
				<DesignerTrayItem onLongPress={(data) => this.props.onEditTrayItem(data)} key={3} model={{ type: "lineardata" }} name="Linear Data Display" color={appStyles["$designer-secondary-color"]} />
			],
			label: 'Special Blocks',
			subEntries: []
		};
		const atomicNodesText: string = "Use these elements to create compound blocks. As basic functional blocks, they can't be split up into smaller parts";
		const atomicNodesTreeItem: TreeEntry & FlatContentInfo = {
			flatContentURLs: [],
			flatContent: [],
			label: 'Atomic Blocks',
			subEntries: [],
			itpts: []
		};
		const compoundNodesText: string = "Combine any block type to make up new blocks, or drop one in the box below to see how it's been made";
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
				this.addItptToTree(atomicNodesTreeItem, iItptInfoItm, trayName);
			} else
				if (iItptInfoItm.tags.includes(ITPT_TAG_COMPOUND)) {
					this.addItptToTree(compoundNodesTreeItem, iItptInfoItm, trayName);
				}
		});
		this.createFlatContentFromItpts(atomicNodesTreeItem);
		this.createFlatContentFromItpts(compoundNodesTreeItem);
		return <div style={{ paddingBottom: "40px", flex: 1 }} className="mdscrollbar">
			<TreeView entry={specialNodesTreeItem}>{specialNodesText}</TreeView>
			<TreeView entry={atomicNodesTreeItem}>{atomicNodesText}</TreeView>
			<TreeView entry={compoundNodesTreeItem}>{compoundNodesText}</TreeView>
		</div>;
	}

	render() {
		return <div className="designer-tray">
			{this.props.children}
			<div className="mdscrollbar">
				{this.trayItemsFromItptList()}
			</div>
			<div className="button-row">
				<Button style={{ color: "white" }} label="clear" onClick={(ev) => {
					this.props.onClearBtnPress();
				}} />
				<Button style={{ color: "white" }} label="zoom + autolayout" onClick={(ev) => {
					this.props.onZoomAutoLayoutPress();
				}
				} />
			</div>
		</div>;
	}

	protected addItptToTree(tree: TreeEntry & FlatContentInfo, infoItm: IItptInfoItem, remainingName: string) {
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
				treeToAddToIdx = tree.subEntries.findIndex((val, idx) => val.label.startsWith(remainerSplit[0]));
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
						let splitTreeLabelA = treeToAddTo.label.slice(searchTerm.length - 1);
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
				this.addItptToTree(treeToAddTo as TreeEntry & FlatContentInfo, infoItm, remainerSplit.join('/'));
				return;
			}
		}
		if (!isCreateHere) {
			let similarItm = tree.flatContentURLs.findIndex((val, idx) => val.startsWith(remainerSplit[0]));
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
				this.addItptToTree(newTree, infoItm, remainerSplit.join('/'));
				return;
			}
		}
		if (isCreateHere) {
			tree.flatContentURLs.push(remainingName);
			tree.itpts.push(infoItm.itpt);
		}
	}

	protected createFlatContentFromItpts(tree: TreeEntry & FlatContentInfo) {
		tree.itpts.forEach((itpt, idx) => {
			let ldBPCfg = itpt.cfg;
			let trayName = ldBPCfg ? ldBPCfg.nameSelf : "unnamed";
			let trayItptType = ldBPCfg ? ldBPCfg.canInterpretType : ldBPCfg.canInterpretType;
			let remainingName = tree.flatContentURLs[idx];
			tree.flatContent.push(<DesignerTrayItem onLongPress={(data) => this.props.onEditTrayItem(data)}
				key={trayName}
				model={{ type: "ldbp", bpname: trayName, canInterpretType: trayItptType, subItptOf: null }}
				name={remainingName}
				color={appStyles["$designer-secondary-color"]} />
			);
		});
		tree.subEntries.forEach((treeEntry: TreeEntry & FlatContentInfo, idx) => {
			this.createFlatContentFromItpts(treeEntry);
		});
	}
}
