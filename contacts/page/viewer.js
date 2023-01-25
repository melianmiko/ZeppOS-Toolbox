import {SettingsListScreen} from "../../lib/SettingsListScreen";
import {ContactStorage} from "../src/ContactStorage";

import {EDITABLE_PROPS} from "../src/constants";

class ViewerScreen extends SettingsListScreen {
  constructor(id) {
    super();
    this.deleteConfirm = false;
    this.id = id;

    this.STYLE_HEADLINE.color = 0xAAAAAA;
  }

  build() {
    const data = ContactStorage.find(this.id);
    console.log(data);

    hmUI.createWidget(hmUI.widget.IMG, {
      x: 4,
      y: this.posY,
      src: "people_big.png"
    })

    this.posY += 56;

    this.h1(data.name);

    Object.keys(EDITABLE_PROPS).forEach((prop) => {
      if(!data[prop]) return;
      this.headline(EDITABLE_PROPS[prop]);
      this.text(data[prop]);
      this.posY += 8;
    });

    this.clickableItem("Изменить", "edit.png", () => {
      hmApp.gotoPage({url: 'page/editor', param: this.id});
    });
    this.clickableItem("Удалить", "delete.png", () => {
      if(!this.deleteConfirm) {
        hmUI.showToast({text: "Нажмите ещё раз"});
        this.deleteConfirm = true;
        return;
      }

      ContactStorage.delete(this.id);
      hmApp.goBack();
    });
  }
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(id) {
    (new ViewerScreen(id)).start();
  }
});
