import {TouchEventManager} from "../lib/mmk/TouchEventManager";
import { AppGesture } from "../lib/mmk/AppGesture";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../lib/mmk/UiParams";

const { t } = getApp()._options.globalData;

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
  		w: SCREEN_WIDTH,
  		h: SCREEN_HEIGHT
  	});

  	const w = g.createWidget(hmUI.widget.IMG, {
  		x: Math.floor((SCREEN_WIDTH - 92) / 2),
  		y: Math.floor((SCREEN_HEIGHT - 92) / 2),
  		src: "qs/reboot.png",
  	});
  	const events = new TouchEventManager(w);
  	events.ontouch = () => {
  		hmUI.deleteWidget(g);
  	};

  	g.createWidget(hmUI.widget.TEXT, {
  		x: 8,
  		y: Math.floor((SCREEN_HEIGHT - 92) / 2) + 100,
  		w: SCREEN_WIDTH,
  		h: 64,
  		align_h: hmUI.align.CENTER_H,
  		text_style: hmUI.text_style.WRAP,
  		color: 0x999999,
		text_size: 20,
  		text: t("Click to confirm")
  	})
  }
});
