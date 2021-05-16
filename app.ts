import * as bodyParser from "body-parser";
import * as express from "express";
import { APILogger } from "./logger/api.logger";
import { CateOperation } from "./controller/task.controller";
import swaggerUi = require('swagger-ui-express');
import fs = require('fs');

class App {

    public express: express.Application;
    public logger: APILogger;
    public taskController: CateOperation;

    /* Swagger files start */
    private swaggerFile: any = (process.cwd()+"/swagger/swagger.json");
    private swaggerData: any = fs.readFileSync(this.swaggerFile, 'utf8');
    private customCss: any = fs.readFileSync((process.cwd()+"/swagger/swagger.css"), 'utf8');
    private swaggerDocument = JSON.parse(this.swaggerData);
    /* Swagger files end */


    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.logger = new APILogger();
        this.taskController = new CateOperation();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {

        this.express.get('/api/cat', (req, res) => {
            let page = req.query.page || 1;
            let perPage = req.query.perPage || 30;
            this.taskController.getCat(page,perPage).then(data => res.json(data));
        });
        this.express.get('/api/cat/:id', (req, res) => {
            this.taskController.getCatWithID(req.params.id).then(data => res.json(data));
        });
        
        this.express.post('/api/addCat', (req, res) => {
            this.taskController.createCat(req,res);
        });
        
        this.express.put('/api/updateCat/:id', (req, res) => {
            this.taskController.updateCat(req,res);
        });
        
        this.express.delete('/api/delCat/:id', (req, res) => {
            this.taskController.deleteCat(req.params.id).then(data => res.json(data));
        });

        this.express.get("/", (req, res, next) => {
            res.send("Typescript App works!!");
        });

        // swagger docs
        this.express.use('/api/docs', swaggerUi.serve,
            swaggerUi.setup(this.swaggerDocument, null, null, this.customCss));

        // handle undefined routes
        this.express.use("*", (req, res, next) => {
            res.send("Make sure url is correct!!!");
        });
    }
}

export default new App().express;