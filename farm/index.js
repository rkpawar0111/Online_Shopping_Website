require('dotenv').config();
var express = require ('express');
var mysql = require ('mysql');
var app = express();
var bodyparser = require('body-parser');
const sgMail = require('@sendgrid/mail');

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname+ "/public"));
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var connection = mysql.createConnection({
	host :'localhost',
	user :'root',
	database :'farm'
});


app.get("/",function(req,res){
	res.render('front');
});

app.post("/signup",function(req,res){
	res.render("signup");
});

app.post("/fsignup",function(req,res){
		res.render("fsignup");
});

app.post("/csignup",function(req,res){
	res.render("csignup");
});


app.post("/login",function(req,res){
	res.render("login");
});

app.post("/clogin",function(req,res){
	res.render("clogin");
});

app.post("/flogin",function(req,res){
	res.render("flogin");
});


app.post("/fregister",function(req,res){
	var person ={
		ffname:req.body.fname,
		flname:req.body.lname,
		flog_name:req.body.log_name,
		flog_pass:req.body.log_pass,
		mobile:req.body.mob,
		email:req.body.email,
		address:req.body.add
	};
	
	var q="SELECT * FROM farmer ";
	connection.query(q,function(err,result){
		if (err) throw err;
		for( var i=0;i<result.length;i++){
			if(result[i].flog_name == req.body.log_name){
				res.render("signuperror");
				break;
			}
			if(i+1 == result.length){
				connection.query('INSERT INTO farmer SET?',person,function(err,result){
		               if (err) throw err;
		                console.log("Enrolled : "+req.body.fname+" "+req.body.lname);
					res.render("flogin");
	             });
			}
		}
	});
});

app.post("/cregister",function(req,res){
	var person ={
		cfname:req.body.fname,
		clname:req.body.lname,
		clog_name:req.body.log_name,
		clog_pass:req.body.log_pass,
		mobile:req.body.mob,
		email:req.body.email,
		address:req.body.add
	};
	var q="SELECT * FROM customer ";
	connection.query(q,function(err,result){
		if (err) throw err;
		for( var i=0;i<result.length;i++){
			if(result[i].clog_name == req.body.log_name){
				res.render("signuperror");
				break;
			}
			if(i+1 == result.length){
				connection.query('INSERT INTO customer SET?',person,function(err,result){
				if (err) throw err;
				console.log("Enrolled : "+req.body.fname+" "+req.body.lname);
					  res.render("clogin");
				});
			}
		}
		
	});
});

app.post("/homefront1/:cid",function(req,res){
	res.render('homefront1',{cid:req.params.cid});
});

app.post("/profile/:cid",function(req,res){
	var person = "select concat(cfname,'.',clname) as name,mobile,email,address from customer where cid = ?";
	connection.query(person,req.params.cid,function(err,result){
		if (err) throw err;
		res.render('profile',{data:result,cid:req.params.cid});
	});
});

app.post("/transcation/:cid",function(req,res){
	var person = "SELECT p.pname,p.price,t.quantity,t.total FROM product p,transaction t WHERE p.pid=t.pid AND t.cid = ? ORDER BY tid DESC";
	connection.query(person,req.params.cid,function(err,result){
		if (err) throw err;
		res.render('transaction',{data:result,cid:req.params.cid});
	});
});


var z;

app.post("/homec",function(req,res){
	var q="select * from customer ";
	connection.query(q,function(err,result){
		if (err) throw err;
		 z=1;
		for(var i=0;i<result.length;i++){
			if(result[i].clog_pass === req.body.logpass && result[i].clog_name === req.body.logname){
				z=0;
				res.render("homefront",{cid:result[i].cid});
				break;
			}
		}
		if(z == 1){
				res.render("cloginerror");
			}
	});
});

var w;

app.post("/homef",function(req,res){
	var q="select * from farmer ";
	connection.query(q,function(err,result){
		if (err) throw err;
		 w=1;
		for(var i=0;i<result.length;i++){
			if(result[i].flog_pass === req.body.logpass && result[i].flog_name === req.body.logname){
				w=0;
				res.render("homefront2",{fid:result[i].fid});
				break;
			}
		}
		if(w == 1){
				res.render("floginerror");
			}
	});
});


app.post("/home1/:cid",function(req,res){
	var q="SELECT pname,price FROM product ";
	connection.query(q,function(err,result){
		if (err) throw err;
		res.render("home",{data:result,cid:req.params.cid});
	});
});

app.post("/home2/:fid",function(req,res){
	var person=req.params.fid;
	
	var q="select p.pid,p.pname,round(avg(rt),1) as avg_rating from farmer f,product p,rating r where f.fid=p.fid and p.pid=r.pid and p.fid=? group by p.pid order by p.pid";
	connection.query(q,person,function(err,result1){
		if (err) throw err;
		var t="select p.pid,r.rv from farmer f,product p,review r where f.fid=p.fid and p.pid=r.pid and p.fid=? order by p.pid";
		connection.query(t,person,function(err,result2){
			if (err) throw err;
			res.render("hmfarm",{data1:result1,data2:result2});
		});
	});
});


app.post("/item/:id/:cid",function(req,res){
	
	var tm=req.params.id;
	var q="SELECT * FROM product where pid = ?";
	connection.query(q,tm,function(err,result){
		if (err) throw err;
		res.render("purchase",{data:result,pid:tm,cid:req.params.cid});
	});
});

app.post("/buy/:pid/:cid",function(req,res){
	var r = 0;
	var cd = req.params.cid;
	if(req.body.quantity >0 && req.body.quantity<6){
		var q = "SELECT price FROM product WHERE pid=?";
		connection.query(q,req.params.pid,function(err,result){
		if (err) throw err;
		r = result[0].price;
	var total = (req.body.quantity * r);
	console.log("total");
	console.log(total);
	var person = {
		pid:req.params.pid,
		pincode:req.body.pincode,
		quantity:req.body.quantity,
		total:total,
		cid:req.params.cid
	};
	var p="INSERT INTO transaction SET?";
	connection.query(p,person,function(err,result1){
		if (err) throw err;
		console.log(result1);
	var q="SELECT concat(cfname,'.',clname) as name,cid,mobile,address FROM customer where cid = ?";
	connection.query(q,cd,function(err,result2){
		if (err) throw err;
	var s="select p.pid,p.pname,p.price,t.quantity,t.total from product p,transaction t where p.pid=t.pid order by t.tid desc limit 1";
	connection.query(s,function(err,result3){
		if (err) throw err;
		res.render("confirmpurchase",{cid:req.params.cid,info:result2,pincode:req.body.pincode,data:result3});
		     });
		  });
	   });
	});
  }
});


app.post("/final/:cid/:pname/:quantity/:total",function(req,res){
	var eid;
	var person = req.params.cid;
	var q = "SELECT * FROM customer WHERE cid=?";
	connection.query(q,person,function(err,result){
		if (err) throw err;
		eid = result[0].email;
		res.render('final',{cid:person,mail:eid,pname:req.params.pname,quantity:req.params.quantity,total:req.params.total});
	});
});

app.post("/thanks/:cid/:mail",function(req,res){
	res.render('thanks',{cid:req.params.cid,mail:req.params.mail});
});


app.post("/mail/:cid/:mail/:pname/:quantity/:total",async(req,res)=>{
	const msg = {
  to: req.params.mail,
  from: 'rakshitgpawar@gmail.com',
  subject: 'Purchase confirmation',
  text: 'Purchase confirmed',
  html: `<strong>THANKS FOR BUYING FROM RK FARM-PRODUCTS</strong><br>ITEM:${req.params.pname}<br>QUANTIY:${req.params.quantity}<br>TOTAL:${req.params.total}`,
};
	try {
    await sgMail.send(msg);
		res.render('thanks',{cid:req.params.cid,mail:req.params.mail});
  } catch (error) {
    console.error(error);
 
    if (error.response) {
      console.error(error.response.body);
		res.render('thanks2a',{cid:req.params.cid,mail:req.params.mail});
    }
  }
});

app.post("/review/:pid/:cid",function(req,res){
	var tm=req.params.pid;
	var q="SELECT cfname,rv FROM review r,customer c,product p where r.cid=c.cid and r.pid=p.pid and p.pid=?";
	var z="SELECT cfname,rt from rating r,customer c,product p where r.cid=c.cid and r.pid=p.pid and p.pid=?";
	connection.query(q,tm,function(err,result1){
		if (err) throw err;
		connection.query(z,tm,function(err,result2){
			if (err) throw err;
			res.render("review",{data1:result1,data2:result2,cid:req.params.cid,pid:req.params.pid});
		});
	});
});

app.post("/rate/:pid/:cid",function(req,res){
	res.render("rar",{cid:req.params.cid,pid:req.params.pid});
});

app.post("/rate1/:pid/:cid",function(req,res){
	var a ={
		rv:req.body.review,
		pid:req.params.pid,
		cid:req.params.cid,
	};
	var b ={
		cid:req.params.cid,
		pid:req.params.pid,
		rt:req.body.rate
	};
	
	var q="INSERT INTO review SET?";
	connection.query(q,a,function(err,result1){
		if (err) throw err;
	    console.log(result1);
	});
	var z="INSERT INTO rating SET?";
	connection.query(z,b,function(err,result2){
		if (err) throw err;
		console.log(result2);
		res.render("thanks2",{cid:req.params.cid});
	});
});

app.get("/testing",async (req,res)=> {
	const msg = {
  to: 'rakshitgpawar@gmail.com',
  from: 'rakshitgpawar@gmail.com',
  subject: 'Purchase confirmation',
  text: 'Purchase confirmed',
  html: '<strong>please god</strong>'
};
	try {
    await sgMail.send(msg);
		res.send("thanks");
  } catch (error) {
    console.error(error);
 
    if (error.response) {
      console.error(error.response.body);
		res.send("error");
    }
  }
	

});
	
app.listen(5000,function(){
	console.log("server listening at port 5000:)");
});