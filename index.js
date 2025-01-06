const express = require('express');
const path = require('path');
const urlRoutes = require('./routes/url');
const {connectToMongoDB} = require('./connection');
const URL = require('./models/url');
const staticRoute = require('./routes/staticRouter')

const app = express();
const PORT = 8001

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Home views route
app.get("/test", async(req, res) => {
    const allUrls = await URL.find({});
    return res.render("home", {
        urls: allUrls,
    });
});
*/

// Routes
app.use("/url", urlRoutes);
app.use("/", staticRoute);


app.get('/url/:shortId', async(req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        { 
            $push: { 
                visitHistory: new Date() 
            },
        },
    );
res.redirect(entry.redirectUrl);
});




// Connect to MongoDB
connectToMongoDB('mongodb://127.0.0.1:27017/url-shortener')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Error connecting to MongoDB', err));



// Start the server
app.listen(PORT, () => console.log(`Server startedat PORT ${PORT}`));