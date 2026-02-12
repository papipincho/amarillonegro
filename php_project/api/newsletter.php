<?php
/**
 * Newsletter Subscription API
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
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : null;

// Validation
if (empty($name) || empty($email)) {
    echo json_encode(['status' => 'error', 'message' => 'Nombre y email son obligatorios']);
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
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM newsletter_subscriptions WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        echo json_encode(['status' => 'info', 'message' => 'Este email ya está suscrito']);
        exit;
    }
    
    // Insert new subscription
    $stmt = $pdo->prepare("INSERT INTO newsletter_subscriptions (name, email, phone, subscribed_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$name, $email, $phone]);
    
    echo json_encode([
        'status' => 'success',
        'message' => '¡Gracias por suscribirte! Recibirás las últimas novedades.',
        'id' => $pdo->lastInsertId()
    ]);
    
} catch (PDOException $e) {
    error_log("Newsletter error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al procesar la suscripción']);
}
