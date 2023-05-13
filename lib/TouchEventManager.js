export class TouchEventManager {
	constructor(widget) {
		this.ontouch = null;
		this.onlongtouch = null;
		this.onlongtouchrepeatly = null;
		this.ontouchdown = null;
		this.ontouchup = null;
		this.ontouchmove = null;
		this._init(widget);
	}

	_init(widget) {
		let handleClick = true;
		let timerLongTap = -1;
		let startX = 0;
		let startY = 0;

		widget.addEventListener(hmUI.event.CLICK_UP, (e) => {
			if(this.ontouchup) this.ontouchup(e);
			if(handleClick && this.ontouch) this.ontouch(e);

			handleClick = false;
			startX = e.x;
			startY = e.y;
			timer.stopTimer(timerLongTap);
		});

		widget.addEventListener(hmUI.event.CLICK_DOWN, (e) => {
			if(this.ontouchdown) this.ontouchdown(e);

			handleClick = true;
			timerLongTap = timer.createTimer(750, 150, () => {
				if(handleClick && this.onlongtouch) {
					this.onlongtouch(e);
					handleClick = false;
				}

				if(this.onlongtouchrepeatly) 
					this.onlongtouchrepeatly(e);
			})
		});

		widget.addEventListener(hmUI.event.MOVE, (e) => {
			if(this.ontouchmove) this.ontouchmove(e);
			
			if(Math.abs(e.x - startX) + Math.abs(e.y - startY) > 3) {
				handleClick = false;
				timer.stopTimer(timerLongTap);
			}
		})
	}
}