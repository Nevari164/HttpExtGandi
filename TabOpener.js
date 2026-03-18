(function (Scratch) {
  'use strict';

  class TabOpener {
    getInfo() {
      return {
        id: 'tabopener',
        name: 'Tab Opener',
        color1: '#ff4c4c',
        color2: '#cc3333',
        blocks: [
          {
            opcode: 'openNewTab',
            blockType: Scratch.BlockType.COMMAND,
            text: 'open [URL] in new tab',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://www.google.com'
              }
            }
          },
          {
            opcode: 'isTabActive',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is this tab focused?',
            arguments: {}
          }
        ]
      };
    }

    openNewTab(args) {
      const url = args.URL;
      const protocol = (url.startsWith('http://') || url.startsWith('https://')) ? '' : 'https://';
      
      // We use _blank to ensure it hits a new tab
      window.open(protocol + url, '_blank', 'noopener,noreferrer');
    }

    isTabActive() {
      // document.hidden is true if the tab is minimized or in the background
      // document.hasFocus() is true if the window is the top-level focused element
      return !document.hidden && document.hasFocus();
    }
  }

  Scratch.extensions.register(new TabOpener());
})(Scratch);
