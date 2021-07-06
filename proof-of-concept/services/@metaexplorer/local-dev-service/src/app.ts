import {
	chainedDevServer,
} from '@metaexplorer/editor-dev-server';
import {
	API_IRI_GLOBALS,
	FS_GLOBALS_FILENAME
} from '@metaexplorer/editor-dev-server';
import { DEV_NOCODE_FOLDER } from './initFolder';
import fs from 'fs';
import path from 'path';


const a = (app) => {
	const resolvedBasePath = path.resolve(DEV_NOCODE_FOLDER);
	/**
	 * overriding the 
	 * POST call to save values from the top-level redux state
	 */
	app.post(API_IRI_GLOBALS, (req, res) => {
		const globalsFilePath = path.join(resolvedBasePath, './' + FS_GLOBALS_FILENAME);
		const fileName = globalsFilePath;
		const fileContent = JSON.stringify(req.body);
		fs.writeFileSync(fileName, fileContent);
		//saveProgressBackup(fileName, fileContent)
		res.status(200).json({
			statusPayload: "saved!",
			status: 'success'
		});
	});
}

chainedDevServer(a);