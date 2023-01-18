import {t, extendLocale} from "../../lib/i18n";
import {TouchEventManager} from "../../lib/TouchEventManager";

import {REBOOT_CONFIRM_TRANSLATIONS} from "../utils/translations";

extendLocale(REBOOT_CONFIRM_TRANSLATIONS);

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
  	const g = hmUI.createWidget(hmUI.widget.GROUP, {
  		x: 0,
  		y: 0,
  		w: 192,
  		h: 490
  	});

  	const w = g.createWidget(hmUI.widget.IMG, {
  		x: 57,
  		y: 206,
  		src: "qs/reboot.png"
  	});
  	const events = new TouchEventManager(w);
  	events.ontouch = () => {
  		hmUI.deleteWidget(g);
  	};

  	g.createWidget(hmUI.widget.TEXT, {
  		x: 8,
  		y: 320,
  		w: 176,
  		h: 56,
  		align_h: hmUI.align.CENTER_H,
  		text_style: hmUI.text_style.WRAP,
  		color: 0x999999,
  		text: t("reboot_confirm")
  	})
  }
});
