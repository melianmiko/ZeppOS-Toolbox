let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.WatchFace({
  onInit() {
    const currentScreen = hmSetting.getScreenType();
    switch(currentScreen) {

      case hmSetting.screen_type.AOD:
        renderClockWidget(true);
        return;

      case hmSetting.screen_type.SETTINGS:
        renderWidgets();
        renderBars();
        renderClockWidget(false);
        return;

      default:
        const barUrls = renderBars();
        const widgetUrls = renderWidgets();
        renderStatus();
        renderClockWidget(false);

        initTapZones(widgetUrls, barUrls);

    }
  }
});
