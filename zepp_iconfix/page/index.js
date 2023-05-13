import overrides from "../generator/overrides";
import {FsUtils} from "../../lib/FsUtils";

function makeOverride() {
  let count = 0;

  for(const assetNmae in overrides) {
    const outputPath = overrides[assetNmae];
    const [st, e] = FsUtils.stat(outputPath);

    if(e == 0) {
      const sourcePath = FsUtils.fullPath(assetNmae);
      FsUtils.copy(sourcePath, outputPath);
      count++;
    }
  }

  return count;
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    const count = makeOverride();
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      color: 0xFFFFFF,
      text_size: 20,
      text_style: hmUI.text_style.WRAP,
      text: `Replaced ${count} files.\n\nPlease reboot to apply changes`
    })
  },
});
