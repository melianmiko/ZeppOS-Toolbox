import {SettingsListScreen} from "../../lib/SettingsListScreen";
import {TouchEventManager} from "../../lib/TouchEventManager";
import {ScreenBoard} from "../../lib/ScreenBoard";

import {ContactStorage} from "../src/ContactStorage";
import {EDITABLE_PROPS} from "../src/constants";

class EditorPage extends SettingsListScreen {
  constructor(id) {
    super();
    this.id = id;
    this.hasChanges = false;
  }

  start() {
    this.data = ContactStorage.find(this.id);
    console.log("editing", this.id, this.data);

    super.start();

    this.kb = new ScreenBoard(["RU", "EN", "123"]);
    this.kb.onConfirm = () => this.onPropChanged();
    this.kb.visible = false;

    hmApp.registerGestureEvent((e) => {
      if(e == hmApp.gesture.RIGHT && this.kb.visible) {
        this.kb.visible = false;
        return true;
      }

      return false;
    })
  }

  build() {
    this.fields = {};

    this.headline("Редактирование");

    // Build fields
    Object.keys(EDITABLE_PROPS).forEach((prop) => {
      this.fields[prop] = this.field(EDITABLE_PROPS[prop], this.data[prop], () => {
        this.modifyProp(prop);
      });
    });

    this.text("Контакт сохранится автоматически, при выходе", 16);
  }

  modifyProp(prop) {
    this.currentProp = prop;
    this.kb.title = EDITABLE_PROPS[prop];
    this.kb.value = this.data[prop] ? this.data[prop] : "";
    this.kb.visible = true;
  }

  onPropChanged() {
    const value = this.kb.value;
    const prop = this.currentProp;

    this.kb.visible = false;
    this.data[prop] = value;
    this.fields[prop](value)
    this.hasChanges = true;
  }

  finish() {
    if(this.hasChanges)
      ContactStorage.update(this.id, this.data);
  }
}


let currentPage;
let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    currentPage = new EditorPage(p);
    currentPage.start();
  },
  onDestroy() {
    currentPage.finish();
  }
});
