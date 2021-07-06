/**
 * adjusted for TS from here: https://github.com/feross/clipboard-copy/blob/master/index.js
 * @param text string for copying, without styling
 */
export function copyToClipboard(text: string) {
	if (navigator.clipboard) {
		return navigator.clipboard.writeText(text).catch((err) => {
			throw (err !== undefined ? err : new DOMException('The request is not allowed', 'NotAllowedError'));
		});
	}

	var span = document.createElement('span');
	span.textContent = text;

	// Preserve consecutive spaces and newlines
	span.style.whiteSpace = 'pre';

	// Add the <span> to the page
	document.body.appendChild(span);

	// Make a selection object representing the range of text selected by the user
	var selection = window.getSelection();
	var range = window.document.createRange();
	selection.removeAllRanges();
	range.selectNode(span);
	selection.addRange(range);

	// Copy text to the clipboard
	var success = false;
	try {
		success = window.document.execCommand('copy');
	} catch (err) {
		console.log('error', err);
	}

	// Cleanup
	selection.removeAllRanges();
	window.document.body.removeChild(span);

	return success
		? Promise.resolve()
		: Promise.reject(new DOMException('The request is not allowed', 'NotAllowedError'));
}
