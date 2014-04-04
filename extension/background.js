function storeObject(key, object) {
	localStorage[key] = JSON.stringify(object);
}

function getObject(key) {
	return JSON.parse(localStorage[key]);
}

function setKeyPair(keypair) {
	return storeObject("keypair", keypair);
}

function getKeyPair() {
	return getObject("keypair");
}

function keyPairIsSet() {
	return !(getKeyPair == undefined);
}

function qrCodeRightClickHandler(info, tab) {
    if(!keyPairIsSet()) {
    	return;
    }
    qrcode.decode(info.srcUrl);
}

// handle communication from the popup
chrome.runtime.onMessage.addListener(
	function(request, send, response) {
		if(request.action == "newkeypair") {
			// store a new key
			response();
			setKeyPair(request.keypair);
		}
		else if(request.action == "keypairinfo") {	
			// send the current key name back to the popup
			response({"keyset": keyPairIsSet(), "privkey": getKeyPair().private.name, "pubkey": getKeyPair().public.name});
		}
	}
);

// register into the context menus of images
chrome.contextMenus.create({"title": "SQRL",
							"contexts":["image"],
							"onclick": qrCodeRightClickHandler});


// define what happens when a qrcode is finished decoding
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
	// send a request

};