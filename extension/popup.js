function sendMessage(data, callback) {
	chrome.runtime.sendMessage(data, callback);
}

function setKeyName(keyname) {
	document.getElementById("keyName").textContent = keyname == null ? "You don't have a key saved." :
													"Your current RSA key is " + keyname;
}

function requestKeyName() {
	sendMessage({"action": "keyname"}, function(response) {
		setKeyName(response.keyname);
	});
}

function sendNewKey(keyname, keytext) {
	var data = {"action": "newkey", "keyname": keyname, "keytext": keytext};
	sendMessage(data, function(response){
		setKeyName(response.keyname);
	});
}

function fileChangedHandler(event) {
	var file = event.target.files[0];
	console.log(file);
	// read this file into a string
	var reader = new FileReader();
	reader.onload = (function(file) {
		return function(e) {
			// send it to the background
			sendNewKey(file.name, e.target.result);
		};
	})(file);
	reader.readAsText(file);
}

window.onload = function() {
	requestKeyName();
	document.getElementById("keyFileInput").onchange = fileChangedHandler;;
};