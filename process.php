<?php
// Process form submissions
require_once 'App.php';

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Process the form submission
    $result = $app->processFormSubmission($_POST);
    
    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}

// If not a POST request, redirect to home page
header('Location: index.html');
exit;
?>