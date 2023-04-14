export class Vibro {
	static vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE);
	static timer = false;
	static initComplete = false;
	static timerStep = 25;
	static enabled = true;

	static firstRun() {
		hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
			pause_call: () => Vibro.cancel(),
		});
		Vibro.initComplete = true;
	}

	static _prepBase(tfn) {
		if (!Vibro.initComplete) {
			Vibro.firstRun();
		}

		Vibro.cancel();

		Vibro.vibrate.motorenable = 1;
		Vibro.vibrate.crowneffecton = 1;
		Vibro.vibrate.scene = 1;

		tfn();
		Vibro.timer = timer.createTimer(0, Vibro.timerStep, tfn);
	}

	static run(length, delay = 0, count = 1, callback = false) {
		if(!Vibro.enabled) return;

		let counter = 0,
			time = 0;

		Vibro._prepBase(() => {
			if (counter >= count) {
				Vibro.cancel();
				if (callback !== false) callback();
				return;
			}

			time += Vibro.timerStep;

			if (time <= length) {
				Vibro.vibrate.start();
			} else if (time <= length + delay) {
				Vibro.vibrate.stop();
			} else {
				counter += 1;
				time = 0;
				if (counter < count) Vibro.vibrate.start();
			}
		});
	}

	static melody(array, callback = false) {
		if(!Vibro.enabled) return;

		let index = 0,
			time = 0;
		Vibro._prepBase(() => {
			if (index >= array.length) {
				Vibro.cancel();
				if (callback !== false) callback();
				return;
			}

			if (time < array[index]) {
				time += Vibro.timerStep;
				return;
			} else {
				time = 0;
				index += 1;
				if (index < array.length)
					index % 2 == 0 ? Vibro.vibrate.start() : Vibro.vibrate.stop();
			}
		});
	}

	static cancel() {
		if (Vibro.timer !== false) {
			timer.stopTimer(Vibro.timer);
			Vibro.timer = false;
		}
		Vibro.vibrate.stop();
	}
}
