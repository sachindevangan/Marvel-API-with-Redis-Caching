import express from 'express';
import routes from './routes/index.js';
import redis from 'redis';

const app = express();
const client = redis.createClient();

(async () => {
  await client.connect();
})();

// Middleware 
app.use('/api/characters/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!client.isOpen) {
    await client.connect();
  }
  // Check if the character data is cached
  let exist = await client.exists(`character:${id}`)
  if (exist) {
    let data =await  client.get(`character:${id}`)
    let lpush = await client.LPUSH(`historyofCharacters`, data); 
  
    return res.status(200).send(JSON.parse(data));
  } else {
  next()
  }
});



app.use('/api/characters/history', async (req, res, next) => {
  try {
    // Check if the character history data is cached

    const charIds = await client.LRANGE('historyofCharacters', 0, 19);

    return res.status(200).json(charIds.map(JSON.parse));
  } catch (error) {
    next(error);
  }
});
    

app.use('/api/comics/:id', async (req, res, next) =>{
  const {id} = req.params;
    let exist = await client.exists(`comic:${id}`)

  if (exist) {
    let comicData =await  client.get(`comic:${id}`)
  
    return res.status(200).json(JSON.parse(comicData));
  } else {
  next()
  }
});

app.use('/api/stories/":id', async (req, res, next) => {
  const {id} = req.params;

    let exist = await client.exists(`story:${id}`)

    if (exist) {
      let data =await client.get(`story:${id}`)
    
      return res.status(200).send(JSON.parse(data));
    } else {
    next()
    }
});


// Use the routes defined in routes/index.js
routes(app); // Use the constructorMethod function

  

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
