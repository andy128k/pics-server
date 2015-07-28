<?php

ini_set('gd.jpeg_ignore_warning', true);

function thumbnail($path, $dest, $width, $height)
{
    if (preg_match('/\.jpe?g$/i', $path))
        $image = imagecreatefromjpeg($path);
    else if (preg_match('/\.gif$/i', $path))
        $image = imagecreatefromgif($path);
    else if (preg_match('/\.png$/i', $path))
        $image = imagecreatefrompng($path);
    else
        return null;

    $origWidth = imagesx($image);
    $origHeight = imagesy($image);

    imagealphablending($image, false);
    imagesavealpha($image, true);

    if ($origHeight * $width >= $origWidth * $height) {
        $w = $height * $origWidth / $origHeight;
        $h = $height;
    } else {
        $w = $width;
        $h = $width * $origHeight / $origWidth;
    }
    $x = ($width - $w) / 2;
    $y = ($height - $h) / 2;

    $result = imagecreatetruecolor($width, $height);
    imagefilledrectangle($result, 0, 0, $width, $height, imagecolorallocatealpha($result, 240, 240, 240, 0));
    imagecopyresampled($result, $image, $x, $y, 0, 0, $w, $h, $origWidth, $origHeight);

    imagejpeg($result, $dest);
    return true;
}

$here = dirname(__FILE__);
$name = basename($_GET['thumb'], '.jpg');

if (!is_file($here . '/pics/' . $name)) {
    header(' ', true, 404);
    exit();
}

$thumb = '/thumbs/' . $name . '.jpg';
if (!thumbnail($here . '/pics/' . $name, $here . $thumb, 100, 100)) {
    copy($here . '/no-thumb.jpg', $here . $thumb);
}

header('Location: '.$thumb, true, 302);
exit();

