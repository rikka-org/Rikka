import blessed from "blessed";
import { InjectRikka } from "../Injectors/injector";

export function createInstall() {
  const tui = blessed.screen({
    smartCSR: true,
  });

  tui.title = "Rikka Installer";

  function createBox(branch: string) {
    const box = blessed.box({
      top: "center",
      left: "center",
      width: "50%",
      height: "50%",
      content: `Install Rikka to ${branch}`,
      tags: true,
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        bg: "black",
        border: {
          fg: "green",
        },
        hover: {
          bg: "green",
        },
      },
    });

    box.on("click", (data) => {
      InjectRikka(branch);
      tui.destroy();
    });

    return box;
  }

  const stableBox = createBox("canary");

  // Append our box to the screen.
  tui.append(stableBox);

  // Quit on Escape, q, or Control-C.
  tui.key(["escape", "q", "C-c"], (ch, key) => process.exit(0));

  // Focus our element.
  stableBox.focus();

  // Render the screen.
  tui.render();
}
