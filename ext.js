(function (global) {
    const allowedDomains = ["api.example.com"];

    async function secureFetch({ url, method, body }) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: body ? JSON.stringify(body) : null,
                signal: controller.signal
            });

            clearTimeout(timeout);

            return {
                status: res.status,
                data: await res.json()
            };
        } catch (err) {
            return {
                status: 500,
                error: err.message
            };
        }
    }

    const SafeHTTP = {
        async request(url, options = {}) {
            const parsed = new URL(url);

            // 🔒 domain lock
            if (!allowedDomains.includes(parsed.hostname)) {
                throw new Error("Blocked domain");
            }

            // 🔒 method lock
            const method = (options.method || "GET").toUpperCase();
            if (!["GET", "POST"].includes(method)) {
                throw new Error("Invalid method");
            }

            // 🔒 payload limit
            if (options.body && JSON.stringify(options.body).length > 5000) {
                throw new Error("Payload too large");
            }

            return await secureFetch({
                url,
                method,
                body: options.body
            });
        }
    };

    // expose to global
    global.SafeHTTP = SafeHTTP;

})(window);

