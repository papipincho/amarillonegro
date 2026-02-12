<?php
/**
 * Contact/Service Submission API
 */
header('Content-Type: application/json');
require_once '../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$service_category = isset($_POST['service_category']) ? trim($_POST['service_category']) : '';
$business_name = isset($_POST['business_name']) ? trim($_POST['business_name']) : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';
$website = isset($_POST['website']) ? trim($_POST['website']) : null;

// Validation
if (empty($name) || empty($email) || empty($phone) || empty($service_category) || empty($business_name) || empty($description)) {
    echo json_encode(['status' => 'error', 'message' => 'Todos los campos obligatorios deben completarse']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Email no válido']);
    exit;
}

$pdo = getDBConnection();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO contact_submissions (name, email, phone, service_category, business_name, description, website, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$name, $email, $phone, $service_category, $business_name, $description, $website]);
    
    $submissionId = $pdo->lastInsertId();
    
    // Send email notification if configured
    $emailSent = false;
    if (defined('RESEND_API_KEY') && RESEND_API_KEY !== '') {
        // Resend API call would go here
        // For simplicity, using PHP mail() as fallback
        $to = NOTIFICATION_EMAIL;
        $subject = "Nueva solicitud: $business_name";
        $message = "Nueva solicitud de publicación:\n\n";
        $message .= "Nombre: $name\n";
        $message .= "Email: $email\n";
        $message .= "Teléfono: $phone\n";
        $message .= "Categoría: $service_category\n";
        $message .= "Negocio: $business_name\n";
        $message .= "Descripción: $description\n";
        $message .= "Web: " . ($website ?: 'No indicada') . "\n";
        
        $headers = "From: noreply@amarillonegro.com\r\n";
        $emailSent = @mail($to, $subject, $message, $headers);
    }
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Solicitud enviada correctamente',
        'id' => $submissionId,
        'email_sent' => $emailSent
    ]);
    
} catch (PDOException $e) {
    error_log("Contact submission error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al procesar la solicitud']);
}
