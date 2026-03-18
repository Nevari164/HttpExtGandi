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
          }
        ]
      };
    }

    openNewTab(args) {
      const url = args.URL;
      // Basic security check to ensure it starts with a valid protocol
      if (url.startsWith('http://') || url.startsWith('https://')) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // If no protocol, try to prepend https://
        window.open('https://' + url, '_blank', 'noopener,noreferrer');
      }
    }
  }

  Scratch.extensions.register(new TabOpener());
})(Scratch);
