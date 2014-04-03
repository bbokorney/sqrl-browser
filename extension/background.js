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

function setKeyName(name) {
	chrome.storage.local["keyname"] = name;
}

function getKeyName() {
	return chrome.storage.local["keyname"];
}

chrome.runtime.onMessage.addListener(
	function(request, send, response) {
		if(request.action == "newkey") {
			// store a new key
		}
		else if(request.action == "keyname") {
			response({"keyname": getKeyName()});
		}
	}

);

