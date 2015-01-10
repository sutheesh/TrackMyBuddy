var editProfileModule = (function() {
	var editProfile = Backbone.View.extend({
		initialize: function(){
			
		},
		events: {
			"touchend #edit-profile-back-btn":"goToMaps",
			"touchend #profile-app-logo":"goToMaps",
			"touchend #update-profile":"updateUserDetails",
			"touchend #delete-profile":"deleteProfile"
				
			
		},
		updateUserDetails:function(){
			var _name = document.getElementById("p-name").value;
			var _phoneNo = document.getElementById("p-phone-no").value;
			var myid = mapLayoutModule.getrSetr('my_id');
			var data = {id:myid,name:_name,phone:_phoneNo};
			AppBuilder.handler("updateprofile.fmb",data);
		},
		deleteProfile:function(){
			var myid = mapLayoutModule.getrSetr('my_id');
			var data = {id:myid};
			AppBuilder.handler("deleteprofile.fmb",data);
		},
		goToMaps:function(){
			this.$el.addClass('profile-scale');
			setTimeout(function(){
				var profile = document.getElementById('profile-page');
				$(profile).remove();
			},1000);
		}
	});
	_editProfileModulePageShow = function(){
		$(this).removeClass('profile-scale');
		$("#p-name").val(mapLayoutModule.getrSetr('my_name'));
		$("#p-phone-no").val(localStorage.getItem("myNumber"));
		$("#profile-photo").css("background-image",'url('+mapLayoutModule.getrSetr('my_profile_pic')+')');
		editProfileView = new editProfile({el:"#profile-page"});
	}

	$(document).delegate("#profile-page","pageshow", _editProfileModulePageShow);
})();