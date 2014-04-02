function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));

  qrcode.decode(info.srcUrl);
}

var context = "image";
var title = "SQRL";
chrome.contextMenus.create({"title": title,
							"contexts":[context],
							"onclick": genericOnClick});


qrcode.callback = function(data) {
	console.log(JSON.stringify(data));
	
};

chrome.storage.local["test"] = "test value.";

