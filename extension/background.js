var STATUS_TEXT = "Normal";

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

function setStatus(color, message) {
	chrome.browserAction.setIcon({path: "icon128-"+color+".png"});
	STATUS_TEXT = message;
}

function qrCodeRightClickHandler(setStatus, STATUS_TEXT) {
    return function(info, tab) {
	    if(!keyPairIsSet()) {
	    	setStatus("red", "No key set.");
	    	return;
	    }
		setStatus("yellow", "Authenticating...");
	    qrcode.decode(info.srcUrl);
	};
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
							"onclick": qrCodeRightClickHandler(setStatus, STATUS_TEXT)});

// define what happens when a qrcode is finished decoding
qrcode.callback = function(data) {
	url = data;
	// sign this
	// get the RSA key
	var privkeytext = getKeyPair().private.text;
	var pubkeytext = getKeyPair().public.text.trim().replace(/\r\n/g, "\n");
	var key = new RSAKey();
	key.readPrivateKeyFromPEMString(privkeytext);
	var sig = hex2b64(key.signString(url, "sha256"));
	// send a request
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(request.readyState === 4) {
			var response = JSON.parse(request.responseText);
			if(response.success) {
				setStatus("green", "Login successful.");
			}
			else {
				setStatus("red", "Login failed.");
			}
		}
	};
	request.open("POST", url);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.send("idk="+encodeURIComponent(btoa(pubkeytext))+"&sig="+ encodeURIComponent(sig));
};