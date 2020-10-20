const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser = require('body-parser');
const tmp = require('tmp');
const fs = require('fs');
const Handlebars = require('handlebars');

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.use(express.static('./templates'));
app.post('/generate-graph', async (req, res)=> {
    const graphsData = req.body;

    tmp.file( {postfix: '.html'}, async (err, path, fd) => {
        if (err) return res.send(err.message).status(500);
       
        console.log('File: ', path);
        console.log('Filedescriptor: ', fd);
        
        let templateData = await new Promise((resolve, reject)=> {
            fs.readFile('./templates/charts.js.html', (err, data) => {
                if (err) return reject(err);
                resolve(data.toString());
            });
        });

        const template = Handlebars.compile(templateData, {noEscape: true});

        await new Promise((resolve, reject)=> {
            fs.writeFile(path, template({data : JSON.stringify(graphsData)}), (err) => {
                if (err) return reject(err);
                console.log('The file has been saved!');
                resolve();
              });
        });

        const browser = await puppeteer.launch({
            args: [
              // Required for Docker version of Puppeteer
              '--no-sandbox',
              '--disable-setuid-sandbox',
              // This will write shared memory files into /tmp instead of /dev/shm,
              // because Docker’s default for /dev/shm is 64MB
              '--disable-dev-shm-usage'
            ]
          });
        const page = await browser.newPage();

        await page.goto(`file://${path}`,{waitUntil: 'networkidle2'});

        const imagePath = await new Promise((resolve, reject) => {
            tmp.file( {postfix: '.png'}, async (err, path, fd) => {
                if (err) return res.send(err.message).status(500);
                resolve(path);
            });
        });

        await page.waitFor(250);
        await page.screenshot({path: imagePath});
        await browser.close();

        var stream = fs.createReadStream(imagePath);

        stream.on('error', function(error) {
            res.writeHead(404, 'Not Found');
            res.end();
        });

        return stream.pipe(res);
      });
});

app.listen(3000, ()=> {
    console.log('server listening')
});
