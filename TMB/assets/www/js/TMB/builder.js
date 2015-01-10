var AppBuilder = (function() {
	 var privateVar = {
			 map:null,
			 myLatLong:null
	 };
	 /*_ploatMap = function(data){
		 var mapOptions = {
				 center: myCenter,
			     zoom: 12
		 };
		alert(position.coords.latitude);
		privateVar.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		
	 },
	 _getMyFriendsLocation = function(){
		 var myId = localStorage.getItem("myID");
		 
	 },*/
	 _handler = function(requestUrl,data,successCallback){
		
		 $.ajax({
			//url:"http://localhost:8080/"+requestUrl,
			//url:"http://192.168.43.9:8080/"+requestUrl,
			url:"http://testdb43.herokuapp.com/"+requestUrl,
			dataType: 'json',
			data: data,
	        timeout:60000,
	        type: 'POST',
	        success: function(result) {
				if(result.status=="regSuccess"){
					localStorage.setItem("register",true);
					localStorage.setItem("myid",result.id);
					localStorage.setItem("myName",result.name);
					localStorage.setItem("myNumber",result.phone);
					localStorage.setItem(result.id,"gl-alert-ok");
					mapLayoutModule.getrSetr("my_id",result.id);
					mapLayoutModule.getrSetr("my_name",result.name);
					 /*userDetailsCollectionList = new userDetailsCollection();
					 model = new userDetailsModel();
					mapViews = new mapView({ collection: userDetailsCollectionList,model:model  });
					window.location.href = "#location-page";*/
					$.mobile.changePage("maps.html",{transition:"slide"});
				}
				else if(result.status=="msgSuccess"){
					
				}
				else if(result.status=="alertSuccess"){
					$("#alert-id").addClass('alert-success-btn');
					setTimeout(function(){
						$("#alert-id").removeClass('alert-success-btn');
					},20000);
					
				}
				else if(result.status=="profileUpdated"){
					
				}
				else if(result.status=="alertCancelSuccess"){
				}
				else if(result.status=="profileDeleted"){
					localStorage.setItem("register",false);
					localStorage.setItem("myid",null);
					localStorage.setItem("myName",null);
					localStorage.setItem("myNumber",null);
					localStorage.setItem(result.id,"gl-alert-ok");
					$.mobile.changePage("signup.html",{transition:"slide"});
				}
				else if(result.status=="imgSuccess"){
					$("#user-image").removeClass('upload-image');
					$("#user-image").css("background-image","url("+result.userDetails[0].image+")");
					$("#profile-photo").removeClass('upload-image');
					$("#profile-photo").css("background-image","url("+result.userDetails[0].image+")");
					
				}
				else if(result.status=="updateGeoSuccess"){
				}
				else{
					//var userDetailsCollectionList = new userDetailsCollection();
					mapLayoutModule.getrSetr("resultData",result);
					mapLayoutModule.getrSetr("mapViews").clearMarkers();
					mapLayoutModule.getrSetr("userDetailsCollectionList").reset();
					mapLayoutModule.getrSetr("userDetailsCollectionList").set(result.userDetails);
					if(result.alertPersons && result.alertPersons.length && result.alertPersons[0]._id != mapLayoutModule.getrSetr("my_id")){
						mapLayoutModule.findThePerson(result.alertPersons[0]._id);
					}
					//mapViews = new mapView({ collection: userDetailsCollectionList,el:"#map-canvas" });
				}
			},
			error:function(){
				$("#offline-error").css("display",'-webkit-box');
			}
		});

	};
  return {
	  handler: function(requestUrl,data,successCallback){
		  _handler(requestUrl,data,successCallback);
	  },
	 
	  getrSetr:function(variable,value){
		  if(value)
			  privateVar[variable] = value;
		  else
			  return privateVar[variable];
	  }
  };   
})();