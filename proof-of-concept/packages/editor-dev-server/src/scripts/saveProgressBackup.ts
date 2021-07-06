/**
 * 
 * @param fileName 
 * @param fileContent 
 * @param saveInterval in milliseconds
 */
export function saveProgressBackup(fileName: string, fileContent: string, saveInterval: number) {
	// check if the last file with matching filename and timestamp justifies backup
	// 1. get a file list starting with the matching filename
	// 2. sort by filename, which sorts by datetime as well
	// 3. get latest filename from top of list
	// 4. extract datetime
	// 5. save new file if (now - datetime) > saveInterval
}
