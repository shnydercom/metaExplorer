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

module.exports = function createBlocksFromLib(mainItpt, startDir) {
	if(!mainItpt) throw new Error("you need to define a main interpreter/block")
	let concatenatedObj = {
		itptMetaInfo: [{}],
		itptList: [

		],
		mainItpt: mainItpt
	}
	const rootDir = path.resolve(startDir ? startDir : "blocks"); // or whatever directory you want to read
	readDirectory(rootDir, concatenatedObj);
	fs.writeFileSync("lib/interpreters.json", JSON.stringify(concatenatedObj));
}
