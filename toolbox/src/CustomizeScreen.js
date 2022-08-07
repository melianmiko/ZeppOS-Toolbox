class CustomizeScreen {
  userTiels = null;

  _listTiles() {
    let tiles = ["apps", "files"]

    try {
      tiles = FsUtils.fetchJSON("settings.json").tiles;
    } catch(e) {
      console.warn(e);
    }

    return tiles;
  }

  start () {
    this.userTiles = this._listTiles();

    Object.keys(QS_BUTTONS).forEach((id, i) => {
      const config = QS_BUTTONS[id];
      if(!config) return;

      const x = 12 + (i % 2) * 90;
      const y = 164 + Math.floor(i / 2) * 90;

      const btn = hmUI.createWidget(hmUI.widget.IMG, {
        x,
        y,
        w: 78,
        h: 78,
        alpha: this.userTiles.indexOf(id) > -1 ? 255 : 100,
        src: id + ".png",
      });

      btn.addEventListener(hmUI.event.CLICK_UP, () => {
        hmUI.showToast({text: config.description})
        this._toggleTile(id, btn);
      });
    });

    const end_y = 176 + Math.ceil(Object.keys(QS_BUTTONS).length / 2) * 90;
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: end_y,
      w: 192,
      h: 72,
      text: ""
    });
  }

  finish() {
    const settings = FsUtils.fetchJSON("settings.json");

    settings.tiles = this.userTiles;
    FsUtils.writeText("settings.json", JSON.stringify(settings));
  }

  _toggleTile(id, btn) {
    const ind = this.userTiles.indexOf(id);

    if(ind < 0) {
      this.userTiles.push(id);
      btn.setProperty(hmUI.prop.MORE, {alpha: 255})
    } else {
      this.userTiles = this.userTiles.filter((i) => i !== id);
      console.log(this.userTiles);
      btn.setProperty(hmUI.prop.MORE, {alpha: 100})
    }
  }
}
