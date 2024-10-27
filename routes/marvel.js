import {Router} from 'express'
import redis from 'redis';
import axios from 'axios';
import md5 from 'blueimp-md5';

const router = Router();
const client = redis.createClient();

(async () => {
  await client.connect();
})();


router
.route('/characters/:id')
.get( async (req, res) => {
  const { id } = req.params;

  // Fetch character data from Marvel API
  const publicKey = '9f21335888c4dcdcf185e6ec54d57098';
  const privateKey = '9835ef68c5da41d4945e66ad688ea918e31d4ba5';
  const ts = new Date().getTime();
  const stringToHash = ts + privateKey + publicKey;
  const hash = md5(stringToHash);
  const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
  const url = `${baseUrl}/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;


  try {
    const response = await axios.get(url);

    if (response.data.data.results.length === 0) {
      // Character not found in Marvel API
      return res.status(404).json({ message: 'Character not found' });
    } else {
      const characterData = response.data.data.results[0];
      const characterId = characterData.id;

      // Store the character data in Redis cache
      let success = await client.set(`character:${characterId}`, JSON.stringify(characterData));
      let lpush = await client.LPUSH(`historyofCharacters`, JSON.stringify(response.data.data.results[0])); 
      console.log(success)

      // Send the character data as JSON response
      return res.status(200).json(characterData);

    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});


// Route to get character history
router
.route('/characters/history')
.get(async (req, res) => {
  try {
    // Get the recently viewed character IDs from the cache
    const charIds = await client.LRANGE('historyofCharacters', 0, 19);

    return res.status(200).json(charIds.map(JSON.parse));
  } catch (error) {}

})


  // Route to get comic by ID
router
.route('/comics/:id')
.get(async (req, res) => {
    const { id } = req.params;
  
        // Comic data not in cache, fetch it from the Marvel API
        const publicKey = '9f21335888c4dcdcf185e6ec54d57098';
        const privateKey = '9835ef68c5da41d4945e66ad688ea918e31d4ba5';
        const ts = new Date().getTime();
        const stringToHash = ts + privateKey + publicKey;
        const hash = md5(stringToHash);
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
        const url = `${baseUrl}/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  
        try {
          const response = await axios.get(url);
  
          if (response.data.data.results.length === 0) {
        
            return res.status(404).json({ message: 'Comic not found' });
          } else {
            const comicData = response.data.data.results[0];
            const comicId = comicData.id;
  
            // Store the comic data in Redis cache
            let data = await client.set(`comic:${comicId}`, JSON.stringify(comicData));
  
            // Send the comic data as JSON response
            return res.json(comicData);
          }
        } catch (error) {
          console.error(error);
          return res.status(500).send(error);
        }
      }
  );


  // Route to get story by ID
router
.route('/stories/:id')
.get(async (req, res) => {
    const { id } = req.params;

        // Story data not in cache, fetch it from the Marvel API
        const publicKey = '9f21335888c4dcdcf185e6ec54d57098';
        const privateKey = '9835ef68c5da41d4945e66ad688ea918e31d4ba5';
        const ts = new Date().getTime();
        const stringToHash = ts + privateKey + publicKey;
        const hash = md5(stringToHash);
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/stories';
        const url = `${baseUrl}/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  
        try {
          const response = await axios.get(url);
  
          if (response.data.data.results.length === 0) {
            // Story not found in Marvel API
            return res.status(404).json({ message: 'Story not found' });
          } else {
            const storyData = response.data.data.results[0];
            const storyId = storyData.id;
  
            // Store the story data in Redis cache
            let data = await client.set(`story:${storyId}`, JSON.stringify(storyData));
  
            // Send the story data as JSON response
            return res.json(storyData);
          }
        } catch (error) {
          console.error(error);
          return res.status(500).send(error);
        }
      }
  );


export default router;
