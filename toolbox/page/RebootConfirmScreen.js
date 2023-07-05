import {TouchEventManager} from "../../lib/mmk/TouchEventManager";
import { AppGesture } from "../../lib/mmk/AppGesture";

const { config, t } = getApp()._options.globalData;

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/RebootConfirmScreen",
    });
    AppGesture.init();

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
  		text: t("Click to confirm")
  	})
  }
});
