const APP_ID = hmApp.packageInfo().appId;

export function openPage(name, param=null) {
	// Switching pages with this way reduces count of
	// yellow screen appears
	
	hmApp.startApp({
		appid: APP_ID,
		url: "page/" + name,
		param
	})
}
