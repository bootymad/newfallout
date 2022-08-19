export class MessageLogger {
	constructor() {
		this.messages = [];
		this.pageElement = document.querySelector(".messages");

		this.showAllBtn = document.querySelector("#show-all-btn");
		this.closeAllBtn = document.querySelector("#close-all-btn");
		this.showAllBtn.addEventListener("click", () =>
			this.showAllMessages("show")
		);
		this.closeAllBtn.addEventListener("click", () =>
			this.showAllMessages("close")
		);

		this.allMessageBox = document.querySelector(".all-messages");
		this.allMessageBox.style.display = "none";

		this.allMessageBoxMessages = document.querySelector(
			".all-messages_messages"
		);
	}

	showAllMessages(event) {
		console.log("clicked " + event + " all messages button");
		this.allMessageBox.style.display === "none"
			? (this.allMessageBox.style.display = "flex")
			: (this.allMessageBox.style.display = "none");
	}

	log(...args) {
		let message = args.join(" ");
		message = message.trimEnd();
		this.messages.push(message);
		// add to the all message log
		const msg = document.createElement("p");
		msg.append(message);
		this.allMessageBoxMessages.append(msg);
		// never show more than 5 messages on main screen
		if (this.pageElement.childElementCount >= 5) {
			this.pageElement.removeChild(this.pageElement.firstChild);
		}
		this.pageElement.append(msg.cloneNode(true)); // can't append same element twice
	}

	render() {
		// clear exisiting messages from page
		this.pageElement.textContent = "";
		// render last 5 messages
		for (let i = this.messages.length - 5; i < this.messages.length; i++) {
			const msg = document.createElement("p");
			msg.append(this.messages[i] || "-");
			this.pageElement.append(msg);
		}
	}
}
