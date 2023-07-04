import { MessageBuilder } from '../../lib/zeppos/message';
import { RemManSideService } from "../../lib/mmk/remman/RemManSideService";

const messageBuilder = new MessageBuilder();
const remMan = new RemManSideService(messageBuilder);

AppSideService({
  onInit(props) {
    messageBuilder.listen(() => {});
    messageBuilder.on("request", (ctx) => {
      const request = messageBuilder.buf2Json(ctx.request.payload);
      remMan.onRequest(ctx, request);
      // Your own code, if required
    });
  },
  onRun() {},
  onDestroy() {},
})
