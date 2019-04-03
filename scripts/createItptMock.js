const fs = require('fs');
const path = require('path')

// an array of filenames to concat
const files = [];

let concatenatedObj = {
	itptMetaInfo: [{}],
	itptList: [

	],
	mainItpt: "shnyder/meta-explorer/MainAppEntryPoint"
}

const rootDir = path.resolve("demos"); // or whatever directory you want to read
function readDirectory(sourceDir) {
	fs.readdirSync(sourceDir).forEach((file) => {
		console.log(file);
		// you may want to filter these by extension, etc. to make sure they are JSON files
		if (file.endsWith("json")) {
			let newContent = fs.readFileSync(sourceDir + "/" + file, "utf8");
			let newJson = JSON.parse(newContent);
			concatenatedObj.itptList.push(newJson);
		} else {
			//is a directory or will fail
			try {
				readDirectory(sourceDir + "/" + file);
			} catch (error) {

			}
		}
	});
}
readDirectory(rootDir);
//console.log(concatenatedObj);

fs.writeFileSync("mocks/interpreters.json", JSON.stringify(concatenatedObj));