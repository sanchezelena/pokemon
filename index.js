const http = require('http')
const fs = require('fs')

const fetchPokemonData = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./pokedex.json', 'utf-8', (err, data) => {
            if(err) {
                reject(err)
            }else{
                resolve(JSON.parse(data));
            }
        })
    })
}

const handleRequest = async(req,res) => {
    const pokemonData = await fetchPokemonData()
    const param = decodeURI(req.url.substring(1))

    let pokemon; 
    if(!isNaN(param)) {
        pokemon = pokemonData.find(p => p.id.toString() === param);
    } else {
        pokemon = pokemonData.find(p => {
            const names = [
                p.name.english,
                p.name.japanese,
                p.name.chinese,
                p.name.french,
            ];
            return names.some(name => name === param);
        });

    }

    if (pokemon) {
        const response = {
            'Tipo': pokemon.type,
            'HP': pokemon.base.HP,
            'Attack': pokemon.base.Attack,
            'Defense': pokemon.base.Defense,
            'Sp. Attack': pokemon.base['Sp. Attack'],
            'Sp. Defense': pokemon.base['Sp. Defense'],
            'Speed': pokemon.base.Speed
        }

        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.end(JSON.stringify(response))
    }else{
        res.writeHead(400, {'Content-Type' : 'text/plain'})
        res.end('No existe ningún Pokemon con ese nombre o ID')
    }
}

const server = http.createServer(handleRequest)

server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000')
})