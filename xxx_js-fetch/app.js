fetch('https://api.trace.moe/search?url=https://images.plurk.com/32B15UXxymfSMwKGTObY5e.jpg')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        for (let result of data.result) {
            console.log(`Title: ${result.filename}`);
            console.log(`Episode: ${result.episode}`);
            console.log(`Similarity: ${(result.similarity * 100).toFixed(2)}%`);
            console.log(`video: ${result.video}`);
            console.log(`image: ${result.image}`);
            console.log('---');
        }
    })
    .catch(error => {
        console.error('Error fetching dog image:', error);
    });


