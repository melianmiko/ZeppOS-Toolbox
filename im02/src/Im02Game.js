import {AnimTools} from "../../lib/AnimTools";
import {Vibro} from "../../lib/Vibro";

export class Im02Game {
	view_score = null;
	seg = {}; // segments
	eggs = [];

	topOffset = 160;
	eggTopY = 258;
	eggBottomY = 312;
	ALPHA_VISIBLE = 192;
	ALPHA_BG = 32;

	gameState = {};
	started = false;

	gameTimer = null;
	animTimer = null;

	segmentData = {
		player_tr: { x: 101, y: 111 },
		player_right: { x: 56, y: 105 },
		player_br: { x: 98, y: 158 },
		player_tl: { x: 50, y: 105 },
		player_left: { x: 84, y: 107 },
		player_bl: { x: 44, y: 156 },
		bonus0: { x: 17, y: 25 },
		bonus1: { x: 17, y: 25 },
		fail_left: { x: 24, y: 212, src: "game/fail_anim.png" },
		fail_right: { x: 117, y: 212, src: "game/fail_anim.png" },
		fail_1: { x: 4, y: -1, src: "game/fail.png" },
		fail_2: { x: 34, y: -1, src: "game/fail.png" },
		fail_3: { x: 64, y: -1, src: "game/fail.png" },
		gameover: { x: 53, y: 151 },
	};

	initGameState() {
		this.gameState = {
			eggs: [-1, -1, -1, -1],
			fails: 0,
			score: 0,
			posY: 0,
			posX: 0,
			bonus: false,
			gameover: false,
			tick: -1,
		};

		this.refreshEggs();
		this.setPosition(0, 0);
	}

	onFinish() {}

	start() {
		if (this.started) return;
		this.initGameState();

		Vibro.enabled = !hmFS.SysProGetBool("mmk_game_no_vibro");
		Vibro.run(50);

		this.animTick();
		this.view_score.setProperty(hmUI.prop.TEXT, "0");
		this.playGuide(() => {
			this.gameTimer = timer.createTimer(50, 200, () => this.gameTick());
			this.animTimer = timer.createTimer(50, 350, () => this.animTick());
		});
		this.started = true;
	}

	finish() {
		if (!this.started) return;
		timer.stopTimer(this.gameTimer);
		timer.stopTimer(this.animTimer);
		this.started = false;
		this.onFinish(this.gameState.score);
	}

	playGuide(callback) {
		if (this.autoPlay) return callback();

		let fg = hmUI.createWidget(hmUI.widget.IMG, {
			x: 2,
			y: 239,
			src: "game/guide.png",
		});

		AnimTools.animate({
			start: 0,
			end: 5,
			steps: 5,
			delay: 400,
			step: (v) => {
				fg.setProperty(hmUI.prop.MORE, {
					alpha: v % 2 == 1 ? 180 : 0,
				});
			},
			finish: () => {
				hmUI.deleteWidget(fg);
				callback();
			},
		});
	}

	gameover() {
		this.gameState.gameover = true;
		this.gameState.bonus = false;

		const hidden = ["player_right", "player_tr", "player_br"];
		for (var key in this.seg) {
			this.modify(this.seg[key], hidden.indexOf(key) < 0, false);
		}

		Vibro.melody([250, 25, 250, 25, 250, 25, 250]);

		const ti = timer.createTimer(2500, 2500, () => {
			timer.stopTimer(ti);
			this.finish();
		});
	}

	gameTick() {
		if (this.autoPlay && this.gameState.fails >= 3) {
			this.gameState.score = 0;
			this.gameState.fails = 0;
			this.view_score.setProperty(
				hmUI.prop.TEXT,
				this.gameState.score.toString()
			);
		}

		if (this.gameState.fails >= 3) {
			if (!this.gameState.gameover) this.gameover();
			return;
		}

		// Game speed
		const speed = Math.max(1, 3 - Math.floor(this.gameState.score / 500));
		this.gameState.tick += 1;
		if (this.gameState.tick % speed != 0) return;

		this.modify(this.seg.fail_left, true, false);
		this.modify(this.seg.fail_right, true, false);

		let cur = this.gameState.eggs;
		let free = [];
		for (let i = 0; i < 4; i++) {
			// If == 3, check catch state
			if (cur[i] == 3) this.catchEgg(i);

			// Move
			if (cur[i] > -1) {
				cur[i] += 1;
			} else free.push(i);
		}

		// Spawn new egg (5-35% rate)
		const l = free.length;
		const th = 0.05 + (this.gameState.score / 1000) * 0.3;
		if ((Math.random() > 1 - th && l > 1) || free.length == 4) {
			const fi = Math.floor(Math.random() * l);
			const i = free[fi];
			cur[i] = 0;
		}

		// Bonus? (4% rate)
		if (!this.gameState.bonus && Math.random() > 0.96) {
			this.gameState.bonus = Date.now();
		} else if (Date.now() - this.gameState.bonus > 5000) {
			this.gameState.bonus = 0;
		}

		// Update UI
		this.refreshEggs();

		// AutoPlay
		if (this.autoPlay) {
			let topVal = 0,
				topIndex = -1;
			for (let i = 0; i < 4; i++) {
				if (this.gameState.eggs[i] > topVal) {
					topVal = this.gameState.eggs[i];
					topIndex = i;
				}
			}

			if (topIndex > -1 && Math.random() < (speed == 3 ? 0.75 : 0.5)) {
				this.setPosition(topIndex > 1 ? 1 : 0, topIndex % 2);
			}
		}
	}

	animTick() {
		const val = this.gameState.fails;
		const bonus = this.gameState.bonus;
		const gameover = this.gameState.gameover;

		this.modify(this.seg.fail_1, true, val >= 1 || (val == 0.5 && this.tick));
		this.modify(this.seg.fail_2, true, val >= 2 || (val == 1.5 && this.tick));
		this.modify(this.seg.fail_3, true, val >= 3 || (val == 2.5 && this.tick));

		this.modify(this.seg.bonus0, true, bonus && this.tick);
		this.modify(this.seg.bonus1, true, bonus && !this.tick);

		this.modify(this.seg.gameover, gameover, gameover && this.tick);

		this.tick = !this.tick;
	}

	catchEgg(i) {
		const validX = this.gameState.posX == (i > 1 ? 1 : 0);
		const validY = this.gameState.posY == i % 2;

		if (validY && validX) {
			this.gameState.score += 25;
			this.view_score.setProperty(
				hmUI.prop.TEXT,
				this.gameState.score.toString()
			);
			if (!this.autoPlay) Vibro.run(25);
		} else {
			const v = this.gameState.fails;
			const bonus = this.gameState.bonus;
			this.gameState.fails = bonus ? v + 0.5 : Math.floor(v + 1);

			const an = i > 1 ? this.seg.fail_right : this.seg.fail_left;
			this.modify(an, true, true);
			if (!this.autoPlay) Vibro.run(200);
		}

		this.gameState.eggs[i] = -1;
	}

	init() {
		hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: this.topOffset,
			src: "game/bg.png",
		});

		// Draw all segments
		for (let key in this.segmentData) {
			this.seg[key] = hmUI.createWidget(hmUI.widget.IMG, {
				src: "game/" + key + ".png",
				alpha: 20,
				...this.segmentData[key],
				y: this.topOffset + this.segmentData[key].y,
			});
		}

		for (let i = 0; i < 4; i++) {
			this.eggs[i] = hmUI.createWidget(hmUI.widget.IMG, {
				x: -20,
				y: -20,
				src: "game/egg.png",
			});
		}

		// Score
		this.view_score = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
			x: 121,
			y: 159,
			text: "0",
			alpha: this.ALPHA_VISIBLE,
			font_array: [...Array(10).keys()].map((i) => `font/${i}.png`),
		});

		// Controls
		if (this.autoPlay) return;
		hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 0,
			w: 96,
			h: 320,
			src: "",
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.setPosition(0, 0);
		});

		hmUI.createWidget(hmUI.widget.IMG, {
			x: 96,
			y: 0,
			w: 96,
			h: 320,
			src: "",
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.setPosition(1, 0);
		});

		hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 320,
			w: 96,
			h: 170,
			src: "",
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.setPosition(0, 1);
		});

		hmUI.createWidget(hmUI.widget.IMG, {
			x: 96,
			y: 320,
			w: 96,
			h: 170,
			src: "",
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.setPosition(1, 1);
		});
	}

	dropEgg(slot) {
		this.gameState.eggs[slot] = 0;
		this.refreshEggs();
	}

	refreshEggs() {
		for (let i = 0; i < 4; i++) {
			const val = this.gameState.eggs[i];
			let baseX = 8 + 10 * val;
			let baseY = (i % 2 ? this.eggBottomY : this.eggTopY) + val * 6;

			if (i > 1) baseX = 192 - baseX;
			if (val < 0) baseX = -20;

			this.eggs[i].setProperty(hmUI.prop.MORE, {
				x: baseX,
				y: baseY,
			});
		}
	}

	setPosition(posX, posY) {
		if (this.gameState.gameover) return;

		this.gameState.posX = posX;
		this.gameState.posY = posY;

		this.modify(this.seg.player_left, posX == 0, posX == 0);
		this.modify(this.seg.player_right, posX == 1, posX == 1);
		this.modify(this.seg.player_tl, posX == 0, posY == 0);
		this.modify(this.seg.player_tr, posX == 1, posY == 0);
		this.modify(this.seg.player_bl, posX == 0, posY == 1);
		this.modify(this.seg.player_br, posX == 1, posY == 1);
	}

	modify(w, visible, fullVisible) {
		w.setProperty(hmUI.prop.VISIBLE, visible);

		if (!visible) return;
		w.setProperty(hmUI.prop.MORE, {
			alpha: fullVisible ? this.ALPHA_VISIBLE : this.ALPHA_BG,
		});
	}
}
