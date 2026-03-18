(function(Scratch) {
    'use strict';

    // Whitelist domains
    const allowedDomains = [
        "extensions.turbowarp.org"
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
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://extensions.turbowarp.org/hello.txt' }
                        }
                    },
                    {
                        opcode: 'httpPost',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'POST [URL] with body [BODY] content type [TYPE]',
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://api.example.com/data' },
                            BODY: { type: Scratch.ArgumentType.STRING, defaultValue: '{}' },
                            TYPE: { type: Scratch.ArgumentType.STRING, defaultValue: 'application/json' }
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
            const contentType = args.TYPE || 'application/json';
            let body = args.BODY;

            // convert body if JSON type
            if (contentType === 'application/json') {
                try { body = JSON.stringify(JSON.parse(body)); } catch { body = null; }
            }

            return await safeRequest(url, 'POST', body, contentType);
        }
    }

    async function safeRequest(url, method, body = null, contentType = 'application/json') {
        try {
            const hostname = new URL(url).hostname;
            // Uncomment to enable domain whitelist
            // if (!allowedDomains.includes(hostname)) throw new Error("Blocked domain");

            if (body && body.length > MAX_BODY_SIZE) {
                throw new Error("Body too large");
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": contentType },
                body: body
            });

            const text = await res.text();

            // parse JSON if content type is JSON
            if (res.headers.get("content-type")?.includes("application/json")) {
                try { return JSON.parse(text); } catch { return text; }
            } else {
                // fallback: return plain text
                return text;
            }

        } catch (err) {
            return `Error: ${err.message}`;
        }
    }

    Scratch.extensions.register(new HttpExtension());
})(window.Scratch);
