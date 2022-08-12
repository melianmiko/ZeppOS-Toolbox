class FileEditScreen {
  STYLE_BUTTON = {
    normal_color: 0x111111,
    press_color: 0x222222,
    x: 12,
    w: 168,
    h: 64,
  }

  constructor(data) {
    this.path = data.path;
  }

  start() {
    // Stats
    let posY = 72;
    let text = this.path + "\n\n", fileSize = 0;
    try {

      const [st, e] = FsUtils.stat(this.path);

      for(let key in st)
        text += key + ": " + st[key] + "\n";

      if(st.size)
        fileSize = st.size;

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
        posY += 76;
      }

      this.addViewAsTextButton(posY);
      posY += 76;

      this.addViewAsBinaryButton(posY);
      posY += 76;
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
        gotoSubpage('view_image', {
          file: this.prepareTempFile(this.path)
        })
      }
    });
  }

  addViewAsTextButton(y) {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...this.STYLE_BUTTON,
      y,
      text: t("file_view_as_text"),
      click_func: () => {
        gotoSubpage('view_text', {
          file: this.path
        })
      }
    });
  }

  addViewAsBinaryButton(y) {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...this.STYLE_BUTTON,
      y,
      text: t("file_view_as_bin"),
      click_func: () => {
        gotoSubpage("view_hexdump", {
          path: this.path
        })
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
