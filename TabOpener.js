(function (Scratch) {
  'use strict';

  class TabOpener {
    constructor() {
      // Listen for window focus/blur and visibility changes
      const handleActivity = () => {
        if (document.visibilityState === 'visible' && document.hasFocus()) {
          Scratch.vm.runtime.startHats('tabopener_whenTabFocused');
        } else {
          Scratch.vm.runtime.startHats('tabopener_whenTabUnfocused');
        }
      };

      window.addEventListener('focus', handleActivity);
      window.addEventListener('blur', handleActivity);
      document.addEventListener('visibilitychange', handleActivity);
    }

    getInfo() {
      return {
        id: 'tabopener',
        name: 'Tab Opener',
        color1: '#ff4c4c',
        color2: '#cc3333',
        blocks: [
          {
            opcode: 'whenTabFocused',
            blockType: Scratch.BlockType.HAT,
            text: 'when this tab is focused',
            isEdgeActivated: false // Triggered manually by startHats
          },
          {
            opcode: 'whenTabUnfocused',
            blockType: Scratch.BlockType.HAT,
            text: 'when this tab is unfocused',
            isEdgeActivated: false
          },
          '---', // Separator line
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
      window.open(protocol + url, '_blank', 'noopener,noreferrer');
    }

    isTabActive() {
      return !document.hidden && document.hasFocus();
    }
  }

  Scratch.extensions.register(new TabOpener());
})(Scratch);
