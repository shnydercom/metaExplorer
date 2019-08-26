import express from 'express';
import path from 'path';
import fs from 'fs';
import { createBlocksFromLib } from './scripts/create-blocks-from-lib';
/*
	this server will save blocks to the file system, 
	building a directory structure dependent on the IRI of the "nameSelf"-property.
	You can specify a basePath that'll be the root of your directory structure.
	This is a server for development!
*/

const API_IRI_BLOCKS = '/api/blocks';
const FS_BLOCKS_SUBPATH = 'blocks';
const REQ_PATH_DETERMINING_KEY = 'nameSelf';

const basePathDefault = './';
const portDefault: number | string = process.env.PORT || 5000;

export function editorToFileSystem(basePath?: string, srvrPort?: number) {
	if (!basePath) {
		console.log('path not set: using default path');
		basePath = basePathDefault;
	}
	if (!srvrPort) {
		console.log('port not set: using default port');
		srvrPort = Number(portDefault);
	}
	let isDirModified = false;
	let resolvedBasePath = path.resolve(basePath);
	let resolvedBlockPath = path.join(resolvedBasePath, 'blocks');
	fs.mkdirSync(resolvedBasePath, { recursive: true });
	fs.mkdirSync(resolvedBlockPath, { recursive: true });
	createBlocksFromLib(basePath + "/index", resolvedBlockPath, basePath);
	// Create a new express application instance
	const app: express.Application = express();
	app.use(express.json());

	app.get(API_IRI_BLOCKS, function (req, res) {
		res.sendFile(path.join(resolvedBasePath, './interpreters.json'));
		if (isDirModified) {
			createBlocksFromLib(basePath + "/index", resolvedBlockPath, basePath);
		}
		isDirModified = false;
	});

	app.post(API_IRI_BLOCKS, (req, res) => {
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
			if (err) throw err;
			fs.writeFileSync(path.join(resolvedFullPath, '/', fileName), JSON.stringify(req.body));
			res.sendStatus(200);
		});
		isDirModified = true;
	});

	app.listen(srvrPort, function () {
		console.log(`basePath set to: ${basePath}`);
		console.log(`Example app listening on port ${srvrPort}!`);
	});
}