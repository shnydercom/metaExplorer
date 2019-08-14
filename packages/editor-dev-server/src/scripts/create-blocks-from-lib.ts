const fs = require('fs');
const path = require('path')

function readDirectory(sourceDir, cObj) {
	fs.readdirSync(sourceDir).forEach((file) => {
		console.log(file);
		// you may want to filter these by extension, etc. to make sure they are JSON files
		if (file.endsWith("json")) {
			let newContent = fs.readFileSync(sourceDir + "/" + file, "utf8");
			let newJson = JSON.parse(newContent);
			cObj.itptList.push(newJson);
		} else {
			//is a directory or will fail
			try {
				readDirectory(sourceDir + "/" + file, cObj);
			} catch (error) {
				console.log(error)
			}
		}
	});
}

export function createBlocksFromLib(mainItpt, startDir, libPath) {
	if (!mainItpt) throw new Error("you need to define a main interpreter/block")
	if (!libPath) libPath = 'lib';
	let concatenatedObj = {
		itptMetaInfo: [{}],
		itptList: [

		],
		mainItpt: mainItpt
	}
	const rootDir = path.resolve(startDir ? startDir : "blocks"); // or whatever directory you want to read
	readDirectory(rootDir, concatenatedObj);
	fs.mkdir(libPath, { recursive: true }, (err) => {
		if (err) throw err;
	});
	fs.writeFileSync(libPath + "/interpreters.json", JSON.stringify(concatenatedObj));
}
