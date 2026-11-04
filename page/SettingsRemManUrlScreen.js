import { ListScreen } from "../lib/mmk/ListScreen";
import {ScreenBoard} from "../lib/mmk/ScreenBoard";

const { config, t } = getApp()._options.globalData;

class SettingsRemManUrlScreen extends ListScreen {
  constructor() {
    super();

    this.board = new ScreenBoard();
    this.board.title = t("URL:");
    this.board.confirmButtonText = t("Apply");
    this.board.value = config.get("remManUrl", "");
    this.board.onConfirm = (v) => this.saveChanges(v);
  }

  build() {
    this.board.visible = true;
  }

  saveChanges(val) {
    hmApp.goBack();
    config.set("remManUrl", val);
  }
}

// noinspection JSCheckFunctionSignatures
Page({
  onInit(params) {
    hmUI.setStatusBarVisible(false);
    new SettingsRemManUrlScreen(params).build();
  }
})
