(function () {
    if (!window.GandiIDE) return console.error("Gandi IDE not found");

    const allowedDomains = ["jsonplaceholder.typicode.com", "api.example.com"];

    // create HTTP request block
    window.GandiIDE.createBlock({
        name: "HTTP Request",
        category: "Network",
        inputs: [
            { name: "URL", type: "string" },
            { name: "Method", type: "dropdown", options: ["GET", "POST"] },
            { name: "Body", type: "string", optional: true }
        ],
        execute: async function (inputs) {
            try {
                const url = inputs.URL;
                const method = inputs.Method;
                const body = inputs.Body ? JSON.parse(inputs.Body) : null;

                const hostname = new URL(url).hostname;
                if (!allowedDomains.includes(hostname)) {
                    throw new Error("Blocked domain: " + hostname);
                }

                const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: body ? JSON.stringify(body) : null
                });

                const text = await response.text();
                let data;
                try { data = JSON.parse(text); } catch { data = text; }

                console.log("HTTP Response:", data);
                return data;
            } catch (err) {
                console.error("HTTP Block Error:", err);
                return { error: err.message };
            }
        }
    });

    console.log("HTTP Request code block loaded");

})();
