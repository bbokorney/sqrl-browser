var button = document.getElementById("testbtn");
button.onclick = function() {
	console.log(chrome.storage.local["test"]);
}