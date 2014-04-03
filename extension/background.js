function qrCodeRightClick(info, tab) {
    qrcode.decode(info.srcUrl);
}

var context = "image";
var title = "SQRL";
chrome.contextMenus.create({"title": title,
							"contexts":[context],
							"onclick": qrCodeRightClick});


qrcode.callback = function(data) {
	console.log(JSON.stringify(data));
	url = data.url;
	// sign this
	// send a request
};

function storeValue(key, value) {
	localStorage[key] = value;
}

function getValue(key) {
	return localStorage[key];
}

function setKeyName(name) {
	storeValue("keyname", name);
}

function getKeyName() {
	return getValue("keyname");
}

function setKeyText(keytext) {
	storeValue("keytext", keytext);
}

function getKeyText() {
	return getValue("keytext");
}

chrome.runtime.onMessage.addListener(
	function(request, send, response) {
		if(request.action == "newkey") {
			// store a new key
			setKeyName(request.keyname);
			setKeyText(request.keytext);
			response({"keyname": request.keyname});
		}
		else if(request.action == "keyname") {
			// send the current key name back to the popup
			response({"keyname": getKeyName()});
		}
	}
);

