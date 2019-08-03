import { Button } from "@material-ui/core";
import { DOMCamera, ldBlueprint, AbstractSingleImageSelector, SingleImageSelectorBpCfg, SingleImageSelectorStateEnum } from "@metaexplorer/core";
import { default as Dropzone } from "react-dropzone";
import React from "react";

import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';

@ldBlueprint(SingleImageSelectorBpCfg)
export class MDSingleImageSelector extends AbstractSingleImageSelector {

	render() {
		const { curStep, isCamAvailable, previewURL } = this.state;
		let dropzoneRef;
		return (<Dropzone
			// className={curStep === SingleImageSelectorStateEnum.isPreviewing ? "single-img-sel accept" : "single-img-sel"}
			accept="image/*"
			multiple={false}
			//disableClick={true}
			ref={(node) => { dropzoneRef = node; }}
			onDropAccepted={(acceptedOrRejected) => {
				let files = acceptedOrRejected.map((file) => ({
					...file,
					preview: URL.createObjectURL(file)
				}));
				this.onDropSuccess(files[0], files[0].preview);
			}}
			onDropRejected={() => this.onDropFailure()}
			//onDragStart={() => this.startDrag()}
			onDragEnter={() => this.startDrag()}
			onDragOver={() => this.startDrag()}
			onDragLeave={() => this.onDropFailure()}
			onFileDialogCancel={() => this.onDropFailure()}
		>
			{((dzstate) => {
				switch (curStep) {
					case SingleImageSelectorStateEnum.isSelectInputType:
						return <div className="accept"> {isCamAvailable ? <Button className="btn-extension" onClick={() => { this.startCamera(); }}>
							<AddAPhotoIcon />
							Open Camera
							</Button> : null}
							<Button className="btn-extension" onClick={() => { dropzoneRef.open(); }}>
								<AddPhotoAlternate />
								Select Image
								</Button></div>;
					case SingleImageSelectorStateEnum.isCamShooting:
						return <DOMCamera showControls onImageCaptured={(a) => {
							this.onDropSuccess(null, a);
						}} />;
					case SingleImageSelectorStateEnum.isDragging:
						return <div className="accept"><img className="md-large-image" style={{ flex: 1 }} src={this.draggingImgLink} height="100px" /></div>;
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
