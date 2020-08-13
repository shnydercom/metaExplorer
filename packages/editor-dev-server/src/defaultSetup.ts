import express from 'express';
import { editorToFileSystem } from './editor-to-fs-server';
import { copyDir, mkdir } from './scripts/copydir';

import path from 'path';

const DEV_NOCODE_FOLDER = 'dev-srv-nocode';
export const DYN_USER_CSS_FOLDER = "styles";

mkdir(DEV_NOCODE_FOLDER);
mkdir(DEV_NOCODE_FOLDER + "/blocks");
mkdir(DEV_NOCODE_FOLDER + "/" + DYN_USER_CSS_FOLDER);

//copy nocode to devNocodeFolder
const nocodePath = process.env.NOCODE_BLOCKS_PATH ? process.env.NOCODE_BLOCKS_PATH : '../../nocode/metaexplorer.io/blocks';
const nocodeItpt = process.env.NOCODE_BLOCK_START ? process.env.NOCODE_BLOCK_START : "metaexplorer.io/v2/index";
if (process.env.OVERWRITE_ON_RESTART) copyDir(path.resolve(nocodePath.trim()), path.resolve(DEV_NOCODE_FOLDER, "blocks"));

//load the express server
export const chainedDevServer = (chainCall?: (app: express.Application) => void) => {
	editorToFileSystem(DEV_NOCODE_FOLDER, nocodeItpt.trim(), undefined, chainCall);
};
