export class ChatInterface {
  constructor(messagesContainerId) {
    this.container = document.getElementById(messagesContainerId);
  }

  addMessage(text, sender) {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;

    wrapper.appendChild(bubble);
    this.container.appendChild(wrapper);
    this._scrollToBottom();
    return wrapper;
  }

  addWarning(text) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message bot-message warning-message';
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = `⚠️ ${text}`;
    wrapper.appendChild(bubble);
    this.container.appendChild(wrapper);
    this._scrollToBottom();
  }

  showTyping() {
    const wrapper = document.createElement('div');
    wrapper.className = 'message bot-message typing-indicator';
    wrapper.id = 'typing-indicator';
    wrapper.innerHTML = `
      <div class="message-bubble">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>`;
    this.container.appendChild(wrapper);
    this._scrollToBottom();
  }

  hideTyping() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  _scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }
}
