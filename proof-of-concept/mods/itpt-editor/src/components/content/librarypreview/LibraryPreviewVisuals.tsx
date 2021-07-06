import { BaseContainerRewrite } from "@metaexplorer/core";
import React from "react";
import { LIBRARY_PREVIEW_KEY } from "./ldInterfacing";

export interface LibraryPreviewProps {
	ldTokenString?: string;
}

export const LibraryPreviewVisual = (props: LibraryPreviewProps) => {
	return <div className="editor-library-preview mdscrollbar">
		<BaseContainerRewrite ldTokenString={
			props.ldTokenString
				? props.ldTokenString
				: LIBRARY_PREVIEW_KEY
		}
			routes={null} />
	</div>;
};
