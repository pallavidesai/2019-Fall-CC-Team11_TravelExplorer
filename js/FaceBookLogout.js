
    
	
	 window.fbAsyncInit = function() {
    FB.init({
      appId      : '1905405186427332',
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.8' // use graph api version 2.8
    });


  };
  
  function onLoad() {
      gapi.load('auth2', function() {
        gapi.auth2.init();
      });
    }

function signOut() {

      var oauth_value = localStorage.getItem("oauth");
      if(oauth_value == "google") {
          var auth2 = gapi.auth2.getAuthInstance();
          auth2.signOut().then(function () {
              console.log('User signed out.');
              localStorage.setItem("oauth","loggedout");
              window.location.href = 'LoginPage.html';
          });
      }
      else if (oauth_value== "fb")
      {
          facebookLogout();
      }
      else
      {
          window.location.href = 'LoginPage.html';
      }

  } 
  
  function facebookLogout(){

	    FB.init({
      appId      : '1905405186427332',
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.8' // use graph api version 2.8
    });
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                FB.logout(function(response) {
                    // this part just clears the $_SESSION var
                    // replace with your own code
                    window.location.href = 'LoginPage.html';
                    });
                }
            });

        }
    
  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));