const express = require('express');
const router = express.Router();
const Site = require('../models/site');

// GET /api/sites
router.get('/', async(req, res) => {
    try {
        const sites = await Site.find();
        res.json(sites);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

//Creating a new site
router.post('/', checkSite, async(req, res) => {
    const site = new Site({
        name: req.body.name,
        description: req.body.description,
        imageURL: req.body.imageURL,
        backgroundImageURL: req.body.backgroundImageURL
    });
    try {
        const newSite = await site.save();
        res.status(201).json(newSite);
        recreateHTMLPages();
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

//Updating a site
router.patch('/:id', getSite, checkSite, async(req, res) => {
    if (req.body.name != null) {
        deleteHTMLPage(res.site);
        res.site.name = req.body.name;
    }
    if (req.body.description != null) {
        res.site.description = req.body.description;
    }
    if (req.body.imageURL != null) {
        res.site.imageURL = req.body.imageURL;
    }
    if (req.body.backgroundImageURL != null) {
        res.site.backgroundImageURL = req.body.backgroundImageURL;
    }
    try {
        const updatedSite = await res.site.save();
        res.json(updatedSite);
        // if name changed, delete old HTML page and create new one
        recreateHTMLPages();
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

//Deleting a site
router.delete('/:id', getSite, async(req, res) => {
    try {
        await res.site.remove();
        res.json({
            message: 'Site removed'
        });
        deleteHTMLPage(res.site);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// Deletion of all sites
router.delete('/', async(req, res) => {
    try {
        await Site.deleteMany();
        res.json({
            message: 'All sites removed'
        });
        deleteAllHTMLPages();
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

async function getSite(req, res, next) {
    let site;
    try {
        site = await Site.findById(req.params.id);
        if (site == null) {
            return res.status(404).json({
                message: 'Cannot find site'
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
    res.site = site;
    next();
}

//Creating a new HTML page
async function recreateHTMLPages() {
    const fs = require('fs');
    const path = require('path');
    const sites = await Site.find();
    sites.forEach(site => {
                const filePath = path.join(__dirname, site.name + '.html');
                const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel = "stylesheet" href = "./style/style.css" >
            <title>${site.name}</title>
        </head>
        <body class="sites_body" style="background-image: url(${site.backgroundImageURL})">
            <div class = "topnav" >
            <a class="active" href="./index.html">Home</a>
                <div class="dropdown">
                <button class="dropbtn">Dropdown Menu</button>
                <div class="dropdown-content">
                        ${sites.map(thisSite => `<a href="${thisSite.name}.html">${thisSite.name}</a>`).join('')}
                </div>
            </div>
        </div>
        <div class = "container">
            <h1>${site.name}</h1>  
            <div class="text">${site.description}</div>
            <img class="subpic" src="${site.imageURL}" alt='Image not found' onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/3/32/Ferret_2008.png';">
        </div>
        </body>
        </html>`;
        fs.writeFile(filePath, html, (err) => {
            if (err) {
                console.log(err);
            }
        });
    })
    editHTMLPage()
}


//deleting a HTML page
function deleteHTMLPage(site) {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, site.name + '.html');
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
    editHTMLPage();
}

//find and edit HTML page
async function editHTMLPage() {
    const sites = await Site.find();
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'index.html');
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <title>Yese of Top 5 Beautiful Sites</title>
	<meta charset = "UTF-8">
	<meta name = "description" content = "Top 5 Most Beautiful Sites">
	<link rel = "icon"	href="https://upload.wikimedia.org/wikipedia/commons/b/b2/Sevel_Logo.png">
	<link rel = "stylesheet" href = "./style/style.css" >
    </head>
    <body class = "index_body">
        <div class = "topnav" >
            <a class="active" href="./index.html">Home</a>
                <div class="dropdown">
                <button class="dropbtn">Dropdown Menu</button>
                <div class="dropdown-content">
                    ${sites.map(site => `<a href="${site.name}.html">${site.name}</a>`).join('')}
                </div>
            </div>
        </div>
        <h1 >Top 5 Most Beautiful Sites</h1>
        <div class = "container">
            <ul class="list" style="list-style: none;">
            ${sites.map(site => `<li class="list-item">
                <a class="list_content" href="${site.name}.html">
                <img src="${site.imageURL}" alt='Image not found' onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/b/b2/Sevel_Logo.png';" width='100' height='100'>
                  ${site.name}</a>
            </li>`).join('')}
            </ul>
        </div>
	</body>
	</html>`;
    fs.writeFile(filePath, html, (err) => {
        if (err) {
            console.log(err)
        }
    });
}

//check if a site exists by name
function checkSite(req, res, next) {
    if (req.body.name != null && req.body.name.length > 20) {
        return res.status(400).json({
            message: 'Site name is too long'
        });
    }
    Site.findOne({
        name: req.body.name
    }, (err, site) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }
        if (site != null) {
            return res.status(400).json({
                message: 'Site already exists'
            });
        }
        next();
    });
}

// delete all HTML pages except index.html
function deleteAllHTMLPages() {
    const fs = require('fs')
    const path = require('path')
    const sites = fs.readdirSync(__dirname)
    for (let i = 0; i < sites.length; i++) {
        if (sites[i] != 'index.html' && sites[i].endsWith('html')) {
            fs.unlink(path.join(__dirname, sites[i]), (err) => {
                if (err) {
                    console.log(err)
                }
            });
        }
    }
    editHTMLPage();
}

// Read sites from json to mongoDB
async function readSitesFromJson() {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(__dirname, './five_sites/five_sites.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const sites = JSON.parse(data)
    sites.forEach(site => {
        Site.findOne({
            name: site.name
        }, (err, foundSite) => {
            if (foundSite) {

            } else if (err) {
                console.log(err)
            } else {
                const newSite = new Site({
                    name: site.name,
                    description: site.description,
                    imageURL: site.imageURL,
                    backgroundImageURL: site.backgroundImageURL
                });
                newSite.save((err) => {
                    if (err) {
                        console.log(err)
                    }
                });
            }
        })
    });
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(recreateHTMLPages()), 1000)
    });
}


module.exports = router
module.exports.readSitesFromJson = readSitesFromJson;