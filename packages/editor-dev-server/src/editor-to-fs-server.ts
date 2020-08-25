import express from 'express';
import path from 'path';
import fs from 'fs';
import { createBlocksFromLib } from './scripts/create-blocks-from-lib';
import { mkdir } from './scripts/copydir';
/*
	this server will save blocks to the file system,
	building a directory structure dependent on the IRI of the "nameSelf"-property.
	You can specify a basePath that'll be the root of your directory structure.
	This is a server for development!
*/

export const IRI_STYLES = '/styles';
export const API_IRI_BLOCKS = '/api/blocks';
export const API_IRI_GLOBALS = '/api/globals';
export const FS_BLOCKS_SUBPATH = 'blocks';
export const FS_BLOCKS_FILENAME = 'interpreters.json';
export const FS_GLOBALS_FILENAME = 'globals.json';
export const REQ_PATH_DETERMINING_KEY = 'nameSelf';

const basePathDefault = './';
const portDefault: number | string = process.env.PORT || 5000;

export function editorToFileSystem(
	basePath?: string,
	mainItpt?: string,
	srvrPort?: number,
	chainCall?: (chainedApp: express.Application) => void
) {
	if (!basePath) {
		console.log('path not set: using default path');
		basePath = basePathDefault;
	}
	if (!srvrPort) {
		console.log('port not set: using default port');
		srvrPort = Number(portDefault);
	}

	let isDirModified = false;
	const resolvedBasePath = path.resolve(basePath);
	const resolvedBlockPath = path.join(resolvedBasePath, FS_BLOCKS_SUBPATH);
	fs.mkdirSync(resolvedBasePath, { recursive: true });
	fs.mkdirSync(resolvedBlockPath, { recursive: true });

	if (!mainItpt) {
		let indexItpt = {
			subItptOf: "c6c6d88d-00e9-4bf2-8c89-c2ebc1b9adbe",
			canInterpretType: "my-user/my-project/index-ObjectType",
			nameSelf: "my-user/my-project/index",
			ownKVLs: [
				{
					key: "InterpreterReferenceMapKey",
					value: {
						"c6c6d88d-00e9-4bf2-8c89-c2ebc1b9adbe": {
							subItptOf: "metaexplorer.io/baseContainer",
							canInterpretType: "metaexplorer.io/ContainerObjType",
							nameSelf: "c6c6d88d-00e9-4bf2-8c89-c2ebc1b9adbe",
							ownKVLs: [],
							crudSkills: "cRud",
							inKeys: []
						}
					},
					ldType: "InterpreterReferenceMapType"
				}
			],
			crudSkills: "cRud",
			inKeys: []
		};
		let userName = "my-user";
		let projectName = "my-project";
		let mainItptPath = userName + "/" + projectName;
		mainItpt = mainItptPath + "/index";
		mkdir(path.resolve(resolvedBlockPath + "/" + userName));
		mkdir(path.resolve(resolvedBlockPath + "/" + userName + "/" + projectName));
		//fs.mkdirSync(path.resolve(resolvedBlockPath + "/" + mainItptPath));
		fs.writeFileSync(path.join(resolvedBlockPath, mainItpt + ".json"), JSON.stringify(indexItpt));
	}

	createBlocksFromLib(mainItpt, resolvedBlockPath, basePath);
	// Create a new express application instance
	const app: express.Application = express();
	app.use(express.json());

	app.get(IRI_STYLES + "/*", (req, res, next) => {
		let localPath = req.path;
		localPath = localPath.replace("styles/", "");
		let stylePath = path.join(path.resolve(basePath), localPath);
		console.log(stylePath);
		res.sendFile(
			stylePath,
			(err) => { next(err); }
		);
	});

	/**
	 * GET call retrieves values to fill in the top-level redux state
	 */
	app.get(API_IRI_GLOBALS, (req, res) => {
		const globalsFilePath = path.join(resolvedBasePath, './' + FS_GLOBALS_FILENAME);
		if (!fs.existsSync(globalsFilePath)) {
			fs.writeFileSync(globalsFilePath, JSON.stringify({}));
		}
		res.sendFile(globalsFilePath);
	});

	/**
	 * POST call saves values from the top-level redux state
	 */
	app.post(API_IRI_GLOBALS, (req, res) => {
		const globalsFilePath = path.join(resolvedBasePath, './' + FS_GLOBALS_FILENAME);
		fs.writeFileSync(globalsFilePath, JSON.stringify(req.body));
		res.status(200).json({
			statusPayload: "saved!",
			status: 'success'
		});
	});

	/**
	 * GET call retrieves the json of all compound blocks, and builds it from the file
	 * system if needed
	 */
	app.get(API_IRI_BLOCKS, (req, res) => {
		if (isDirModified) {
			console.log("recreating blocks from filesystem");
			createBlocksFromLib(mainItpt, resolvedBlockPath, basePath);
		}
		isDirModified = false;
		res.sendFile(path.join(resolvedBasePath, './' + FS_BLOCKS_FILENAME));
	});

	/**
	 * POST call to save a single compound block in the file system, builds a subfolder-structure
	 * from the block's name
	 */
	app.post(API_IRI_BLOCKS, (req, res, next) => {
		const reqNameSelf: string = req.body[REQ_PATH_DETERMINING_KEY];
		let fileName = reqNameSelf;
		let subDir = "";
		if (reqNameSelf.indexOf('/') > 0) {
			const pathParts = reqNameSelf.split('/');
			fileName = pathParts.pop();
			subDir = pathParts.join('/');
		}
		fileName = fileName + '.json';
		//create path to save in
		let resolvedFullPath = path.join(resolvedBasePath, FS_BLOCKS_SUBPATH, subDir);
		fs.mkdir(resolvedFullPath, { recursive: true }, (err) => {
			if (err) next(err);
			fs.writeFileSync(path.join(resolvedFullPath, '/', fileName), JSON.stringify(req.body));
			res.status(200).json({
				statusPayload: "saved!",
				status: 'success'
			});
		});
		isDirModified = true;
	});

	if (chainCall) {
		chainCall(app);
	}

	app.listen(srvrPort, () => {
		console.log(`basePath set to: ${basePath}`);
		console.log(`Example app listening on port ${srvrPort}!`);
	});
}
