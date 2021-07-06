import fs from 'fs';
import path from 'path';
import { copyDir, mkdir } from '@metaexplorer/editor-dev-server/lib/scripts/copydir';

export const DEV_NOCODE_FOLDER = 'dev-srv-nocode';
export const DYN_USER_CSS_FOLDER = "styles";

if (!fs.existsSync(path.resolve(DEV_NOCODE_FOLDER))) {
	mkdir(DEV_NOCODE_FOLDER);
	mkdir(DEV_NOCODE_FOLDER + "/blocks");
	mkdir(DEV_NOCODE_FOLDER + "/" + DYN_USER_CSS_FOLDER);

	//copy nocode to DEV_NOCODE_FOLDER
	let nocodePath = process.env.NOCODE_BLOCKS_PATH ? process.env.NOCODE_BLOCKS_PATH : '../../../nocode/@metaexplorer-nocode/metaexplorer.io/blocks';
	nocodePath = nocodePath.trim();
	if (fs.existsSync(nocodePath)) {
		copyDir(path.resolve(nocodePath), path.resolve(DEV_NOCODE_FOLDER, "blocks"));
		console.log("copied blocks from NOCODE_BLOCKS_PATH: " + nocodePath);
	} else {
		console.warn("NOCODE_BLOCKS_PATH not found for value: " + nocodePath);
	}
}
