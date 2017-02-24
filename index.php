<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:og="http://ogp.me/ns#" xmlns:fb="http://www.facebook.com/2008/fbml">
  <head>
    <title>Facebook Picture Framer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="bower_components/Croppie/croppie.css" rel="stylesheet"  />
    <link href="css/style.css" rel="stylesheet"  />

      <script src="bower_components/jquery/dist/jquery.min.js"></script>
      <script src="bower_components/Croppie/croppie.min.js"></script>


    <script src="js/fb-framer.js" ></script>
  </head>
  <body>
    <div id="wrapper">
      <div id="content">
        <h1>Facebook Picture Framer</h1>
        <div id="preview">
          <div id="crop-area">
            <img src="images/facebook_silhouette.png" id="profile-pic" />
          </div>
          <img src="frames/frame-0.png" class="frame" data-design="0" />
        </div>
        <p>
          <button id="download" disabled>Download Profile Picture</button>
          <button id="fb-set-pic" disabled>Set As <b>Facebook</b> Profile Picture</button>
        </p>


          <a href="#" onClick="FbPitureFrame.checkLoginState()">Log In with the JavaScript SDK</a>

        <div class="fb-login-button" data-scope="public_profile,publish_actions" onlogin="FbPitureFrame.checkLoginState();" data-max-rows="5" data-size="large" data-show-faces="false" data-auto-logout-link="false"></div>
        <div id="status"></div>
        <h2>Design</h2>
        <div id="designs">
          <img class="design active" src="frames/frame-0.png" data-design="0" />
          <img class="design" src="frames/frame-1.png" data-design="1" />
          <img class="design" src="frames/frame-2.png" data-design="2" />
        </div>
      </div>
    </div>
  </body>
</html>