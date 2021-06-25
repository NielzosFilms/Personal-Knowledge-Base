const { decrypt, encrypt } = require("../server/resolvers/helpers/encryption");
const assert = require("assert");

const text =
	"This is my super secret testing text that i want to encrypt. Please don't read this :(";
const password = "best_password_ever";

const encryptedText = encrypt(text, password);
const decryptedText = decrypt(encryptedText, password);
assert.strictEqual(text, decryptedText);

const encryptedText_2 = encrypt(text, password);
const doDecryption = () => decrypt(encryptedText_2, "a_different_password");
assert.throws(doDecryption, Error);
