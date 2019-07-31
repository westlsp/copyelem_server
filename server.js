var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var uploadimg = require('./public/js/upload_img')
var session = require("express-session");
var NedbStore = require('nedb-session-store')( session );
var bodyParser = require('body-parser')  
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json())
var mysql=require('mysql');
//var cors = require('cors');
const sessionMiddleware = session({
  secret: "fas fas",
  resave: false,
  saveUninitialized: true,
  cookie: {
    //path: '/',
    //httpOnly: true,
    maxAge:30* 60 * 1000,  // e.g. 1 year
    secure: false
  },
  store: new NedbStore({
    filename: 'path_to_nedb_persistence_file.db'
  })
})
app.use(sessionMiddleware);
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", "true"); 
// res.header('Access-Control-Allow-Origin', '*');
　　res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
　　res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild,Cache-Control');
　　res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
　　if (req.method == 'OPTIONS') {
　　　　res.send(200); /*让options请求快速返回*/
　　} else {
　　　　next();
　　}
})
app.use('/public', express.static('public'));
var connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'123456',
  port:'3306',
  database:'es6web'
})
connection.connect();

app.post('/register',function(req,res){
  let sql="insert into customer(username,password,email) values(?,?,?)";
  let dataparams=[req.body.username,req.body.password,req.body.email];
  connection.query(sql,dataparams,function(err,result){
      if(err){
        res.send('连接失败')
        console.log(err);
        return;
      }
      if(result.affectedRows==1)
      {
        res.send("success");
      }
      else{
        res.send("fail");
      }
      console.log(result.affectedRows);
  })
})
app.post('/logincheck',function(req,res){
  //console.log(req.cookies);
  let sql="SELECT username,email,touxiang,dingdan,zuji,hongbao,zichang,jinbi,phone,address FROM customer where username=? and password=?";
  let dataparams=[req.body.username,req.body.password];
  /*var session=req.session;
  if(!session.num){
    session.num=0;
  }
  console.log(++session.num);*/
  connection.query(sql,dataparams,function (err, result) {
    if(err){
      res.send('连接失败')
      console.log(err);
      return;
    }

    if(result[0]==undefined)
    {
      res.send('fail2');
      console.log('fail2');
    }
    else{
      res.send(result[0])
      //req.session=result[0];
      console.log('success');
    }
  });
})
app.post('/updateimg',function(req,res) {
  //console.log(req.body.touxiang+req.body.username)
  let sql
  if(req.body.flag==1)
  {
    sql="update customer set touxiang='"+req.body.touxiang+"' where username='"+req.body.username+"'"
    connection.query(sql)
  }
  else if(req.body.flag==2)
  {
    sql="update manger set storelogo='"+req.body.storelogo+"' where username='"+req.body.username+"'"
    connection.query(sql)
  }
  else if(req.body.flag==3)
  {
    sql="select food from manger where username='"+req.body.username+"'"
    connection.query(sql,function(err,result){
      let datac=JSON.parse(result[0].food)
      //console.log(datac.length)
      for(let i=0;i<datac.length;i++){
        if(datac[i].zubie==req.body.zubie)
        {
          datac[i].content[req.body.weizhi].img=req.body.foodimg
          break
        }
      }
      
      sql="update manger set food=? where username=?";
      let dataparams=[JSON.stringify(datac),req.body.username];
      connection.query(sql,dataparams)
    })
  }
  //console.log(sql)
  res.send('updateimg')
})
app.post('/updatefoneml',function(req,res){
  let sql="update customer set email=?,phone=? where username=?"
  let dataparams=[req.body.email,req.body.phone,req.body.username];
  connection.query(sql,dataparams)
  res.send('updatefoneml')
})
app.post('/insertlocation',function(req,res){
  let sql="update customer set address=? where username=?";
  let dataparams=[req.body.addressall,req.body.username];
  connection.query(sql,dataparams)
  res.send("success");
})
app.post('/mangerlogin',function(req,res){
  let sql="SELECT username,email,storename,storeaddress,foodtype,bossname,bosssfz,phone,storelogo,dingdan,food,gonggao,money,peisongsetting,openflag FROM manger where username=? and password=?";
  let dataparams=[req.body.username,req.body.password];
  connection.query(sql,dataparams,function(err, result){
    if(result[0]==undefined)
    {
      res.send('fail1');
      console.log('fail1');
    }
    else{
      res.send(result[0])
      //req.session=result[0];
      console.log('success');
    }
  });
})
app.post('/registerstore',function(req,res){
  let sql="insert into manger(username,password,email,storename,storeaddress,foodtype,bossname,bosssfz,phone) values(?,?,?,?,?,?,?,?,?)";
  let dataparams=[req.body.username,req.body.password,req.body.email,req.body.storename,req.body.address,req.body.foodtype,req.body.bossname,req.body.sfz,req.body.phone];
  connection.query(sql,dataparams,function(err,result){
    if(err){
      res.send('连接失败')
      console.log(err);
      return;
    }
    if(result.affectedRows==1)
    {
      res.send("success");
    }
    else{
      res.send("fail");
    }
    console.log(result.affectedRows);
})
})
app.post('/updatebusiness',function(req,res){
  let sql
  let dataparams
  if(req.body.flag==1){
     sql="update manger set peisongsetting=? where username=?";
     dataparams=[req.body.peisongsetting,req.body.username];
  }
  else if(req.body.flag==2){
     sql="update manger set food=? where username=?";
     dataparams=[req.body.food,req.body.username];
  }
  else if(req.body.flag==3){
    sql="update manger set openflag=? where username=?";
     dataparams=[req.body.openflag,req.body.username];
  }
  //console.log(req.body.peisongsetting+req.body.username)
  connection.query(sql,dataparams,function(err,result){
    if(result.affectedRows==1)
    {
      res.send("success");
    }
    else{
      res.send("fail");
    }
  })
})
app.post('/getstorecon',function(req,res){
  let sql='select username,storename,storelogo,storeaddress,foodtype,bossname,phone,food,gonggao,peisongsetting from manger where openflag=1'
   connection.query(sql,function(err,result){
     res.send(result)
   })
})
app.post('/shikedingdan',function(req,res){
  let sql;
  let dataparams;
  sql="select dingdan from customer where username=?"
  dataparams=[req.body.username]
  connection.query(sql,dataparams,function(err,result){
     if(result[0].dingdan==null || result[0].dingdan=='')
     {
       sql="update customer set dingdan=? where username=?"
       dataparams=[req.body.dingdandata,req.body.username]
       connection.query(sql,dataparams,function(err,result){
          res.send("success")
       })
     }
     else{
       let dataz=JSON.parse(result[0].dingdan)
       let datas=JSON.parse(req.body.dingdandata)
       for(let i=0;i<datas.length;i++)
       {
          dataz.push(datas[i])
       }
       sql="update customer set dingdan=? where username=?"
       dataparams=[JSON.stringify(dataz),req.body.username]
       connection.query(sql,dataparams,function(err,result){
        res.send("success")
     })
     }
  })
})
app.post('/storedingdan',function(req,res){
  let sql;
  let dataparams;
  sql="select dingdan from manger where username=? and storename=?"
  dataparams=[req.body.username,req.body.storename]
  connection.query(sql,dataparams,function(err,result){
    if(result[0].dingdan==null || result[0].dingdan=='')
    {
      let arr=[]
      arr.push(JSON.parse(req.body.msgsum))
      sql="update manger set dingdan=? where username=? and storename=?"
      dataparams=[JSON.stringify(arr),req.body.username,req.body.storename]
      connection.query(sql,dataparams,function(err,result){
         res.send("success1")
      })
    }
    else
    {
      let dataz=JSON.parse(result[0].dingdan)
      let datas=JSON.parse(req.body.msgsum)
      dataz.push(datas)
      sql="update manger set dingdan=? where username=? and storename=?"
      dataparams=[JSON.stringify(dataz),req.body.username,req.body.storename]
      connection.query(sql,dataparams,function(err,result){
       res.send("success1")
      })
    }
  })
})
app.use(uploadimg);


let server = require('http').createServer(app);
server = app.listen(3000, function () {
 
  let host = server.address().address
  let port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})
var io = require('socket.io')(server);
io.on('connection', function (socket) {
  socket.emit('connect')
  socket.on("login",function(){
    socket.join('room')
  })
  socket.on("gengxinmsg", function(obj) {
    //延迟3s返回信息给客户端
        console.log('the websokcet message is'+JSON.stringify(obj));
        //let name='store'+obj.username
        //console.log(name)
        //delete obj["username"]
        socket.broadcast.to('room').emit("allstoredingdan",JSON.stringify(obj))
        //socket.emit("msg", obj);
  });
})