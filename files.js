(function (Scratch) {
  'use strict';

  class FilesExtension {
    getInfo() {
      return {
        id: 'files',
        name: 'Files',
        color1: '#4c97ff',
        color2: '#3373cc',
        blocks: [
          {
            opcode: 'showPicker',
            blockType: Scratch.BlockType.REPORTER,
            text: 'open a file',
            arguments: {}
          },
          {
            opcode: 'download',
            blockType: Scratch.BlockType.COMMAND,
            text: 'download [TEXT] as [NAME]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World!'
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'file.txt'
              }
            }
          }
        ]
      };
    }

    showPicker() {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) {
            resolve('');
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsText(file);
        };
        input.click();
      });
    }

    download(args) {
      const blob = new Blob([args.TEXT], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = args.NAME;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  // Gandi-specific registration
  Scratch.extensions.register(new FilesExtension());
})(Scratch);
