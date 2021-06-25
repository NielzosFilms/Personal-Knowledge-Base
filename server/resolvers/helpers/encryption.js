const crypto = require("crypto");

const algorithm = "aes-192-cbc";
const iv = crypto.randomBytes(16);

const encrypt = (text, password) => {
	try {
		const key = crypto.scryptSync(password, "salt", 24);
		const cipher = crypto.createCipheriv(algorithm, key, iv);
		return cipher.update(text, "utf8", "hex") + cipher.final("hex");
	} catch (e) {
		throw new Error("Could not encrypt.");
	}
};

const decrypt = (encrypted, password) => {
	try {
		const key = crypto.scryptSync(password, "salt", 24);
		const decipher = crypto.createDecipheriv(algorithm, key, iv);
		return (
			decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8")
		);
	} catch (e) {
		throw new Error("Could not decrypt.");
	}
};

module.exports = {
	encrypt,
	decrypt,
};
