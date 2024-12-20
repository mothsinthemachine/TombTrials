class PauseMenu {
	constructor({progress, onComplete},map) {
		this.progress = progress;
		this.onComplete = onComplete;
		this.map = map;
	}

	close() {
		this.esc?.unbind();
		this.menuBackground.remove();
		this.element.remove();
		this.saveButton.remove();
		this.closeButton.remove();
		this.onComplete();
	}

	saveButtonPressed() {
		window.overworld.progress.save();
		window.overworld.map.menu.close();
	}

	closeButtonPressed() {
		window.overworld.map.menu.close();
	}

	async init(container) {
		/* Create a screen cast over game */
		this.menuBackground = document.createElement("div");
		this.menuBackground.classList.add("PauseMenu","MenuBackground");
		container.appendChild(this.menuBackground);

		this.element = document.createElement("div");
		this.element.classList.add("PauseMenu");
		this.element.innerHTML = (
			`<h2>Paused</h2>
			<p>Controls</p>
			<table>
				<tbody>
					<tr>
						<td>Movement</td>
						<td>&uarr;&larr;&darr;&rarr;/WASD</td>
					</tr>
					<tr>
						<td>Talk/Interact</td>
						<td>Spacebar, Enter, Z</td>
					</tr>
					<tr>
						<td>Switch players</td>
						<td>F</td>
					</tr>
				</tbody>
			</table>`
		);
		container.appendChild(this.element);

		this.saveButton = document.createElement("button");
		this.saveButton.classList.add("MenuButton","SaveButton");
		if (!window.overworld.progress.canSave())
		{
			/* Saving is disabled */
			this.saveButton.classList.add("disabled");
			this.saveButton.setAttribute("title", "Saving is disabled!");
		} else {
			/* Saving is enabled */
			this.saveButton.setAttribute("title","Save your progress.");
			this.saveButton.onclick = this.saveButtonPressed;
		}
		this.saveButton.innerHTML = "Save";
		container.appendChild(this.saveButton);

		this.closeButton = document.createElement("button");
		this.closeButton.classList.add("MenuButton","CloseButton");
		this.closeButton.innerHTML = "Close";
		this.closeButton.setAttribute("title","Close the menu.");
		this.closeButton.onclick = this.closeButtonPressed;
		container.appendChild(this.closeButton);

		utils.wait(200);
		this.esc = new KeyPressListener("Escape", () => {
			this.close();
		});
	}
}