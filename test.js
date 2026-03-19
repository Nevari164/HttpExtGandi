(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Must run unsandboxed");
  }

  class MyExtension {
    getInfo() {
      return {
        id: 'myext',
        name: 'My Extension',
        blocks: [
          {
            opcode: 'test',
            blockType: Scratch.BlockType.COMMAND,
            text: 'test block'
          }
        ]
      };
    }

    test() {
      console.log("working");
    }
  }

  Scratch.extensions.register(new MyExtension());
})(Scratch);
