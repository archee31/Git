var studentsservice = require('./studentservice');

var createstudentControllerFn = async(req,res)=>{

    try{
        console.log(req.body);
        var status = await studentsservice.createstudentDBservice(req.body);
        console.log(status);
        if (status){
            res.send({ "status":true, "message":"user created succesfully"});
        }else{
            res.send({ "status":false, "message":"error"});
        }
    }
    catch(err){
        console.log(err);
    }
}

var loginUserControllerFn = async (req, res) => {
    try {
      var result = await studentsservice.loginuserDbservice(req.body);
      console.log("Result:", result);
  
      if (result.status) {
        res.send({ status: true, message: result.msg });
      } else {
        res.send({ status: false, message: result.msg });
      }
    } catch (err) {
      console.log("Error:", err);
      res.send({ status: false, message: "Internal server error" });
    }
  };
  
  

module.exports= { createstudentControllerFn , loginUserControllerFn };