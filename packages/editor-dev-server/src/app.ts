import { editorToFileSystem } from './editor-to-fs-server';
import { copyDir, mkdir } from './scripts/copydir';

import path from 'path';

const devNocodeFolder = 'dev-srv-nocode';
export const DYN_USER_CSS_FOLDER = "styles";

mkdir(devNocodeFolder);
mkdir(devNocodeFolder + "/blocks");
mkdir(devNocodeFolder + "/" + DYN_USER_CSS_FOLDER);

//copy nocode to devNocodeFolder
copyDir(path.resolve('../../nocode/metaexplorer.io/blocks'), path.resolve(devNocodeFolder, "blocks"));

//load the express server
editorToFileSystem(devNocodeFolder, "metaexplorer.io/v2/index");