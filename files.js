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
            opcode: 'showPickerAsDataURL',
            blockType: Scratch.BlockType.REPORTER,
            text: 'open a file as data URL',
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
          },
          {
            opcode: 'downloadDataURL',
            blockType: Scratch.BlockType.COMMAND,
            text: 'download data URL [URL] as [NAME]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'data:text/plain;base64,SGVsbG8h'
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

    _read(asDataURL) {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.onchange = () => {
          const file = input.files[0];
          if (!file) {
            resolve('');
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
            document.body.removeChild(input);
          };
          if (asDataURL) {
            reader.readAsDataURL(file);
          } else {
            reader.readAsText(file);
          }
        };

        input.oncancel = () => {
          resolve('');
          document.body.removeChild(input);
        };

        input.click();
      });
    }

    showPicker() {
      return this._read(false);
    }

    showPickerAsDataURL() {
      return this._read(true);
    }

    download(args) {
      this._download(args.TEXT, args.NAME, 'text/plain');
    }

    downloadDataURL(args) {
      this._download(args.URL, args.NAME);
    }

    _download(content, name, type) {
      const blob = type ? new Blob([content], {type}) : null;
      const url = type ? URL.createObjectURL(blob) : content;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
      
      if (type) URL.revokeObjectURL(url);
    }
  }

  Scratch.extensions.register(new FilesExtension());
})(Scratch);
