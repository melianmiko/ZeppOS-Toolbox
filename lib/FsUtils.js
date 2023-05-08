export class FsUtils {
	static writeText(fn, data) {
		if(!fn.startsWith("/storage")) fn = FsUtils.fullPath(fn);

		try {
			hmFS.remove(fn);
		} catch(e) {}

		const buffer = FsUtils.strToUtf8(data);
		const f = FsUtils.open(fn, hmFS.O_WRONLY | hmFS.O_CREAT);
		hmFS.write(f, buffer, 0, buffer.byteLength);
		hmFS.close(f);
	}

	static read(fn, limit=false) {
		if(!fn.startsWith("/storage")) fn = FsUtils.fullPath(fn);
		const [st, e] = FsUtils.stat(fn);
		const f = FsUtils.open(fn, hmFS.O_RDONLY);

		const size = limit ? limit : st.size;
		const data = new ArrayBuffer(size);
		hmFS.read(f, data, 0, size);
		hmFS.close(f);

		return data;
	}

	static fetchTextFile(fn, limit=false) {
		const data = FsUtils.read(fn, limit);

		const view = new Uint8Array(data);
		let str = "";

		return FsUtils.Utf8ArrayToStr(view);
	}

	static stat(path) {
		path = FsUtils.fixPath(path);
    return hmFS.stat_asset(path);
  }

  static fixPath(path) {
    if(path.startsWith("/storage")) {
      const statPath = "../../../" + path.substring(9);
      return statPath;
    }
    return path;
  }

	static open(path, m) {
      if(path.startsWith("/storage")) {
        const statPath = "../../../" + path.substring(9);
        return hmFS.open_asset(statPath, m);
      }

      return hmFS.open(path, m);
	}

	static fetchJSON(fn) {
		const text = FsUtils.fetchTextFile(fn);
		return JSON.parse(text);
	}

	static copy(source, dest) {
		try {
			hmFS.remove(dest);
		} catch(e) {}

		const buffer = FsUtils.read(source);
		const f = FsUtils.open(dest, hmFS.O_WRONLY | hmFS.O_CREAT);
		hmFS.write(f, buffer, 0, buffer.byteLength);
		hmFS.close(f);
	}

	static isFolder(path) {
	  const [st, e] = FsUtils.stat(path);
	  return (st.mode & 32768) == 0;
	}

	static getSelfPath() {
		if(!FsUtils.selfPath) {
			const pkg = hmApp.packageInfo();
			const idn = pkg.appId.toString(16).padStart(8, "0").toUpperCase();
			return "/storage/js_" + pkg.type + "s/" + idn;
		}

		return FsUtils.selfPath;
	}

	static fullPath(path) {
		return `${FsUtils.getSelfPath()}/assets/${path}`;
	}

	static rmTree(path) {
		if(!path.startsWith("/storage")) path = FsUtils.fullPath(path);

    const [files, e] = hmFS.readdir(path);
    for(let i in files) {
      FsUtils.rmTree(path + "/" + files[i]);
    }

    hmFS.remove(path);
	}

	static copyTree(source, dest, removeSource) {
		if(!source.startsWith("/storage")) source = FsUtils.fullPath(source);
		if(!dest.startsWith("/storage")) dest = FsUtils.fullPath(dest);

		if(!FsUtils.isFolder(source)) {
			console.log("copy", source, "->", dest);
			FsUtils.copy(source, dest);
		} else {
	    const [files, e] = hmFS.readdir(source);
	    hmFS.mkdir(dest);
	    for(let i in files) {
	      FsUtils.copyTree(source + "/" + files[i], dest + "/" + files[i], removeSource);
	    }
		}

    if(removeSource) {
    	console.log("Delete", source);
    	hmFS.remove(source);
    }
	}

	static sizeTree(path) {
		if(!path.startsWith("/storage")) path = FsUtils.fullPath(path);

    const [files, e] = hmFS.readdir(path);
    let value = 0;

    for(let fn in files) {
      const file = path + "/" + files[fn];
      const statPath = "../../../" + file.substring(9);
      const [st, e] = hmFS.stat_asset(statPath);
      value += st.size ? st.size : FsUtils.sizeTree(file);
    }

    return value;
	}

	// https://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
	static strToUtf8(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        } else {
            i++;
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }

    return new Uint8Array(utf8).buffer;
	}

	// source: https://stackoverflow.com/questions/13356493/decode-utf-8-with-javascript
	static decodeUtf8(array, outLimit=Infinity, startPosition=0) {
		let out = "";
		let length = array.length;

		let i = startPosition, c, char2, char3;
		while (i < length && out.length < outLimit) {
			c = array[i++];
			switch (c >> 4) {
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
					// 0xxxxxxx
					out += String.fromCharCode(c);
					break;
				case 12:
				case 13:
					// 110x xxxx   10xx xxxx
					char2 = array[i++];
					out += String.fromCharCode(
						((c & 0x1f) << 6) | (char2 & 0x3f)
					);
					break;
				case 14:
					// 1110 xxxx  10xx xxxx  10xx xxxx
					char2 = array[i++];
					char3 = array[i++];
					out += String.fromCharCode(
						((c & 0x0f) << 12) |
							((char2 & 0x3f) << 6) |
							((char3 & 0x3f) << 0)
					);
					break;
			}
		}

		return [out, i - startPosition];
	}

	static Utf8ArrayToStr(array) {
		return FsUtils.decodeUtf8(array)[0];
	}

	static printBytes(val) {
		if(this.fsUnitCfg === undefined)
			this.fsUnitCfg = hmFS.SysProGetBool("mmk_tb_fs_unit");

    const options = this.fsUnitCfg ? ["B", "KiB", "MiB"] : ["B", "KB", "MB"];
  	const base = this.fsUnitCfg ? 1024 : 1000;

    let curr = 0;
    while (val > 800 && curr < options.length) {
      val = val / base;
      curr++;
    }

    return Math.round(val * 100) / 100 + " " + options[curr];
  }
}
