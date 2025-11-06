<?php
// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed');
}

// Set headers for JSON response
header('Content-Type: application/json');

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Include PHPMailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Function to sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Function to validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

try {
    // Get form type
    $formType = isset($_POST['form_type']) ? sanitizeInput($_POST['form_type']) : 'contact';
    
    // Initialize response
    $response = [
        'success' => false,
        'message' => ''
    ];
    
    // Process different form types
    switch ($formType) {
        case 'recruitment_plan':
            $name = sanitizeInput($_POST['name'] ?? '');
            $company = sanitizeInput($_POST['company'] ?? '');
            $openings = sanitizeInput($_POST['openings'] ?? '');
            $email = sanitizeInput($_POST['email'] ?? '');
            
            // Validate required fields
            if (empty($name) || empty($company) || empty($openings) || empty($email)) {
                throw new Exception('All fields are required.');
            }
            
            if (!validateEmail($email)) {
                throw new Exception('Invalid email address.');
            }
            
            $subject = 'Free Recruitment Plan Request';
            $messageBody = "
                <h2>New Recruitment Plan Request</h2>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Company Name:</strong> $company</p>
                <p><strong>Openings Available:</strong> $openings</p>
                <p><strong>Email:</strong> $email</p>
            ";
            break;
            
        case 'quote_request':
            $name = sanitizeInput($_POST['name'] ?? '');
            $company = sanitizeInput($_POST['company'] ?? '');
            $website = sanitizeInput($_POST['website'] ?? '');
            $adspend = sanitizeInput($_POST['adspend'] ?? '');
            $service = sanitizeInput($_POST['service'] ?? 'SEO');
            
            if (empty($name) || empty($company) || empty($website)) {
                throw new Exception('All fields are required.');
            }
            
            $subject = 'SEO Quote Request from ' . $company;
            $messageBody = "
                <h2>New SEO Quote Request</h2>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Company Name:</strong> $company</p>
                <p><strong>Website:</strong> $website</p>
                <p><strong>Current Ad Spend:</strong> $adspend</p>
                <p><strong>Service:</strong> $service</p>
            ";
            $email = 'noreply@' . parse_url($website, PHP_URL_HOST);  // Use company website domain for reply
            break;
            
        case 'ppc_audit':
            $name = sanitizeInput($_POST['name'] ?? '');
            $company = sanitizeInput($_POST['company'] ?? '');
            $website = sanitizeInput($_POST['website'] ?? '');
            
            if (empty($name) || empty($company) || empty($website)) {
                throw new Exception('All fields are required.');
            }
            
            $subject = 'PPC Audit Request from ' . $company;
            $messageBody = "
                <h2>New PPC Audit Request</h2>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Company Name:</strong> $company</p>
                <p><strong>Website:</strong> $website</p>
            ";
            $email = 'noreply@' . parse_url($website, PHP_URL_HOST);  // Use company website domain for reply
            break;
            
        default:
            throw new Exception('Invalid form type.');
    }
    
    // Create PHPMailer instance
    $mail = new PHPMailer(true);
    
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'recruitmentmarketingco@gmail.com';
    $mail->Password = 'oG46=VXgBy*';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    
    // Email settings
    $mail->setFrom('recruitmentmarketingco@gmail.com', 'Recruitment Marketing Co - Website');
    $mail->addAddress('recruitmentmarketingco@gmail.com', 'Recruitment Marketing Co');
    $mail->addReplyTo($email, $name);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $messageBody;
    $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $messageBody));
    
    // Send email
    if ($mail->send()) {
        $response['success'] = true;
        $response['message'] = 'Thank you! Your request has been sent successfully. We will get back to you shortly.';
    } else {
        throw new Exception('Failed to send email. Please try again.');
    }
    
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
    
    // Log error (optional)
    error_log('Email Error: ' . $e->getMessage());
}

// Return JSON response
echo json_encode($response);
?>
