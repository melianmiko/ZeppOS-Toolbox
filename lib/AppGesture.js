export class AppGesture {
	static _events = {};
	static _evMapping = {
		"up": hmApp.gesture.UP,
		"left": hmApp.gesture.LEFT,
		"right": hmApp.gesture.RIGHT,
		"down": hmApp.gesture.DOWN,
	};

	/**
	 * Register this instance. Must be called in onInit
	 */
	static init() {
		hmApp.registerGestureEvent((e) => {
			return AppGesture._events[e] ? AppGesture._events[e]() : false;
		});
	}

	/**
	 * Add event listener, ex. AppGesture.on("left", () => {...})
	 */
	static on(event, action) {
		this._events[this._evMapping[event]] = action;
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