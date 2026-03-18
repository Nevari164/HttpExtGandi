(function (Scratch) {
  "use strict";

  const { vm } = Scratch;
  const { runtime } = vm;

  // The helper class used in the HTTP extension to handle Hat blocks safely
  class Events {
    constructor() {
      this.blocks = {};
    }

    add(name, block) {
      if (!this.blocks[name]) this.blocks[name] = [];
      this.blocks[name].push(block);
    }

    activate(name) {
      if (this.blocks[name]) {
        for (const block of this.blocks[name]) {
          runtime.startHats(block);
        }
      }
    }
  }

  const extensionId = "tabOpener";
  const createBlockId = (block) => `${extensionId}_${block}`;

  class TabOpener {
    constructor() {
      this.events = new Events();

      // Register which opcodes belong to which events
      this.events.add("focused", createBlockId("whenTabFocused"));
      this.events.add("unfocused", createBlockId("whenTabUnfocused"));

      this.setupListeners();
    }

    setupListeners() {
      const handleActivity = () => {
        if (document.visibilityState === "visible" && document.hasFocus()) {
          this.events.activate("focused");
        } else {
          this.events.activate("unfocused");
        }
      };

      window.addEventListener("focus", handleActivity);
      window.addEventListener("blur", handleActivity);
      document.addEventListener("visibilitychange", handleActivity);
    }

    getInfo() {
      return {
        id: extensionId,
        name: "Tab Opener",
        color1: "#ff4c4c",
        color2: "#cc3333",
        blocks: [
          {
            opcode: "whenTabFocused",
            blockType: Scratch.BlockType.EVENT, // Changed to EVENT to match HTTP style
            isEdgeActivated: false,
            text: "when this tab is focused",
          },
          {
            opcode: "whenTabUnfocused",
            blockType: Scratch.BlockType.EVENT,
            isEdgeActivated: false,
            text: "when this tab is unfocused",
          },
          "---",
          {
            opcode: "openNewTab",
            blockType: Scratch.BlockType.COMMAND,
            text: "open [URL] in new tab",
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://www.google.com",
              },
            },
          },
          {
            opcode: "isTabActive",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is this tab focused?",
          },
        ],
      };
    }

    openNewTab(args) {
      const url = Scratch.Cast.toString(args.URL);
      const protocol = (url.startsWith("http://") || url.startsWith("https://")) ? "" : "https://";
      window.open(protocol + url, "_blank", "noopener,noreferrer");
    }

    isTabActive() {
      return !document.hidden && document.hasFocus();
    }
  }

  // Final check for unsandboxed mode as required by many Gandi custom extensions
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Tab Opener must run unsandboxed");
  }

  Scratch.extensions.register(new TabOpener());
})(Scratch);
