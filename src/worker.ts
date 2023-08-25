
export default {
  async email(message, env, ctx) {
    switch (message.to) {
      case "marketing@example.com":
        await fetch("https://webhook.slack/notification", {
          body: `Got a marketing email from ${message.from}, subject: ${message.headers.get('subject')}`,
        });
        await message.forward("inbox@corp");
        break;
  
      default:
        message.setReject("Unknown address");
    }
  }
}