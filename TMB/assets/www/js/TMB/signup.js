var signUpModule = (function() {
	
	var registerView = Backbone.View.extend({
		
		initialize: function() {
			$this = this.$el;
		},
		events: {
			"touchend #signonButton":          "registerUser",
		},
		registerUser:function(){
			$this.removeClass();
			var errorContent = null;
			var _name = document.getElementById("name").value;
			var _phoneNo = document.getElementById("phone-no").value;
			var name = (_name)?_name:errorContent="error-value-name";
			var phoneNo = (errorContent)?null:(/^\d+$/.test(_phoneNo))?(_phoneNo.length==10)?_phoneNo:errorContent="error-phone-digit":errorContent="error-value-phone";
			var gender = (document.getElementById("radio-choice-1").checked)?"male":(document.getElementById("radio-choice-2").checked)?"female":null;
			if(errorContent){
				$this.addClass('error-content '+errorContent);
				errorContent = null;
				return;
			}
			var data = {name:name,phone:phoneNo,gender:gender};
			$this.parent().addClass('loading');
			AppBuilder.handler("register.fmb",data);
			/*navigator.geolocation.getCurrentPosition(ploatLocation, function(e) {alert("geoerror");},
					{ maximumAge: 6000000,timeout: 2000});*/
		}
		
	});
	_signupPageShow = function(){
		new registerView({el:"#signup-main"}); 
		navigator.splashscreen.hide();
	};
	$(document).delegate("#signup-page","pageshow", _signupPageShow);

})();