self.addEventListener('message', async (event) => {
    const { data,  data_source, namespace, data_type, crawl, excluded_urls} = event.data;
    const formData = new FormData();
    formData.append("data", data);
    formData.append("namespace", namespace);
    formData.append("data_source", data_source);
    formData.append("data_type", data_type);
    formData.append("crawl", crawl);
    formData.append("excluded_urls", excluded_urls);

    const response = await fetch("https://blaizzy--kulissiwa-data-data.modal.run/embed_url", {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        this.error = "Error embedding data, please refresh and try again"
        setTimeout(() => {
        this.error = ""
        }, 2000);
    }

    const reader = response.body.getReader();

    let decoder = new TextDecoder();

    // Read the streamed data as it's received
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const message = decoder.decode(value, { stream: true }).replace(/data: /g, '').trim();
        const messages = message.split(/\n+/);
        if (messages.length > 1) {
            messages.forEach((message) => {
                const parsedData = JSON.parse(message);
                // return loading progress to the UI
                postMessage({ progress: parsedData.progress });
            });
        } else {
            const parsedData = JSON.parse(message);
            // return loading progress to the UI
            postMessage({ progress: parsedData.progress });
        }
    }
   
    // return the final result to the UI
    postMessage({ status: 'complete'})
});