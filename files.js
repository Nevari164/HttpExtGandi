(function (Scratch) {
  'use strict';

  class FileExtension {
    constructor() {
      // Store metadata of the last set of files opened
      this.openedFiles = [];
    }

    getInfo() {
      return {
        id: 'fileExtGandiImproved',
        name: 'Files Plus',
        color1: '#4C97FF',
        color2: '#3373CC',
        blocks: [
          {
            opcode: 'loadFile',
            blockType: Scratch.BlockType.COMMAND,
            text: 'load [EXT] s [MODE] file read as [TYPE]',
            arguments: {
              EXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '.txt, .cpp'
              },
              MODE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'loadMode'
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'readType'
              }
            }
          },
          {
            opcode: 'getFileAttribute',
            blockType: Scratch.BlockType.REPORTER,
            text: '[ATTR] of file [INDEX] opened',
            arguments: {
              ATTR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'fileAttributes'
              },
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'fileCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'number of files opened'
          }
        ],
        menus: {
          loadMode: {
            acceptReporters: true,
            items: ['Single', 'Multiple']
          },
          readType: {
            acceptReporters: true,
            items: ['UTF-8(text)', 'Data URI']
          },
          fileAttributes: {
            acceptReporters: true,
            items: ['name', 'content', 'file size in KB', 'file extension', 'Data URI']
          }
        }
      };
    }

    loadFile(args) {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = args.EXT;
        
        // Handle Multiple/Single toggle
        if (args.MODE === 'Multiple') {
          input.multiple = true;
        }

        input.onchange = async () => {
          const files = Array.from(input.files);
          this.openedFiles = []; // Reset the list

          for (const file of files) {
            const content = await this._readFileAs(file, args.TYPE);
            const dataURI = await this._readFileAs(file, 'Data URI');
            
            this.openedFiles.push({
              name: file.name,
              content: content,
              size: (file.size / 1024).toFixed(2),
              ext: file.name.split('.').pop(),
              dataURI: dataURI
            });
          }
          resolve();
        };

        // If user cancels file picker
        input.oncancel = () => resolve();
        
        input.click();
      });
    }

    // Internal helper to read files
    _readFileAs(file, type) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve("");

        if (type === 'Data URI') {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      });
    }

    getFileAttribute(args) {
      // Scratch uses 1-based indexing for users, JS uses 0-based
      const index = Math.max(1, parseInt(args.INDEX)) - 1;
      const file = this.openedFiles[index];

      if (!file) return "";

      switch (args.ATTR) {
        case 'name': return file.name;
        case 'content': return file.content;
        case 'file size in KB': return file.size;
        case 'file extension': return file.ext;
        case 'Data URI': return file.dataURI;
        default: return "";
      }
    }

    fileCount() {
      return this.openedFiles.length;
    }
  }

  Scratch.extensions.register(new FileExtension());
})(Scratch);
