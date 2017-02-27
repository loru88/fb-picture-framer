<?php

include './vendor/autoload.php';

$env_filepath = '.env';
if( file_exists($env_filepath) )
    $env = parse_ini_file($env_filepath);
else{
    die("Error: env file missing.");
}


$fb = new Facebook\Facebook([
    'app_id' => $env['FACEBOOK_APPID'],
    'app_secret' => $env['FACEBOOK_APPSECRET'],
    'default_graph_version' => 'v2.8',
]);

$helper = $fb->getJavaScriptHelper();

try {

    if( !isset($_SESSION['fb_access_token']) )
        $accessToken = $helper->getAccessToken();

} catch(Facebook\Exceptions\FacebookResponseException $e) {
    // When Graph returns an error
    echo 'Graph returned an error: ' . $e->getMessage();
    exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
    // When validation fails or other local issues
    echo 'Facebook SDK returned an error: ' . $e->getMessage();
    exit;
}

if (! isset($accessToken)) {
    echo 'No cookie set or no OAuth data could be obtained from cookie.';
    exit;
}

// Logged in
$_SESSION['fb_access_token'] = (string) $accessToken;


/**
 * Add frame to profile picture
 * @param  string $sourcePath Path to profile picture
 * @param  string    $framePath     Frame to use
 * @return binary    Binary data of framed profile picture
 */
function makeDP($sourcePath, $framePath){


    $zoom = 0.569;

    $crop_metrics = array(
        'x' => 128,
        'y' => 125,
        'width' => 838,
        'height' => 835
    );


  $src = imagecreatefromjpeg($sourcePath);
  $frame = imagecreatefrompng($framePath);

  list($src_width, $src_height) = getimagesize($sourcePath); //picture dimension
  list($frame_width, $frame_height) = getimagesize($framePath); //frame dimensione

  $croppedFG = imagecreatetruecolor($src_width, $src_height);

  $background = imagecolorallocate($croppedFG, 0, 0, 0);
  // removing the black from the placeholder
  imagecolortransparent($croppedFG, $background);

  imagealphablending($croppedFG, false);
  imagesavealpha($croppedFG, true);

  imagecopyresized($croppedFG, $frame, 0, 0, 0, 0, $src_width, $src_height, $frame_width, $frame_height); //enlarge frame image to fit faebook pictue

  // Start merging
  $out = imagecreatetruecolor($src_width, $src_height); //create a new image sized as facebook picture
  imagecopyresampled($out, $src, 0, 0, $crop_metrics['x'], $crop_metrics['y'], $crop_metrics['width']+($crop_metrics['width']*$zoom), $crop_metrics['height']+($crop_metrics['height']*$zoom), $src_width, $src_height); //pan & zoom facebook picture
  imagecopyresampled($out, $croppedFG, 0, 0, 0, 0, $src_width, $src_height, $src_width, $src_height); //apply frame on facebook picture
  imagejpeg($out, "save.jpg"); //save in a file

  echo "creato";
}



makeDP('./images/lorenzo.jpg','./frames/frame-0.png');