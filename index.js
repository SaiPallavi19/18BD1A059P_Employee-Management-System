//import path from 'path';
//const _dirname = path.dirname(new URL(import.meta.url).pathname);
const fs=require("fs");
const json2xls=require("json2xls");
//const path = require('path');
//const dirPath = path.join(__dirname);
var express=require("express");
var app=express();
//var middleware=require("./middleware");
//var server=require("./server");
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/views"));
app.use(express.static(__dirname+"/public"));
const MongoClient=require("mongodb").MongoClient;
const url="mongodb://127.0.0.1:27017";
const dbName="InventoryManagement";
let db;
MongoClient.connect(url,{ useUnifiedTopology: true },function(err,client){
    if(err){
        return;
    }
    db=client.db(dbName);
    console.log("connection is established");
});
app.get("/",(req,res)=>{
    async function test(){
    let result=await db.collection("Inventory").find({}).project({_id:0}).toArray();
    //await console.log(result);
    let xls=await json2xls(result);
    await fs.writeFile("public/ItemDetails.xlsx",xls,'binary',(err)=>{})
    await res.render("index.ejs",{ items: result});
    }
    test();
});app.get("/edit",(req,res)=>{
    res.render("edit.ejs",{"id":req.query["id"]});
});app.get("/delete",(req,res)=>{
    async function del(){
        await db.collection("Inventory").deleteOne(req.query);
        await res.redirect("/");
    }
    del();
});app.get("/add",(req,res)=>{
    res.render("addItem.ejs");});app.post("/add",(req,res)=>{
    async function ad(){
        await db.collection("Inventory").insertOne(req.body);
        await res.redirect("/");
        
    }
    ad();
});app.post("/edit",(req,res)=>{
    async function ed(){
        await db.collection("Inventory").updateOne({"id":req.body["id"]},
        {$set:{"actual_price":req.body["actual_price"],"selling_price":req.body["selling_price"]}});
        await res.redirect("/");
        
    }
    ed();
});
app.listen(2075);