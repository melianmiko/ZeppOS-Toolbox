import {Vibro} from "../../lib/Vibro"
import {TouchEventManager} from "../../lib/TouchEventManager";

import {Im02Game} from "../src/Im02Game";
import {BG_OPTIONS, BG_OPTION_KEY, HIGHSCORE_KEY} from "../src/Options.js"

const STYLE_FULLSCREEN = {
	x: 0,
	y: 0,
	w: 192,
	h: 490
};

class GameHomeScreen {
	onGameFinish(score) {
		let highscore = hmFS.SysProGetInt(HIGHSCORE_KEY);
		if(!highscore || score > highscore) {
			hmFS.SysProSetInt(HIGHSCORE_KEY, score);
		}

		this.updateMenuVisibility();
	}

	updateMenuVisibility() {
		this.menu.setProperty(hmUI.prop.VISIBLE, !this.game.started);

		let highscore = hmFS.SysProGetInt(HIGHSCORE_KEY);
		if(!highscore) highscore = 0;
		this.viewScore.setProperty(hmUI.prop.TEXT, String(highscore));
	}

	build() {
		// Fetch color
		let colorID = hmFS.SysProGetInt(BG_OPTION_KEY);
		if(!colorID) colorID = 0;

		const backgroundColor = BG_OPTIONS[colorID][1];

		// Setup gesture controller
		hmApp.registerGestureEvent(() => {
			return this.game.started;
		});

		// Game data layer
		hmUI.createWidget(hmUI.widget.FILL_RECT, {
			...STYLE_FULLSCREEN,
			color: backgroundColor,
		});
		this.game = new Im02Game();
		this.game.onFinish = (v) => this.onGameFinish(v);
		this.game.init();

		// Menu group
		this.menu = hmUI.createWidget(hmUI.widget.GROUP, STYLE_FULLSCREEN);
		this.menu.createWidget(hmUI.widget.FILL_RECT, {
			...STYLE_FULLSCREEN,
			color: backgroundColor,
		});

		this.menu.createWidget(hmUI.widget.IMG, {
			x: 16,
			y: 80,
			src: "logo.png",
			alpha: 180,
		});
			
		// Play btn
		const playBtn = this.menu.createWidget(hmUI.widget.IMG, {
			x: 48,
			y: (490 - 96) / 2,
			src: "main_menu/play.png",
			alpha: 90,
		});
		const playBtnEvents = new TouchEventManager(playBtn);
		playBtnEvents.ontouch = () => {
			this.game.start();
			this.updateMenuVisibility();
		};

		// Settings btn
		const settingsBtn = this.menu.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 400,
			src: "main_menu/settings.png",
			alpha: 60
		});
		const settingsBtnEvents = new TouchEventManager(settingsBtn);
		settingsBtnEvents.ontouch = () => {
			hmApp.gotoPage({ url: "page/SettingsScreen"});
		};

		// Top
		this.menu.createWidget(hmUI.widget.IMG, {
			x: 56,
			y: 340,
			src: "title_top.png",
			alpha: 180
		});
		this.viewScore = this.menu.createWidget(hmUI.widget.TEXT_IMG, {
			x: 0,
			y: 370,
			w: 192,
			align_h: hmUI.align.CENTER_H,
			text: "0",
			font_array: [...Array(10).keys()].map((i) => `font/${i}.png`),
		});

		// Load highscore
		this.updateMenuVisibility();
	}
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
	onInit(bg) {
		hmSetting.setBrightScreen(360);
		hmUI.setLayerScrolling(false);
		(new GameHomeScreen()).build();
	},
	onDestroy() {
		Vibro.cancel();
		hmSetting.setBrightScreenCancel();
	}
});
