<?php

$inputJSON = file_get_contents('php://input');
$input= json_decode( $inputJSON, TRUE ); //convert JSON into array

$input += ['title' => null];

if (strlen((string)$input['title']) > 5) {
    $response = array("status" => "success", "data" => $input);
} else {
    $response = array("status" => "error", "errors" => ['title' => 'Too short'], "data" => $input);
}
$responseJson = json_encode($response);

//Header("HTTP/1.1 400 Bad Request");
header("Content-Type: application/json");
header("Content-Length: " . strlen($responseJson));

echo $responseJson;