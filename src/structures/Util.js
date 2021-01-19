const { readdirSync, lstatSync } = require("fs");
const { join, extname } = require("path");

module.exports = class Util {
  constructor() {
    throw new Error("Util cannot be instanced.");
  }

  static walk(dir, files = []) {
    for (const file of readdirSync(dir)) {
      const path = join(dir, file);

      if (lstatSync(path).isDirectory()) {
        files.concat(this.walk(path, files));
      } else {
        if (extname(path) !== ".js") {
          continue;
        }

        files.push(path);
      }
    }

    return files;
  }

  static toArray(value) {
    if (Array.isArray(value)) {
      return value;
    } else {
      return [value];
    }
  }
};
