var express = require('express');
let router = express.Router();
var formidable = require('formidable');
var path = require("path");
var fs = require('fs');

router.post('/upload',function(req,res){
    let datas = {};
    datas.code = '0';
    datas.message = '上传图片成功';
    var form = new formidable.IncomingForm();
    console.log(form)
    form.encoding = 'utf-8';
    form.uploadDir = path.join("public/img");
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024
    let filedr = "/public/img";
    form.parse(req, function (err, fields, files) {
      console.log(files.file);
      var filename = files.file.name
      var nameArray = filename.split('.');
      var type = nameArray[nameArray.length - 1];
      var name = '';
      for (var i = 0; i < nameArray.length - 1; i++) {
          name = name + nameArray[i];
      }
      var date = new Date();
      // var time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
      //var avatarName = '/' + name + '_' + date.getTime() + '.' + type;
      var avatarName = '/' + date.getTime() + '.' + type;
      var newPath = form.uploadDir + avatarName;
      fs.renameSync(files.file.path, newPath); //重命名
      
      let data = {};
        data.name = avatarName;
        data.url = filedr + avatarName;
        datas.data = data
        res.send(datas);
      return;
  })
  })

  
module.exports = router;