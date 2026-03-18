(function (Scratch) {
  'use strict';

  class FileExtension {
    constructor() {
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
              EXT: { type: Scratch.ArgumentType.STRING, defaultValue: '.txt, .cpp' },
              MODE: { type: Scratch.ArgumentType.STRING, menu: 'loadMode' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'readType' }
            }
          },
          {
            opcode: 'clearFiles',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear opened files'
          },
          '---',
          {
            opcode: 'hasFiles',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'files uploaded?'
          },
          {
            opcode: 'fileCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'number of files opened'
          },
          {
            opcode: 'getFileAttribute',
            blockType: Scratch.BlockType.REPORTER,
            text: '[ATTR] of file [INDEX] opened',
            arguments: {
              ATTR: { type: Scratch.ArgumentType.STRING, menu: 'fileAttributes' },
              INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          '---',
          {
            opcode: 'downloadFile',
            blockType: Scratch.BlockType.COMMAND,
            text: 'download [CONTENT] as name [NAME] type [DL_TYPE]',
            arguments: {
              CONTENT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello World' },
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'myfile.txt' },
              DL_TYPE: { type: Scratch.ArgumentType.STRING, menu: 'downloadType' }
            }
          }
        ],
        menus: {
          loadMode: { acceptReporters: true, items: ['Single', 'Multiple'] },
          readType: { acceptReporters: true, items: ['UTF-8(text)', 'Data URI'] },
          fileAttributes: {
            acceptReporters: true,
            items: ['name', 'content', 'file size in KB', 'file extension', 'Data URI']
          },
          downloadType: {
            acceptReporters: true,
            items: ['Text', 'Data URI']
          }
        }
      };
    }

    // New block to manually reset the state
    clearFiles() {
      this.openedFiles = [];
    }

    hasFiles() {
      return this.openedFiles.length > 0;
    }

    loadFile(args) {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = args.EXT;
        if (args.MODE === 'Multiple') input.multiple = true;

        input.onchange = async () => {
          const files = Array.from(input.files);
          
          // Only clear and update if the user actually picked files
          if (files.length > 0) {
            this.openedFiles = [];
            for (const file of files) {
              const content = await this._readFileAs(file, args.TYPE);
              const dataURI = await this._readFileAs(file, 'Data URI');
              
              this.openedFiles.push({
                name: file.name,
                content: content,
                size: (file.size / 1024).toFixed(2),
                ext: file.name.split('.').pop() || '',
                dataURI: dataURI
              });
            }
          }
          resolve();
        };
        
        // If they click "Cancel" in the file picker, it won't clear the previous files
        input.oncancel = () => resolve();
        input.click();
      });
    }

    _readFileAs(file, type) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve("");
        if (type === 'Data URI') reader.readAsDataURL(file);
        else reader.readAsText(file);
      });
    }

    getFileAttribute(args) {
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

    downloadFile(args) {
      const content = args.CONTENT;
      const filename = args.NAME;
      const type = args.DL_TYPE;

      const element = document.createElement('a');
      if (type === 'Data URI') {
        element.setAttribute('href', content);
      } else {
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
      }
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }

  Scratch.extensions.register(new FileExtension());
})(Scratch);
