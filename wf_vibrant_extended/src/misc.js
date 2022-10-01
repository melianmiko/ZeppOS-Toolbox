function renderStatus() {
  hmUI.createWidget(hmUI.widget.IMG, {
    x: 0,
    y: 334,
    src: "status/bg1.png"
  });
  hmUI.createWidget(hmUI.widget.IMG, {
    x: 166,
    y: 334,
    src: "status/bg2.png"
  });
  hmUI.createWidget(hmUI.widget.IMG_STATUS, {
    x: 0,
    y: 334,
    src: 'status/disconnect.png',
    type: hmUI.system_status.DISCONNECT
  });
  hmUI.createWidget(hmUI.widget.IMG_STATUS, {
    x: 166,
    y: 334,
    src: 'status/dnd.png',
    type: hmUI.system_status.DISTURB
  });
}

function getTbTimerState() {
  const state = hmFS.SysProGetChars("mmk_tb_timer_state");
  if(!state) return "--.--";

  const [id, startedTime, endTime] = state.split(":").map((v) => parseInt(v));
  const delay = Math.floor((endTime - Date.now()) / 1000);
  if(delay <= 0) return "--.--";

  const minute = Math.min(Math.floor(delay / 60), 99).toString().padStart(2, "0"),
    second = (delay % 60).toString().padStart(2, "0");

  return `${minute}.${second}`;
}
