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

function sendNewKey(key) {
	var data = {"action": "newkey", "key": key};
	sendMessage(data, function(response){
		setKeyName(response.keyname);
	});
}

function fileChangedHandler(event) {
	var file = event.target.files;
	console.log(event.target);
	console.log(file[0].name);
}

window.onload = function() {
	requestKeyName();
	document.getElementById("keyFileInput").onchange = fileChangedHandler;;
};