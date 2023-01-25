import {SettingsListScreen} from "../../lib/SettingsListScreen";
import {TouchEventManager} from "../../lib/TouchEventManager";

import {ContactStorage} from "../src/ContactStorage";

class MainScreen extends SettingsListScreen {
  build() {
    ContactStorage.all().map((row, id) => {
      const name = row.name ? row.name : "(безымянный)";
      this.clickableItem(name, 'people.png', () => {
        hmApp.gotoPage({url: 'page/viewer', param: id});
      });
    });

    // Create btn
    const btn = hmUI.createWidget(hmUI.widget.IMG, {
      x: 72,
      y: this.posY + 8,
      w: 48,
      h: 48,
      src: "create.png"
    });
    const btnEv = new TouchEventManager(btn);
    btnEv.ontouch = () => hmApp.gotoPage({
      url: "page/editor",
      param: ContactStorage.getInsertId()
    });
    this.posY += 96;
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    (new MainScreen()).start();
  }
});
