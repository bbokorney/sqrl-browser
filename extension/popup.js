function sendMessage(data, callback) {
	chrome.runtime.sendMessage(data, callback);
}

function setKeyPairInfo(keyset, privkey, pubkey) {
	document.getElementById("keyname").innerHTML = keyset ? "Your current key info:<br>Private: " + privkey + "<br>Public: " + pubkey :
																"You don't have a key saved.";
													
}

function requestKeyPairInfo() {
	sendMessage({"action": "keypairinfo"}, function(response) {
		setKeyPairInfo(response.keyset, response.privkey, response.pubkey);
	});
}

function sendNewKey(keypair) {
	var data = {"action": "newkeypair", "keypair": keypair};
	sendMessage(data, function() {});
}

function sendKeyPairIfReady(myFilename, otherFilename, otherFileReader, private) {
	return function(e) {
		// check if the other file reader is done
		var myKey = new KeyFile(myFilename, e.target.result);
		if(otherFileReader.result) {
			// construct the keypair
			var otherKey = new KeyFile(otherFilename, otherFileReader.result);
			var keypair = new KeyPair();
			if(private) {
				keypair.private = myKey;
				keypair.public = otherKey;
			}
			else {
				keypair.private = otherKey;
				keypair.public = myKey;	
			}
			// send the result
			sendNewKey(keypair);
		}
	};
}

function uploadFileHandler(event) {
	var privKeyFile = document.getElementById("privKeyFileInput").files[0];
	var pubKeyFile = document.getElementById("pubKeyFileInput").files[0];

	// read this file into a string
	var privFileReader = new FileReader();
	var pubFileReader = new FileReader();
	
	privFileReader.onload = sendKeyPairIfReady(privKeyFile.name, pubKeyFile.name, pubFileReader, true);
	privFileReader.readAsText(privKeyFile);
	pubFileReader.onload = sendKeyPairIfReady(pubKeyFile.name, privKeyFile.name, privFileReader, false);
	pubFileReader.readAsText(pubKeyFile);
}

window.onload = function() {
	requestKeyPairInfo();
	document.getElementById("upload").onclick = uploadFileHandler;
};