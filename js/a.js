import express from 'express';
const app = express();



async function getRandom(str, id) {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            str += `<html><head></head><body>`;
            str += `<h1 style="font-size:25px">${data.name}</h1>`;
            str += `<img src="${data.sprites.front_default}">`;
            str += `<img src="${data.sprites.back_default}">`;
            str += `</body></html>`;
        })
        .catch(error => {
            console.error('Error fetching Pokémon data:', error);
        })
}

app.get('/', (req, res) => {
    let str = "";
    let id = Math.floor(Math.random() * 100) + 1;
    console.log(id);
    getRandom(str, id);
    res.setHeader('Content-Type', 'text/html');
    res.send(str);
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
