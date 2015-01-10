var chatBeep,alarmBeep;
function onDeviceredy1() {
	document.addEventListener("backbutton", function(){}, true); 
	try{
		chatBeep=new Media("/android_asset/www/image/chatBeep.mp3");
		alarmBeep = new Media("/android_asset/www/image/alarm.mp3");
	}catch(e){
		
	}
   if(localStorage.getItem("register") != "true"){
	   $.mobile.changePage("signup.html",{transition:"slide"});
	   
   }else{
		mapLayoutModule.getrSetr("my_id",localStorage.getItem("myid"));
		mapLayoutModule.getrSetr("my_name",localStorage.getItem("myName"));
	    $.mobile.changePage("maps.html",{transition:"slide"});
   }
}

var mapLayoutModule = (function() {
	var privateVar = {
			 userDetailsCollectionList:null,
			 model:null,
			 mapViews:null,
			 map:null,
			 opendMarker:null,
			 to_id:null,
			 my_id:null,
			 my_name:null,
			 alertSetIntervel:null,
			 my_profile_pic : "image/background.png",
			 directionsDisplay:null,
			 myCenter:null,
			 directionsService :null,
			 resultData : null,
			 phoneNumbers : [],
			 history:{}
	};
	
	var userDetailsModel = Backbone.Model.extend();
	
	var userDetailsCollection = Backbone.Collection.extend({
	    model: userDetailsModel
	});
	
	var mapView = Backbone.View.extend({
		
		initialize: function(){
			_.bindAll(this,"ploatMyFriendsLoaction");
			this.listenTo(this.collection,"add", this.render);  
			this.listenTo(this.model,"change", this.renderMylocation);  
			setInterval(this.getBuddyDetails,5000);
			this.$myMarkerIcon = this.createMarkerIcon("image/me.png");
			this.$friendsMarkerIcon = this.createMarkerIcon("image/friends.png");
			this.$markers = [];
			privateVar.opendMarker = null;
			privateVar.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
			privateVar.directionsService = new google.maps.DirectionsService();
			this.ploatMyFriendsLoaction();
		},
		events: {
			"touchend #msg-sent-btn":"sentMessage",
			"touchend #overlay":"closeMessageBox",
			"touchend #settings":"openSettings",
			"touchend #edit-profile":"editProfile",
			"touchend #genaral-global-alert":"alertAll"
			
		},
		clearMarkers:function(){
			for(var i=0;i<this.$markers.length;i++){
				this.$markers[i].setMap(null);
			}
			this.$markers = [];
		},
		alertAll:function(){
			var  data={id:privateVar.my_id,phone:localStorage.getItem("myNumber")};
			var alertStatus = localStorage.getItem(privateVar.my_id);
			if(alertStatus == "gl-alert-ok"){
				localStorage.setItem(privateVar.my_id,"gl-alert");
				document.getElementById("genaral-global-alert").className = "gl-alert" ;
				AppBuilder.handler("alertreq.fmb",data);
			}else{
				localStorage.setItem(privateVar.my_id,"gl-alert-ok");
				document.getElementById("genaral-global-alert").className = "gl-alert-ok" ;
				AppBuilder.handler("alertreqCancel.fmb",data);
			}
		},
		getBuddyDetails:function(){
			if(!navigator.onLine){
				$("#offline-error").css("display",'-webkit-box');
				return;
			}
			$("#offline-error").css("display",'none');
			var data = {id:privateVar.my_id,phoneNumbers: privateVar.phoneNumbers};
			AppBuilder.handler("getbuddys.fmb",data);
		},
		closeMessageBox:function(){
			$("#message-box").addClass('slide-left');
			this.$el.removeClass('settings-scale');
		},
		openSettings:function(){
			this.$el.addClass('settings-scale');
		},
		editProfile:function(){
			this.$el.removeClass('settings-scale');
			$.mobile.changePage("profile.html",{transition:"none"});
		},
		createMarkerIcon:function(image){
			return new google.maps.MarkerImage(
				image,
				null, /* size is determined at runtime */
				null, /* origin is 0,0 */
				null, /* anchor is bottom center of the scaled image */
				new google.maps.Size(47, 68)
			); 
		},
		sentMessage : function(){
			var message = this.$("#msg-text").val();
			if(!message)
				return;
			var scroller = document.getElementById("message-content");
			var myid = privateVar.my_id;
			var fromName = privateVar.my_name;
			var to_id = privateVar.to_id;
			this.$("#msg-text").val("");
			var data = {from:myid,fromName:fromName,to:to_id,message:message};
			var date = new Date();
			var elementToSent = '<div class="message-sented message-float-left"><div>'+message+'</div><div class="sent-time">'+date.timeNow()+'</div></div>';
			$("#message-content").append(elementToSent);
			if(!privateVar.history[to_id])
				privateVar.history[to_id] =[];
			privateVar.history[to_id].push(elementToSent);
			scroller.scrollTop=scroller.scrollHeight;
			AppBuilder.handler("message.fmb",data);
		},
		render: function (userDetailsModel) {
		   var userData = userDetailsModel.toJSON();
		   var testData,customMarker;
		   if(userData._id == privateVar.my_id){
				if(userData.message){
					if($("#message-box").hasClass('slide-left'))
						_renderHistory(userData.senterId);
					_message(userData.senterName,userData.senterId,userData.message);
				}
				if(userData.alertFrom)
					_findThePerson(userData.alertFrom);
				testData = _.template($("#infobox-data").html(),{data:userData,user:true});
				privateVar.my_profile_pic = (userData.image)?userData.image:privateVar.my_profile_pic;
				customMarker = _.template($("#google-marker").html(),{data:userData,user:true});
			}
			else{
				testData = _.template($("#infobox-data").html(),{data:userData,user:false});
				customMarker = _.template($("#google-marker").html(),{data:userData,user:false});
			}

			 var myLatLng = new google.maps.LatLng(userData.lat, userData.lon),
			 friends_marker = new RichMarker({
								position: myLatLng,
								map: privateVar.map,
								content: customMarker
	          });
			this.$markers.push(friends_marker);
			friends_marker.infobox = new InfoBox({
				 content: testData,
				 disableAutoPan: false,
				 maxWidth: 150,
				 alignBottom:true,
				 pixelOffset: new google.maps.Size(-114, -110),
				 zIndex: 3,
				 boxStyle: {
					background: "transparent",
					width: "223px",
					height:"320px"
				},
				closeBoxMargin: "32px 7px",
				closeBoxURL: "image/close-info.png",
				infoBoxClearance: new google.maps.Size(1, 1)
			});
			
			google.maps.event.addListener(friends_marker, 'click', (function(friends_marker) {
	                return function () {
						if(privateVar.opendMarker)
							privateVar.opendMarker.infobox.close();
	                	friends_marker.infobox.open(privateVar.map, this);
	                	privateVar.map.panTo(friends_marker.getPosition());
						privateVar.opendMarker = friends_marker;
	                };
			})(friends_marker));
	    },
		ploatMyFriendsLoaction :function(){
			if(!navigator.onLine){
				$("#offline-error").css("display",'-webkit-box');
				return;
			}
			$("#offline-error").css("display",'none');
			var myid = privateVar.my_id;
			var self = this;
			var watchID = navigator.geolocation.watchPosition(function(position){
				
				var data = {id:myid,lat:position.coords.latitude,lon:position.coords.longitude};
				if(!privateVar.map)
					self.model.set(data);
				AppBuilder.handler("api.fmb",data);
			}, function(e) {alert("Please Reset your location Settings..");
							self.renderMylocation({toJSON:function(){return {"lat":12.98251970,"lon":80.23134710}}});
					},
					{ maximumAge: 3000,timeout: 2000,enableHighAccuracy: true});
		},
		renderMylocation:function(data){
			var myCenter = new google.maps.LatLng(data.toJSON().lat, data.toJSON().lon);
			if(!privateVar.map){
				privateVar.myCenter = myCenter;
				var mapOptions = {
					center: myCenter,
					zoom: 12,
					disableDefaultUI: true,
					mapTypeId: google.maps.MapTypeId.ROADMAP 
				};
				privateVar.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
				privateVar.map.setTilt(45);
				privateVar.map.setHeading(90);
				privateVar.directionsDisplay.setMap(privateVar.map);
			}
			var request = {
				location: myCenter,
				radius: 5000,
				types: ["police"]
			};
			 infowindow = new google.maps.InfoWindow();
			var service = new google.maps.places.PlacesService(privateVar.map);
			service.nearbySearch(request, this.policeLocation);
			
		},
		policeLocation:function(results,status){
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					_ploatPoliceLocation(results[i]);
				}
			}
		}
		
	});
	_ploatPoliceLocation = function(place){
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: privateVar.map,
			icon:"image/police.png",
			position: place.geometry.location
		});
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(place.name);
			infowindow.open(privateVar.map, this);
		});
	},
	_getBase64ImageFromInput = function (input, callback) {
        var imageReader = new FileReader();
        imageReader.onloadend = function (evt) {
            if (callback)
                callback(evt.target.result);
        };
        //Start the asynchronous data read.
        imageReader.readAsDataURL(input);
    },
	_changeImage=function(that){
		var input = that.files[0];
		if (input) {
			$("#user-image").addClass('upload-image');
			_getBase64ImageFromInput(input, function (imageData) {
				if(!imageData.match("image"))
					imageData = "data:image;base64,"+imageData.substr(12);
				var data = {id:privateVar.my_id,image:imageData};
				AppBuilder.handler("uploadimage.fmb",data);
        });
		}
	},
	_getDirections = function(latValue,longValue){
		
		var start =  latValue?new google.maps.LatLng(latValue, longValue):privateVar.opendMarker.getPosition();
		 $("#alert-message-placeholder").html("");
		var request = {
			origin:privateVar.myCenter,
			destination:start,
			travelMode: google.maps.TravelMode.DRIVING
		  };
		  privateVar.directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				if(privateVar.opendMarker)
					privateVar.opendMarker.infobox.close();
			  privateVar.directionsDisplay.setDirections(response);
			}else{
				alert("No Direction Service available");
			}
		  });
	},
	_makeACall = function(phoneNo){
		$("#alert-message-placeholder").html("");
		 var link = "tel:"+phoneNo;
        window.location.href = link;
	},
	_makeAnAlert = function(id){
		data = {"id":id,"to_id":privateVar.my_id};
		AppBuilder.handler("afo.fmb",data);
	},
	_findThePerson = function(alertFrom){
		_.find(privateVar.resultData.userDetails, function(element, index, list){
			if(alertFrom == element._id && (localStorage.getItem(alertFrom)!="true")){
				$("#alert-message-placeholder").html(_.template($("#alert-message").html(),{data:element}));
				try{
					alarmBeep.play();
				}catch(e){}
				localStorage.setItem(alertFrom,true);
				(function(alertFrom){
					setTimeout(function(){localStorage.setItem(alertFrom,false);},30000);
					})(alertFrom);
			}
		});
	}
	_renderHistory = function(id){
		$("#message-content").html('');
		var renderArray = privateVar.history[id];
		if(renderArray){
			var renderLength = renderArray.length;
			for(var index=0 ; index<renderLength;index++){
				$("#message-content").append(renderArray[index]);
			}
			
		}
	},
	_message = function(name,id,message){
		if(message){
			var scroller = document.getElementById("message-content");
			var date = new Date();
			var elementToSent = '<div class="message-sented message-float-right"><div>'+message+'</div><div class="sent-time">'+date.timeNow()+'</di></div>';
			$("#message-content").append(elementToSent);
			if(!privateVar.history[id])
				privateVar.history[id] =[];
			privateVar.history[id].push(elementToSent);
			scroller.scrollTop=scroller.scrollHeight;
			try{
				chatBeep.play();
			}catch(e){
				
			}
			
		}
		$("#alert-message-placeholder").html("");
		privateVar.to_id = id;
		if(privateVar.opendMarker)
			privateVar.opendMarker.infobox.close();
		$("#chatting-name").html(name);
		$("#message-box").removeClass('slide-left');
		
	},
	_onSuccess = function(contacts) {
		for (var i = 0; i < contacts.length; i++) {
			try{					
				privateVar.phoneNumbers[i] = {"phone":contacts[i].phoneNumbers[0].value.replace(/^\+?91/g, '').replace(/\s/g, '')};
			}catch(e){}
		}
		privateVar.phoneNumbers[i] = {"phone":localStorage.getItem("myNumber").replace(/^\+?91/g, '').replace(/\s/g, '')};
	},
	_onError = function(contactError) {
	    alert('_onError while importing contacts.!');
	},
	Date.prototype.timeNow = function () {
		return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
	};
	_mapLayoutModulePageShow = function(){
		$("#genaral-global-alert").addClass(localStorage.getItem(privateVar.my_id));
		privateVar.userDetailsCollectionList = new userDetailsCollection();
		privateVar.model = new userDetailsModel();
		privateVar.mapViews = new mapView({el:"#location-page", collection: privateVar.userDetailsCollectionList,model:privateVar.model  });
		navigator.splashscreen.hide();
		

		 var options = new ContactFindOptions();
		 options.filter="";
	     options.multiple=true;
	     var fields = ["displayName", "name"];
         navigator.contacts.find(fields, _onSuccess, _onError, options);
	};
	$(document).delegate("#location-page","pageshow", _mapLayoutModulePageShow);
	return {
		getrSetr:function(variable,value){
			  if(value)
				  privateVar[variable] = value;
			  else
				  return privateVar[variable];
		  },
		  changeImage:function(that){
			_changeImage(that);
		  },
		  getDirections:function(latValue,longValue){
			_getDirections(latValue,longValue);
		  },
		  makeACall:function(phoneNo){
			_makeACall(phoneNo);
		  },
		  findThePerson : function(alertFrom){
			_findThePerson(alertFrom);
		  },
		  makeAnAlert : function(phoneNo){
			_makeAnAlert(phoneNo);
		  },
		  message:function(name,id){
			_message(name,id);
			_renderHistory(id);
			
		  }
	};
})();

