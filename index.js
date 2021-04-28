const { query } = require('express')
const express = require('express')
const mongodb = require('mongodb')

const connectionURL = 'mongodb://localhost:27017'
const databaseName = 'tskmngr'

//vytvorenie servera
const app = express()
const MongoClient = mongodb.MongoClient

app.use(
    express.urlencoded({
      extended: true
    })
  )

app.use(express.json())

app.post('/task/new',(req,res)=>{
    const data = req.body;
    const name = data.name;
    const priority = data.priority;
    let price;
    if(data.price){
        price = data.price;
    }
    console.log(name, ' ', priority, ' ', price);

    const done = false;
    const currentdate = new Date();

    const object = {name, priority, currentdate, done};
    if(price!=='undefined'){
        object.price = price;
    }

    console.log(object);


    MongoClient.connect(connectionURL,(error,client)=>{
        if(error){
            return console.log('NEDA sa pripojiť do databazy kámo!')
        }
        console.log('úspech s pripojením do monga ;)')
        const db = client.db(databaseName);
        db.collection('tasks').insertOne(object, (err,result)=>{
           if(error){
               console.log('nemožne uložiť data do databasi')
               res.status(400).send({"erorr": "ojojojoj"})
           }
        }) ;

    })
})


app.put('/task/done',(req,res) => {
    

        var primaryKeyInput = {};
        const id = req.query._id;
        
        if(!id){
            res.status(400).send({"error":"missing _id parameter"})
        }
      
        const filter = {}
        filter._id = new mongodb.ObjectID(id)

        const change = {}
        change.done = true

        MongoClient.connect(connectionURL,(error,client)=>{
            if(error){
                return console.log('NEDA sa pripojiť do databazy kámo!')
            }
            console.log('úspech s pripojením do monga ;)')
        const db = client.db(databaseName);
        
        db.collection("tasks").updateOne(filter, {$set: {done: false }}, function(err, res) {
            if (err) {
                res.status(400).send({"error":"neda sa pridať úlohu ;)"})
            }
            res.status(200).send({"result":"úloha bola splnená ;) :D"})
            console.log("1 document updated");
            
          });
    })
    /*
    TO - DO:
    nacitat id tasku
    prpraviť update commandn - json
    vykonat update
    return 200 alebo 400 ;) :D u know when
    */
})


app.get('',(req,res) => {
    res.send('Hello, I am your NODEJS serverik!')

})

app.listen(3000, ()=>{
    console.log("Server beží na porte 3000 ;) ")
})


app.get('/about',(req,res) => {
    res.send('tu už returnem html code<br><h1>AJAJAJ</h1>')

})


// podla nazvu sprav si dano ešte ;)
app.get('/task',(req,res) => {
    MongoClient.connect(connectionURL,(error,client)=>{
        if(error){
            return console.log('NEDA sa pripojiť do databazy kámo!')
        }
        console.log('úspech s pripojením do monga ;)')

        var filter = {};
        if(req.query.done){
            if(req.query.done=='true'){
                filter.done=true
            }else{
                filter = {done:false}
            }
        }
      
        if(req.query.priority){
            filter.priority=parseInt(req.query.priority);
        }

        const db = client.db(databaseName);
        db.collection('tasks').find(filter).toArray((err,result)=>{
            if (err) throw err;
            console.log(result);
            res.send(result)
        }) 
    })
})