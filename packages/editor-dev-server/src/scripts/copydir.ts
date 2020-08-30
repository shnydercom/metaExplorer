import fs, { copyFileSync } from 'fs';
import path from 'path';

//inspired&copied from here: https://gist.github.com/tkihira/3014700
export let mkdir = (dir) => {
	// making directory without exception if exists
	try {
		fs.mkdirSync(dir, '0755');
	} catch (e) {
		if (e.code !== "EEXIST") {
			throw e;
		}
	}
};

export let copyDir = (src, dest) => {
	mkdir(dest);
	var files = fs.readdirSync(src);
	for (var i = 0; i < files.length; i++) {
		var current = fs.lstatSync(path.join(src, files[i]));
		if (current.isDirectory()) {
			copyDir(path.join(src, files[i]), path.join(dest, files[i]));
		} else if (current.isSymbolicLink()) {
			var symlink = fs.readlinkSync(path.join(src, files[i]));
			fs.symlinkSync(symlink, path.join(dest, files[i]));
		} else {
			copyFileSync(path.join(src, files[i]), path.join(dest, files[i]));
		}
	}
};
