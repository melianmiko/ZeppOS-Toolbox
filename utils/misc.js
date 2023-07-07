export function openPage(name, param=null) {
	hmApp.gotoPage({url: "page/" + name, param});
}
