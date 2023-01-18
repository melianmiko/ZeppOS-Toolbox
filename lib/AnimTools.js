export class AnimTools {
	static ANIMATION_STEPS = 10;

	static animate(config) {
		const steps = config.steps ? config.steps : Animation.ANIMATION_STEPS;
		const delay = config.delay ? config.delay : 25;

		const len = config.end - config.start;
		const stepSize = len / steps;

		config.step(config.start);
		let currentStep = 1;
		let ti = timer.createTimer(0, delay, () => {
			try {
				config.step(config.start + stepSize * currentStep);
			} catch (e) {}

			if (currentStep >= steps) {
				timer.stopTimer(ti);
				if (config.finish) config.finish();
			}
			currentStep++;
		});
	}
}
