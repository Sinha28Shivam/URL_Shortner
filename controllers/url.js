const { nanoid } = require('nanoid');
const Url = require('../models/url');


async function handleGenerateNewShortURL(req, res) {
    console.log(req.body); // Log the request body to debug 
    const body = req.body; 
    if(!body.url) return res.status(400).json({ message: 'URL is required' }); 
    
    const shortID = nanoid(9); // Generate a 9-character unique ID 
try { 
    await Url.create({ 
        shortId: shortID, 
        redirectUrl: body.url, 
        visitHistory: [] // Ensure this field name is correct 
        }); 
        return res.render('home', { 
            id: shortID 
        });

    } catch (error) { 
        console.error('Error creating short URL:', error); 
        return res.status(500).json({ message: 'Internal server error' }); 
    } 
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await Url.findOne({ shortId })
    return res.json({ totalClicks: result.visitHistory.length,
    visitHistory: result.visitHistory
     });
}

module.exports = { 
    handleGenerateNewShortURL,
    handleGetAnalytics
};