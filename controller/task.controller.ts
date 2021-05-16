// import { APILogger } from '../logger/api.logger';
import { connect, disconnect } from "../config/db.config";
import { TaskModel } from '../model/task.model';
const upload = require("./upload");

export class CateOperation {

    // private logger: APILogger;
    constructor() {
        connect();
        // this.logger = new APILogger()
    }
    async paginator(items, page, perPage) {
        var page = page,
            offset = (page - 1) * perPage,
            paginatedItems = items.slice(offset).slice(0, perPage),
            total_pages = Math.ceil(items.length / perPage);
        // console.log(paginatedItems.data);
        return {
            from: ((perPage * page) - perPage) + 1,
            to: perPage * page,
            currentPage: page,
            perPage: perPage,
            total: items.length,
            lastPage: total_pages,
            content: paginatedItems
        };
    }
    async getCat(page,perPage) {
        const tasks = await TaskModel.find({});
        
        return this.paginator(tasks, page, perPage);
    }

    async getCatWithID(catID) {
        const tasks = await TaskModel.find({_id: catID});
        return tasks;
    }

    async createCat(req,res) {
        var image_array=[];
        var data:any={};
        try {
          await upload(req, res);
          if(req.body.catName==undefined || req.body.catName==null || req.body.catName==""){
            return res.status(409).json({"message":"category name is required"});
          }
          await TaskModel.find({catName:req.body.catName}, (err, result, next) => {
            if(result.length>0) {
               res.status(409).json({"message":"category name must be unique"});
            }
            else{
                req.files.forEach(image => {
                    image_array.push(image.path);
                });
                data=req.body;
                data.catImages=image_array;
                var myData = new TaskModel(data);
                myData.save(function(err, user) {
                    if (err) {
                        res.status(200).json(err);
                    }
                    else{
                        res.status(200).json(user);
                    }
                });
            }
          });
          
        } catch (error) {
          console.log(error);
      
          if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
          }
          return res.send(`Error when trying upload many files: ${error}`);
        }
        
    }

    async updateCat(req,res) {
        const id = req.params.id;
        var image_array=[];
        var data:any={};
        try {
          await upload(req, res);
          if(req.body.catName==""){
            return res.status(409).json({"message":"category name is required"});
          }
          await TaskModel.find({catName:req.body.catName}, (err, result, next) => {
            
            if(result.length>0 && result[0]._id!=id) {
               res.status(409).json({"message":"category name must be unique"});
            }
            else{
              if(req.files){
                req.files.forEach(image => { 
                  image_array.push(image.path);
                });
              }
              data=req.body;
              if(image_array.length>0)
                data.catImages=image_array;
              
                TaskModel.updateOne(
                {_id: id },
                {
                  $set:data
                },
                {
                  new:true 
                }
              )
                .then(result => {
                    res.status(200).json({"message":"category updated"});
                })
            }
          })
          
        } catch (error) {      
          if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
          }
          return res.send(`Error when trying upload many files: ${error}`);
        }
    }

    async deleteCat(catID) {
        let data: any = {};
        try {
            data = await TaskModel.deleteOne({_id : catID});
        } catch(err) {
            
        }
        return {status: `${data.deletedCount > 0 ? true : false}`};    }
}