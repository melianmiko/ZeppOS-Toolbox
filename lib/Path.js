const deviceID = hmSetting.getDeviceInfo().deviceName;
export const isMiBand7 = deviceID === "Xiaomi Smart Band 7";

// This shit works on Mi Band 7 and both Amazfit =)
export class Path {
  constructor(scope, path) {
    if(path[0] != "/") path = "/" + path;

    this.scope = scope;
    this.path = path;

    if (scope === "assets") {
      this.relativePath = path;
      this.absolutePath = FsTools.fullAssetPath(path);
    } else if (scope === "data") {
      this.relativePath = path;
      this.absolutePath = FsTools.fullDataPath(path);
    } else if (scope === "full") {
      this.relativePath = `../../../${path.substring(9)}`;
      if(this.relativePath.endsWith("/"))
        this.relativePath = this.relativePath.substring(0, this.relativePath.length - 1);
      this.absolutePath = path;
    } else {
      throw new Error("Unknown scope provided")
    }
  }

  get(path) {
    return new Path(this.scope, `${this.path}/${path}`);
  }

  resolve() {
    return new Path("full", this.absolutePath);
  }

  stat() {
    if (this.scope == "data") {
      return hmFS.stat(this.relativePath);
    } else {
      return hmFS.stat_asset(this.relativePath);
    }
  }

  size() {
    const [st, e] = this.stat();
    if(st.size) {
      // Is file, nothing to do anymore
      return st.size;
    }

    let output = 0;
    for(const file of this.list()[0]) {
      output += this.get(file).size();
    }

    return output;
  }

  open(flags) {
    if (this.scope === "data") {
      this._f = hmFS.open(this.relativePath, flags);
    } else {
      this._f = hmFS.open_asset(this.relativePath, flags);
    }

    console.log(this._f);

    return this._f;
  }

  remove() {
    if(this.scope == "assets") 
      return this.resolve().remove();

    try {
      hmFS.remove(isMiBand7 ? this.absolutePath : this.relativePath);
      return true;
    } catch (e) {
      return false;
    }
  }

  removeTree() {
    // Recursive !!!
    const [files, e] = this.list();
    for(let i in files) {
      this.get(files[i]).removeTree();
    }

    this.remove();
  }

  fetch(limit = Infinity) {
    const [st, e] = this.stat();
    if (e != 0) return null;

    const length = Math.min(limit, st.size);
    const buffer = new ArrayBuffer(st.size);
    this.open(hmFS.O_RDONLY);
    this.read(buffer, 0, length);
    this.close();

    return buffer;
  }

  fetchText(limit = Infinity) {
    const buf = this.fetch(limit);
    const view = new Uint8Array(buf);
    return FsTools.decodeUtf8(view, limit)[0];
  }

  fetchJSON() {
    return JSON.parse(this.fetchText());
  }

  override(buffer) {
    this.remove();

    this.open(hmFS.O_WRONLY | hmFS.O_CREAT);
    this.write(buffer, 0, buffer.byteLength);
    this.close();
  }

  overrideWithText(text) {
    return this.override(FsTools.strToUtf8(text));
  }

  overrideWithJSON(data) {
    return this.overrideWithText(JSON.stringify(data));
  }

  copy(destEntry) {
    const buf = this.fetch();
    destEntry.override(buf);
  }

  copyTree(destEntry, move = false) {
    // Recursive !!!
    if(this.isFile()) {
      this.copy(destEntry);
    } else {
      dest.mkdir();
      for(const file of this.list()[0]) {
        this.get(file).copyTree(destEntry.get(file));
      }
    }

    if(move) this.removeTree();
  }

  isFile() {
    const [st, e] = this.stat();
    return e == 0 && (st.mode & 32768) != 0;
  }

  isFolder() {
    if(this.absolutePath == "/storage") return true;
    const [st, e] = this.stat();
    return e == 0 && (st.mode & 32768) == 0;
  }

  exists() {
    return this.stat()[1] == 0;
  }

  list() {
    return hmFS.readdir(isMiBand7 ? this.absolutePath : this.relativePath);
  }

  mkdir() {
    return hmFS.mkdir(isMiBand7 ? this.absolutePath : this.relativePath);
  }

  seek(val) {
    hmFS.seek(this._f, val, hmFS.SEEK_SET);
  }

  read(buffer, offset, length) {
    hmFS.read(this._f, buffer, offset, length)
  }

  write(buffer, offset, length) {
    hmFS.write(this._f, buffer, offset, length)
  }

  close() {
    hmFS.close(this._f);
  }
}

export class FsTools {
  static getAppLocation() {
    if (FsTools.overrideAppPage) {
      return FsTools.overrideAppPage;
    }

    const packageInfo = hmApp.packageInfo();
    const idn = packageInfo.appId.toString(16).padStart(8, "0").toUpperCase();
    return [`js_${packageInfo.type}s`, idn];
  }

  static fullAssetPath(path) {
    const [base, idn] = FsTools.getAppLocation();
    return `/storage/${base}/${idn}/assets${path}`;
  }

  static fullDataPath(path) {
    const [base, idn] = FsTools.getAppLocation();
    return `/storage/${base}/data/${idn}${path}`;
  }

  // https://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
  static strToUtf8(str) {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
        utf8.push(0xc0 | (charcode >> 6),
          0x80 | (charcode & 0x3f));
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(0xe0 | (charcode >> 12),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f));
      } else {
        i++;
        charcode = 0x10000 + (((charcode & 0x3ff) << 10) |
          (str.charCodeAt(i) & 0x3ff));
        utf8.push(0xf0 | (charcode >> 18),
          0x80 | ((charcode >> 12) & 0x3f),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f));
      }
    }

    return new Uint8Array(utf8).buffer;
  }

  // source: https://stackoverflow.com/questions/13356493/decode-utf-8-with-javascript
  static decodeUtf8(array, outLimit = Infinity, startPosition = 0) {
    let out = "";
    let length = array.length;

    let i = startPosition,
      c, char2, char3;
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
    return FsTools.decodeUtf8(array)[0];
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
