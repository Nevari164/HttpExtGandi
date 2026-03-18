(function (Scratch) {
  'use strict';

  class FormatExtension {
    constructor() {}

    getInfo() {
      return {
        id: 'formatExtNevari',
        name: 'Format',
        color1: '#5CB3FF', // A lighter blue to distinguish from the File extension
        color2: '#4682B4',
        blocks: [
          {
            opcode: 'extractBrackets',
            blockType: Scratch.BlockType.REPORTER,
            text: 'extract content in {} from [STR]',
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hi im {name}'
              }
            }
          },
          {
            opcode: 'replaceBrackets',
            blockType: Scratch.BlockType.REPORTER,
            text: 'replace {} in [STR] with [REPLACE]',
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello {name}'
              },
              REPLACE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'World'
              }
            }
          },
          {
            opcode: 'hasBrackets',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[STR] contains {}?',
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'text {data}'
              }
            }
          }
        ]
      };
    }

    /**
     * Extracts the first occurrence of text inside curly braces.
     * Example: "File: {my_image.png}" -> "my_image.png"
     */
    extractBrackets(args) {
      const str = String(args.STR);
      const match = str.match(/\{(.*?)\}/);
      // Return the captured group if found, otherwise empty string
      return match ? match[1] : "";
    }

    /**
     * Replaces the first {} (and its content) with a new string.
     */
    replaceBrackets(args) {
      const str = String(args.STR);
      const replacement = String(args.REPLACE);
      return str.replace(/\{.*?\}/, replacement);
    }

    /**
     * Checks if the string has any curly brackets.
     */
    hasBrackets(args) {
      const str = String(args.STR);
      return /\{.*?\}/.test(str);
    }
  }

  Scratch.extensions.register(new FormatExtension());
})(Scratch);
