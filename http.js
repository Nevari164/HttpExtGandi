(function(Scratch) {
    'use strict';

    // Whitelist domains
    const allowedDomains = [
        "jsonplaceholder.typicode.com",
        "api.example.com",
        "jsdelivr.net",
        "users.roblox.com",
        "roblox.com"
    ];

    const MAX_BODY_SIZE = 10000; // chars

    class HttpExtension {
        getInfo() {
            return {
                id: 'sandboxhttp',
                name: 'HTTP Requests',
                blocks: [
                    {
                        opcode: 'httpGet',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'GET [URL]',
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://jsonplaceholder.typicode.com/posts/1' }
                        }
                    },
                    {
                        opcode: 'httpPost',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'POST [URL] with body [BODY]',
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://api.example.com/data' },
                            BODY: { type: Scratch.ArgumentType.STRING, defaultValue: '{}' }
                        }
                    }
                ]
            };
        }

        async httpGet(args) {
            const url = args.URL;
            return await safeRequest(url, 'GET');
        }

        async httpPost(args) {
            const url = args.URL;
            let body;
            try { body = JSON.parse(args.BODY); } catch { body = null; }
            return await safeRequest(url, 'POST', body);
        }
    }

    async function safeRequest(url, method, body = null) {
        try {
            const hostname = new URL(url).hostname;
         //   if (!allowedDomains.includes(hostname)) throw new Error("Blocked domain");

            if (body && JSON.stringify(body).length > MAX_BODY_SIZE) {
                throw new Error("Body too large");
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: body ? JSON.stringify(body) : null
            });

            const text = await res.text();
            try { return JSON.parse(text); } catch { return text; }
        } catch (err) {
            return `Error: ${err.message}`;
        }
    }

    Scratch.extensions.register(new HttpExtension());
})(window.Scratch);
