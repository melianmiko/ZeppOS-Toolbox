const data = [
	{
		key: "pai",
		name: "PAI",
		url: "pai_app_Screen"
	},
	{
		key: "activity",
		name: "Активность",
		url: "activityAppScreen"
	},
	{
		key: "sleep",
		name: "Сон",
		url: "Sleep_HomeScreen"
	},
	{
		key: "heart",
		name: "Пульс",
		url: "heart_app_Screen"
	},
	{
		key: "stress",
		name: "Стресс",
		url: "StressHomeScreen"
	},
	{
		key: "spo2",
		name: "Кислород",
		url: "spo_HomeScreen"
	},
	{
		key: "sport",
		name: "Спорт",
		url: "SportListScreen"
	},
	{
		key: "flash",
		name: "Фонарик",
		url: "FlashLightScreen"
	},
	{
		key: "alarm",
		name: "Будильник",
		url: "AlarmInfoScreen"
	},
	{
		key: "respr",
		name: "Дыхание",
		url: "RespirationsettingScreen"
	},
	{
		key: "hidcamera",
		name: "Камера",
		url: "HidcameraScreen"
	},
	{
		key: "findphone",
		name: "Найти телефон",
		url: "FindPhoneScreen"
	},
	{
		key: "music",
		name: "Музыка",
		url: "PhoneMusicCtrlScreen"
	},
	{
		key: "weather",
		name: "Погода",
		url: "WeatherScreen"
	},
	{
		key: "tomato",
		name: "Помидорка",
		url: "TomatoMainScreen"
	},
	{
		key: "worldclock",
		name: "Мировые часы",
		url: "WorldClockScreen"
	},
	{
		key: "swatch",
		name: "Секундомер",
		url: "StopWatchScreen"
	},
	{
		key: "countdown",
		name: "Таймер",
		url: "CountdownAppScreen"
	}
]

export const SystemApps = data.map((v) => {
	return {
		key: v.key,
		name: v.name,
		icon: "osi/" + v.key + ".png",
		request: {
			url: v.url,
			native: true
		}
	}
})
