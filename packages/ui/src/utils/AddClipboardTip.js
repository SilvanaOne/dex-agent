class CopyToClipboardTip {
  constructor() {
    this.copyBtn = document.querySelectorAll(".js-copy-clipboard");
    this.events();
  }

  events() {
    this.copyBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleClick(e));
    });
  }

  handleClick(e) {
    const btn = e.currentTarget;

    btn._tippy.setContent("Copied!");
    btn._tippy.show();
    setTimeout(() => {
      btn._tippy.setContent("");
    }, 1000);
  }
}

export default CopyToClipboardTip;
