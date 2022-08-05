/** Electron Notification Abstraction class for sandboxed plugins. */
export default class RkNotification {
  /** The title for this notification */
  private title: string;

  /** The content of this notification */
  private content: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }

  /** Send the notification to the user. */
  send() {
    // eslint-disable-next-line no-new
    new Notification(this.title, { body: this.content });
  }
}
