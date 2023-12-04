let progressCounter = 1;

self.addEventListener('message', async (event) => {

    const { action, data,  data_source, namespace, data_type, is_file} = event.data;
    switch(action) {
        case 'embedData':
            try {
                const result = await processFileForEmbedding(data,  data_source, namespace, data_type, is_file); 
                postMessage(result);
            } catch (error) {
                postMessage({ error: error.message });
            }
            break;
        // ... other cases ...
    }
});


async function processFileForEmbedding(data,  data_source, namespace, data_type, is_file) {
    const formData = new FormData();
    if (is_file){
        formData.append("file", data);
    }else{
        formData.append("data", data);
    }
    formData.append("namespace", namespace);
    formData.append("data_source", data_source);
    formData.append("data_type", data_type);

    const response = await fetch("https://blaizzy--kulissiwa-data-data.modal.run/embed_data", {
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
                // retrun loading progress to the UI
                postMessage({ progress: parsedData.progress });
            });
            continue;
        }
        
        const parsedData = JSON.parse(message);

        // retrun loading progress to the UI
        postMessage({ progress: parsedData.progress });
    }
    postMessage({ status: 'complete'})

}
