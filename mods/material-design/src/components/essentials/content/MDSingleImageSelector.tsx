import { Button } from "@material-ui/core";
import {
	DOMCamera,
	ldBlueprint, AbstractSingleImageSelector, SingleImageSelectorBpCfg,
	SingleImageSelectorStateEnum
} from "@metaexplorer/core";
import Dropzone, { DropzoneRef, DropzoneState } from "react-dropzone";
import React, { createRef, Ref } from "react";

import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';

export const MD_SINGLE_IMAGE_SELECTOR_NAME = "metaexplorer.io/material-design/SingleImageSelector";
export const MD_SINGLE_IMAGE_SELECTOR_CFG = {...SingleImageSelectorBpCfg};

MD_SINGLE_IMAGE_SELECTOR_CFG.nameSelf = MD_SINGLE_IMAGE_SELECTOR_NAME;

@ldBlueprint(MD_SINGLE_IMAGE_SELECTOR_CFG)
export class MDSingleImageSelector extends AbstractSingleImageSelector {
	protected dropzoneRef: Ref<DropzoneRef> = createRef();

	render() {
		const { curStep, isCamAvailable, previewURL } = this.state;
		const dzInputKey = "dz-input";
		return (<Dropzone
			// className={curStep === SingleImageSelectorStateEnum.isPreviewing ? "single-img-sel accept" : "single-img-sel"}
			accept="image/*"
			multiple={false}
			noClick={true}
			//disableClick={true}
			ref={this.dropzoneRef}
			onDropAccepted={(acceptedOrRejected) => {
				console.log("asdf")
				let files = acceptedOrRejected.map((file) => ({
					...file,
					preview: URL.createObjectURL(file)
				}));
				this.onDropSuccess(files[0], files[0].preview);
			}}
			onDropRejected={() => {
				console.log("fdsa")
				this.onDropFailure()
			}}
			//onDragStart={() => this.startDrag()}
			onDragEnter={() => this.startDrag()}
			onDragOver={() => this.startDrag()}
			onDragLeave={() => this.onDropFailure()}
			onFileDialogCancel={() => this.onDropFailure()}
			onDrop={(aF) => console.log(aF)}
		>
			{((dzstate: DropzoneState) => {
				switch (curStep) {
					case SingleImageSelectorStateEnum.isSelectInputType:
						return <div className="single-img-sel" {...dzstate.getRootProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
						}>
							<input key={dzInputKey} {...dzstate.getInputProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
							} />
							{isCamAvailable
								? <Button className="btn-extension" onClick={() => { this.startCamera(); }}>
									<AddAPhotoIcon />
									Open Camera
							</Button>
								: null}
							<Button className="btn-extension" onClick={() => { dzstate.open(); }}>
								<AddPhotoAlternate />
								Select Image
								</Button></div>;
					case SingleImageSelectorStateEnum.isCamShooting:
						return <DOMCamera showControls onImageSrcReady={(a) => {
							this.onDropSuccess(null, a);
						}} />;
					case SingleImageSelectorStateEnum.isDragging:
						return <div className="single-img-sel accept" {...dzstate.getRootProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
						}>
							<input key={dzInputKey} {...dzstate.getInputProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
							} />
							<img className="md-large-image" style={{ flex: 1 }} src={this.draggingImgLink} height="100px" />
						</div>;
					case SingleImageSelectorStateEnum.isPreviewing:
						return <img className="cover-img" src={previewURL} alt="image preview" ></img>;
					case SingleImageSelectorStateEnum.isError:
						return <span>isError</span>;
					default:
						return null;
				}
			})}
		</Dropzone >);
	}
}
