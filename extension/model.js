function KeyFile(name, text) {
	this.name = name;
	this.text = text;
}

function KeyPair() {
	this.public = new KeyFile();
	this.private = new KeyFile();
}