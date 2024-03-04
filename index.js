// IMPORT MODULE || FILE
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { readFileSync, writeFileSync } = require('fs');

const app = express();
const server = http.createServer(app);

app.use(cors())

const middleware = (req, res, next) => {
    if (req.query.types) {
        next();
    } else {
        res.json({
            status: 400,
            author: 'Fahmi XD',
            error: 'Query or Value not found!'
        });
    }
};

// ENDPOINT UNTUK MENGAMBIL JUMLAH HIT DARI SERVER
app.get('/api/get-data', async (req, res) => {
    let trial;
    trial = await JSON.parse(readFileSync('./database.json', 'utf-8'));
    res.json({
        status: 200,
        data: trial,
        author: 'Fahmi XD',
        mess: 'Success get all Data'
    });
})


// ENDPOINT UNTUK MERESET JUMLAH HIT DARI CLIENT
app.post('/api/reset', async (req, res) => {
    let trial;
    trial = await JSON.parse(readFileSync('./database.json', 'utf-8'));
    await Object.keys(trial).map(key => {
        trial[key].views = 0;
        trial[key].value = 0;
    });
    await writeFileSync('./database.json', JSON.stringify(trial));
    res.json({
        status: 200,
        author: 'Fahmi XD',
        mess: 'Success reset all '
    });
});

// ENDPOINT UNTUK MENAMBAH JUMLAH HIT DARI CLIENT
app.post('/api/hit', middleware, async (req, res) => {
    const { types, value } = req.query;
    let trial;
    trial = await JSON.parse(readFileSync('./database.json', 'utf-8'));
    if (value) {
        trial[types].value += 1;
    }
    trial[types].views += 1;
    await writeFileSync('./database.json', JSON.stringify(trial));
    res.json({
        status: 200,
        author: 'Fahmi XD',
        mess: 'Success add ' + types
    });
});

// PORT DEFAULT HOSTINGAN || 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
