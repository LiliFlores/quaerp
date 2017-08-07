<?php

// String functions

// http://stackoverflow.com/questions/834303/startswith-and-endswith-functions-in-php
function startsWith($haystack, $needle) {
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

function str_replace_first($from, $to, $subject) {
    $from = '/'.preg_quote($from, '/').'/';
    return preg_replace($from, $to, $subject, 1);
}
?>
