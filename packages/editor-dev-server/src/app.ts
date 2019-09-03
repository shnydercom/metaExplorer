import {editorToFileSystem} from './editor-to-fs-server';
import { copyDir, mkdir } from './scripts/copydir';

import path from 'path';

const devNocodeFolder = 'dev-srv-nocode';

mkdir(devNocodeFolder);
mkdir(devNocodeFolder+"/blocks");

//copy nocode to devNocodeFolder
copyDir(path.resolve('../../nocode/metaexplorer.io/blocks'), path.resolve(devNocodeFolder,"blocks"));

//load the express server
editorToFileSystem(devNocodeFolder, "metaexplorer.io/v2/index");