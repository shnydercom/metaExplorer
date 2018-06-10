var http = require('http');
var fs = require('fs');
console.log('********* downloading swagger-codegen-cli *********');
//TODO: update to 3.0 once typescript-fetch is available there
let swaggergenurl = 'http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/2.3.1/swagger-codegen-cli-2.3.1.jar';
let destURL = './tooling/swagger-codegen-cli.jar'
var download = function (url, dest, cb) {
	var file = fs.createWriteStream(dest);
	var request = http.get(url, function (response) {
		response.pipe(file);
		file.on('finish', function () {
			file.close(cb); // close() is async, call cb after close completes.
		});
	}).on('error', function (err) { // Handle errors
		fs.unlink(dest); // Delete the file async. (But we don't check the result)
		if (cb) cb(err.message);
	});
};

download(swaggergenurl, destURL, (err) => {
	if (err)
		console.log('could not download');
	else
		console.log('********* swagger-codegen-cli downloaded  ********');
})