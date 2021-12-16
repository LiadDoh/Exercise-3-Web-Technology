const express = require('express');
const router =  express.Router();
const Site = require('../models/site');

// GET /api/sites
router.get('/', async (req, res) => {
    try {
        const sites = await Site.find();
        res.json(sites);
    } catch (err) {
        res.json({message: err});
    }
});

//Creating a new site
router.post('/', async(req, res) => {
    const site = new Site({
        name: req.body.name,
        description: req.body.description,
        imageURL: req.body.imageURL
    });
    try{
        const newSite = await site.save();
        res.status(201).json(newSite);
        createNewHTMLPage(newSite);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

//Updating a site
router.patch('/:id',getSite, async(req, res) => {
    if(req.body.name != null){
        res.site.name = req.body.name;
    }
    if(req.body.description != null){
        res.site.description = req.body.description;
    }
    if(req.body.imageURL != null){
        res.site.ImageURL = req.body.imageURL;
    }
    try{
        const updatedSite = await res.site.save();
        res.json(updatedSite);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

//Deleting a site
router.delete('/:id',getSite, async (req, res) => {
    try{
        await res.site.remove();
        res.json({message: 'Site removed'});
        deleteHTMLPage(res.site);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

async function getSite(req, res, next){
    let site;
    try{
        site = await Site.findById(req.params.id);
        if(site == null){
            return res.status(404).json({message: 'Cannot find site'});
        }
    }catch(err){
        return res.status(500).json({message: err.message});
    }
    res.site = site;
    next();
}

//Creating a new HTML page
function createNewHTMLPage(site){
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname,site.name + '.html');
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${site.name}</title>
    </head>
    <body>
        <h1>${site.name}</h1>  
        <p>${site.description}</p>
        <img src="${site.imageURL}" alt="${site.name}">
    </body>
    </html>`;
    fs.writeFile(filePath, html, (err) => {
        if(err){
            console.log(err);
        }
    });
}

//deleting a HTML page
function deleteHTMLPage(site){
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname,site.name + '.html');
    fs.unlink(filePath, (err) => {
        if(err){
            console.log(err);
        }
    });
}

module.exports = router