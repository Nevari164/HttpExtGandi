(function(Scratch) {
  'use strict';

  class HttpPlus {
    constructor() {
      this.lastStatus = '';
      this.lastResponse = '';
    }

    getInfo() {
      return {
        id: 'godslayerakpHttpPlus',
        name: 'HTTP Plus (Fixed)',
        color1: '#4C97FF',
        blocks: [
          {
            opcode: 'request',
            blockType: Scratch.BlockType.REPORTER,
            text: '[METHOD] [URL] body [BODY] headers [HEADERS]',
            arguments: {
              METHOD: {
                type: Scratch.ArgumentType.STRING,
                menu: 'methods',
                defaultValue: 'GET'
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://api.zippopotam.us/us/90210'
              },
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              HEADERS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{"Content-Type": "text/plain"}'
              }
            }
          },
          '---',
          {
            opcode: 'getLastResponse',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last response'
          },
          {
            opcode: 'getLastStatus',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last status code'
          }
        ],
        menus: {
          methods: {
            acceptReporters: true,
            items: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
          }
        }
      };
    }

    async request(args) {
      const method = args.METHOD.toUpperCase();
      const url = args.URL;
      let headers = {};
      
      // Parse headers safely
      try {
        if (args.HEADERS) {
          headers = JSON.parse(args.HEADERS);
        }
      } catch (e) {
        console.error("Invalid Headers JSON:", e);
      }

      const options = {
        method: method,
        headers: headers
      };

      // GET and HEAD requests cannot have a body
      if (method !== 'GET' && method !== 'HEAD' && args.BODY) {
        options.body = args.BODY;
      }

      try {
        // FIXED: Using native fetch instead of Scratch.fetch
        const response = await fetch(url, options);
        this.lastStatus = response.status.toString();
        const text = await response.text();
        this.lastResponse = text;
        return text;
      } catch (err) {
        this.lastStatus = 'Error';
        this.lastResponse = err.message;
        return '';
      }
    }

    getLastResponse() {
      return this.lastResponse;
    }

    getLastStatus() {
      return this.lastStatus;
    }
  }

  Scratch.extensions.register(new HttpPlus());
})(Scratch);
