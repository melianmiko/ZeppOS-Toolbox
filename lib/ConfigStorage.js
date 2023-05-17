// import { Path, isMiBand7 } from "../lib/Path";
import { FsUtils } from "./FsUtils";

export class ConfigStorage {
  constructor(path, defaults) {
    this.path = path;
    this.data = defaults ? defaults : {};
  }

  get(key, fallback=null) {
    if(this.data[key] !== undefined) return this.data[key];
    return fallback;
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  update(rows) {
    for(let key in rows)
      this.data[key] = rows[key];
    this.save();
  }

  save() {
    const text = JSON.stringify(this.data);
    FsUtils.writeText(this.path, text);
  }

  load() {
    try {
      this.data = FsUtils.fetchJSON(this.path);
    } catch(e) {}
  }
}