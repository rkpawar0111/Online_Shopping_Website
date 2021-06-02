function fun() {
			var c1,c2,c3,c4;
	        c1 = fun3();
			c2 = fun4();
			c3 = fun2();
	        c4 = fun5();
	       if(c1 == true && c2 == true && c3 == true && c4 == true){
			   return true;
		   }else{
			return false;   
		   }
}

function fun2(){
			var num = document.getElementById('mob').value;
			var ch1 = /^([7-9]{1})+([0-9]{9})$/;
			if(!(num.match(ch1))){
			    alert("invalid-mobile number");
				return false;
			}else{
				
				return true;
			}
		}

		function fun3(){
			var nam = document.getElementById('fname').value;
			var ch2 = /^[A-Za-z]{1,}$/;
			if(!(nam.match(ch2))){
			    alert("invalid- first name");
				return false;
			}else{
				
				return true;
			}
		}
		function fun4(){
			var nam = document.getElementById('lname').value;
			var ch2 = /^[A-Za-z]{1,}$/;
			if(!(nam.match(ch2))){
			    alert("invalid- last name");
				return false;
			}else{
				
				return true;
			}
		}
		function fun5(){
			var nam = document.getElementById('eml').value;
			var ch2 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			if(!(nam.match(ch2))){
			    alert("invalid- email");
				return false;
			}else{
				return true;
			}
		}