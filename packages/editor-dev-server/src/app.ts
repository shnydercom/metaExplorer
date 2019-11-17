import { editorToFileSystem } from './editor-to-fs-server';
import { copyDir, mkdir } from './scripts/copydir';

import path from 'path';

const devNocodeFolder = 'dev-srv-nocode';
export const DYN_USER_CSS_FOLDER = "styles";

mkdir(devNocodeFolder);
mkdir(devNocodeFolder + "/blocks");
mkdir(devNocodeFolder + "/" + DYN_USER_CSS_FOLDER);

//copy nocode to devNocodeFolder
const nocodePath = process.env.NOCODE_BLOCKS_PATH ? process.env.NOCODE_BLOCKS_PATH : '../../nocode/metaexplorer.io/blocks';
const nocodeItpt = process.env.NOCODE_BLOCK_START ? process.env.NOCODE_BLOCK_START : "metaexplorer.io/v2/index";
copyDir(path.resolve(nocodePath.trim()), path.resolve(devNocodeFolder, "blocks"));

//load the express server
editorToFileSystem(devNocodeFolder, nocodeItpt.trim());