function _call(url) {
	if(typeof url == "function") return url();	
	if(url == "") return;

  hmApp.startApp({
    url, native: true
  })
}

function _changeBrightness(delta) {
    const val = Math.min(Math.max(0, hmSetting.getBrightness() + delta), 100);
    hmSetting.setBrightness(val);
}

function initTapZones(widgetURLs, barURLs) {
	let mustHandle = false;

	const zone = hmUI.createWidget(hmUI.widget.IMG, {
		x: 0,
		y: 0,
		w: 192,
		h: 490,
		src: ""
	});

	zone.addEventListener(hmUI.event.CLICK_DOWN, () => mustHandle = true);
	zone.addEventListener(hmUI.event.MOVE, () => mustHandle = false);
	zone.addEventListener(hmUI.event.CLICK_UP, (info) => {
		if(!mustHandle) return;
		mustHandle = false;

		const {x, y} = info

		// widgets
		if(48 < x && x < 120) {
			if(36 < y && y < 114) {
				return _call(widgetURLs[0]);
			} else if(376 < y && y < 454) {
				return _call(widgetURLs[1]);
			}
		}

		// Bars
		if(x < 96) {
			if(y < 160) {
				return _call(barURLs[0]); // top
			} else if(y > 330) {
				return _call(barURLs[2]); // bottom
			} else {
				_changeBrightness(-5); // center
			}
		} else {
			if(y < 160) {
				return _call(barURLs[1]);
			} else if(y > 330) {
				return _call(barURLs[3]);
			} else {
				_changeBrightness(5); // center
			}
		}
	});
}