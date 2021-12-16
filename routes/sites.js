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
module.exports = router