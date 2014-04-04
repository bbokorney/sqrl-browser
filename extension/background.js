function qrCodeRightClick(info, tab) {
    qrcode.decode(info.srcUrl);
}

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

var context = "image";
var title = "SQRL";
chrome.contextMenus.create({"title": title,
							"contexts":[context],
							"onclick": qrCodeRightClick});


qrcode.callback = function(data) {
	url = data;
	// sign this
	// get the RSA key
	var keytext = getKeyText();
	if(keytext == "") {
		return;
	}
	var key = new RSAKey();
	key.readPrivateKeyFromPEMString(keytext);
	var base64 = hex2b64(key.signString(url, "sha256"));
	console.log(base64);
	// send a request
};