/**
 * Created by ladinolfi on 24/02/17.
 */

/*
 Facebook Picture Framer object
 */
var FbPitureFrame = (function($, croppie, undefined){

    var _defaults = {
        previewDiv: "#crop-area",
        framerEndpoint: "convert2.php?XDEBUG_SESSION_START=PHPSTORM"
    };

    var _DOMnodes = {

    }

    /*
     facebook sdk object
     */
    var FB;
    var _pictureUrl;


    // This is called with the results from from FB.getLoginStatus().
    var _statusChangeCallback = function(response) {
        console.log('statusChangeCallback');
        console.log(response);

        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            _showFBPicture();

        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            document.getElementById('status').innerHTML = 'Please log ' +
                'into this app.';
            _logInWithFacebook();

        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            document.getElementById('status').innerHTML = 'Please log ' +
                'into Facebook.';

            _logInWithFacebook();
        }
    }

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    var _showFBPicture = function() {

        _get_ProfilePicture(function(FB_response){
            if (FB_response && !FB_response.error) {
                _pictureUrl = FB_response.data.url;
                _setPreviewDiv(_pictureUrl);

                _DOMnodes.previewDiv.croppie({
                    boundary: { height: 400, width: 400 },
                    viewport: { height: 400, width: 400 }
                });

                $('#download').removeAttr('disabled');
                $('#download').on('click', _downloadPictureFrame)
            }
        });


        /*
         funzione per caricare la foto con il frame sul profilo facebook dell'utente
         */
        document.getElementById("fb-set-pic").onclick = function(){
            this.innerHTML = "Please wait...";
            uploadPicture(function(r){
                /* make the API call */
                FB.api(
                    "/me/photos",
                    "POST",
                    {
                        // http://demos.sim/isl-profile-pic/" + r
                        "url": "http://demos.subinsb.com/isl-profile-pic/" + r,
                        "caption": "Show the world how strong Kerala Blaster Fans are ! Blastify your profile picture NOW ! https://goo.gl/Gis7kZ"
                    },
                    function (response) {
                        if (response && !response.error) {
                            FB.api("/" + response.id, "GET", {
                                "fields": "link"
                            }, function(picture){
                                window.location = picture["link"] + "&makeprofile=1";
                            });
                        }
                    }
                );
            });
        };
    }

    /*
     @parm callback,
                called with the FB API response
     */
    var _get_ProfilePicture = function(callback){

        FB.api(
            "/me/picture",
            {
                redirect: false,
                fields: 'url,is_silhouette,width,height',
                width: 1024
            },
            callback
        );
    }

    var _setPreviewDiv = function(url){

        _DOMnodes.previewDiv.attr("src", url);

    }

    _logInWithFacebook = function() {
        var fbPermissions = FB.login(function(response) {
            if (response.authResponse) {
                alert('You are logged in &amp; cookie set!');
                // Now you can redirect the user or do an AJAX request to
                // a PHP script that grabs the signed request from the cookie.

                showFBpicture();

            } else {
                alert('User cancelled login or did not fully authorize.');
            }
        },{
            scope: 'public_profile,publish_actions',
            return_scopes: true
        });

        console.log(fbPermissions);
        return false;
    };

    var _downloadPictureFrame = function(){


        var _crop_points = _DOMnodes.previewDiv.croppie('get');
        var data = $.param({
            "crop_points": _crop_points,
            "frame": $(".frame").data("design")
        });


            $.ajax({

                url: _defaults.framerEndpoint,
                data: data,
                type: "POST",
                //success: callback,
                error: function(){
                    document.getElementById("download").innerHTML = "Download Profile Picture";
                }
            });


    };


    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    function checkLoginState() {
        FB.getLoginStatus(function(response) {
            _statusChangeCallback(response);
        });

        return false;
    }

    return {

        /**
         * @param object
         *          configuration object
         */
        init: function(config){

            // Merge config into _defaults
            $.extend( _defaults, config );

            _DOMnodes.previewDiv = $(_defaults.previewDiv +' img');

            if( typeof config.FB == "undefined") {
                throw "Facebook SDK not correctly loaded";
                return;
            }else {
                FB = config.FB;
            }


            $(document).ready(function(){

                $(".design").on("click", function(){
                    $(".frame").attr("src", $(this).attr("src")).data("design", $(this).data("design"));
                    $(".design.active").removeClass("active");
                    $(this).addClass("active");
                });

            });

        },
        checkLoginState: checkLoginState
    }
})(jQuery);



/*
 facebook sdk async
 */
window.fbAsyncInit = function() {
    FB.init({
        appId: '673520099498160',
        cookie: true, // This is important, it's not enabled by default
        version: 'v2.8',
        xfbml: false
    });
    FB.AppEvents.logPageView();

    /*
     app init
     */
    FbPitureFrame.init({
        FB : FB
    })
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/it_IT/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
