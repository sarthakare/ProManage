const crypto = require("crypto");

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
};

const comparePassword = (password, hashed) => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hashed.split(":");
    crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      resolve(key === derivedKey.toString("hex"));
    });
  });
};

module.exports = {
  hashPassword,
  comparePassword,
};
