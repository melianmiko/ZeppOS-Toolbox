import { AppGesture } from "../../lib/AppGesture";

class ImageViewScreen {
	constructor(data) {
		this.path = data;
	}

	start() {
      // Read TGA image header
      const f = hmFS.open_asset(this.path, hmFS.O_RDONLY);
      const header = new Uint8Array(18);
      hmFS.seek(f, 0, hmFS.SEEK_SET);
      hmFS.read(f, header.buffer, 0, 18);
      hmFS.close(f);

      const width = (header[13] << 8) + header[12];
      const height = (header[15] << 8) + header[14];

      hmUI.showToast({text: width + "x" + height});

      hmUI.createWidget(hmUI.widget.IMG, {
        x: (192 - width) / 2,
        y: (490 - height) / 2,
        src: this.path
      });
	}
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/ImageViewScreen",
      param: p,
    });
    AppGesture.init();
    new ImageViewScreen(p).start();
  }
});
