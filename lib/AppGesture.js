const _events = {}
const _evMapping = {
	"up": hmApp.gesture.UP,
	"left": hmApp.gesture.LEFT,
	"right": hmApp.gesture.RIGHT,
	"down": hmApp.gesture.DOWN,
}

export class AppGesture {
	/**
	 * Register this instance. Must be called in onInit
	 */
	static init() {
		hmApp.registerGestureEvent((e) => {
			return _events[e] ? _events[e]() : false;
		});
	}

	/**
	 * Add event listener, ex. AppGesture.on("left", () => {...})
	 */
	static on(event, action) {
		_events[_evMapping[event]] = action;
	}

	static withHighLoadBackWorkaround() {
		AppGesture.on("right", () => {
			hmApp.setLayerY(0);
			hmUI.createWidget(hmUI.widget.FILL_RECT, {
				x: 0,
				y: 0,
				w: 192,
				h: 490,
				color: 0x0
			});
			timer.createTimer(350, 0, () => hmApp.goBack());
			return true;
		})
	}

	/**
	 * Reload page after two swipes in selected direction
	 */
	static withYellowWorkaround(event, startReq) {
		let lastSwipe = 0;
		let count = 0;
		AppGesture.on(event, () => {
			if(Date.now() - lastSwipe > 1000)
				count = 1;

			if(count == 3) {
				console.log("Reloading with params", startReq);
				hmApp.startApp(startReq,);
				return;
			}

			count++;
			lastSwipe = Date.now();
			return true;
		});
	}
}