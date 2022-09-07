import {FsUtils} from "../lib/FsUtils";
import {t, extendLocale} from "../lib/i18n";

extendLocale({
  "file_view_as_image": {
      "en-US": "View as image",
      "zh-CN": "以图片形式查看",
      "zh-TW": "以圖片形式檢視",
      "ru-RU": "Прсм. изображение",
      "de-de": "Zeige als Bild"
  },
  "file_view_as_text": {
      "en-US": "View as text",
      "zh-CN": "以文本形式查看",
      "zh-TW": "以文字形式檢視",
      "ru-RU": "Просм. текст",
      "de-de": "Zeige als Text"
  },
  "file_view_as_bin": {
      "en-US": "View as binary",
      "zh-CN": "以文字形式檢視",
      "zh-TW": "以二進制形式查看",
      "ru-RU": "Просм. бинарно",
      "de-de": "Zeige binär"
  },
  "file_delete": {
      "en-US": "Delete",
      "zh-CN": "删除",
      "zh-TW": "刪除",
      "ru-RU": "Удалить",
      "de-de": "Löschen"
  },
})

class FileEditScreen {
  STYLE_BUTTON = {
    normal_color: 0x111111,
    press_color: 0x222222,
    x: 12,
    w: 168,
    h: 56
  }

  constructor(data) {
    this.path = data;
  }

  start() {
    // Stats
    let posY = 72;
    let text = this.path + "\n", fileSize = 0;
    try {

      const [st, e] = FsUtils.stat(this.path);

      if(st.size) {
        text += "Size: " + FsUtils.printBytes(st.size) + "\n";
        fileSize = st.size;
      }

    } catch(e) {
      console.warn(e);
    }

    let textLayout = hmUI.getTextLayout(text, {text_size: 18, text_width: 168})
    let textHeight = textLayout.height;
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 12,
      y: posY,
      w: 168,
      h: textHeight,
      text_size: 18,
      color: 0xffffff,
      text_style: hmUI.text_style.WRAP,
      text
    });

    posY += textHeight + 12;

    // Open btns
    if(fileSize > 0) {
      if(this.path.endsWith(".png")) {
        this.addViewAsImageButton(posY);
        posY += 64;
      }

      this.addViewAsTextButton(posY);
      posY += 64;

      this.addViewAsBinaryButton(posY);
      posY += 64;
    }

    // Delete btn
    if(this.path.startsWith("/storage/")) hmUI.createWidget(hmUI.widget.BUTTON, {
      ...this.STYLE_BUTTON,
      y: posY,
      color: 0xff0000,
      text: t("file_delete"),
      click_func: () => this.delete()
    })
  }

  addViewAsImageButton(y) {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...this.STYLE_BUTTON,
      y,
      text: t("file_view_as_image"),
      click_func: () => {
        hmApp.gotoPage({
          url: "page/ImageViewScreen",
          param: this.prepareTempFile(this.path)
        });
      }
    });
  }

  addViewAsTextButton(y) {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...this.STYLE_BUTTON,
      y,
      text: t("file_view_as_text"),
      click_func: () => {
        hmApp.gotoPage({
          url: "page/TextViewScreen",
          param: this.path
        });
      }
    });
  }

  addViewAsBinaryButton(y) {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...this.STYLE_BUTTON,
      y,
      text: t("file_view_as_bin"),
      click_func: () => {
        hmApp.gotoPage({
          url: "page/HexdumpScreen",
          param: this.path
        });
      }
    })
  }

  delete() {
    FsUtils.rmTree(this.path);
    hmApp.goBack();
  }

  prepareTempFile(sourcePath) {
    const current = hmFS.SysProGetChars("mmk_tb_temp");
    if(current) {
      const path = FsUtils.fullPath(current);
      hmFS.remove(path);
    }

    const data = FsUtils.read(sourcePath);
    const newFile = "temp_" + Math.round(Math.random() * 100000) + ".png";
    const dest = hmFS.open_asset(newFile, hmFS.O_WRONLY | hmFS.O_CREAT);
    hmFS.seek(dest, 0, hmFS.SEEK_SET);
    hmFS.write(dest, data, 0, data.byteLength);
    hmFS.close(dest);

    hmFS.SysProSetChars("mmk_tb_temp", newFile);
    return newFile;
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    new FileEditScreen(p).start();
  }
});
