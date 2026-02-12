<?php
session_start();
require_once '../includes/config.php';

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    if ($_POST['password'] === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        header('Location: /admin/');
        exit;
    } else {
        $error = 'Contraseña incorrecta';
    }
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: /admin/');
    exit;
}

// Check if logged in
$isLoggedIn = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

// Handle delete
if ($isLoggedIn && isset($_GET['delete']) && isset($_GET['type'])) {
    $pdo = getDBConnection();
    if ($pdo) {
        $id = (int)$_GET['delete'];
        $type = $_GET['type'];
        
        if ($type === 'submission') {
            $stmt = $pdo->prepare("DELETE FROM contact_submissions WHERE id = ?");
            $stmt->execute([$id]);
        }
        
        header('Location: /admin/?tab=' . ($type === 'submission' ? 'submissions' : 'subscribers'));
        exit;
    }
}

// Get data if logged in
$subscribers = [];
$submissions = [];
if ($isLoggedIn) {
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC");
            $subscribers = $stmt->fetchAll();
            
            $stmt = $pdo->query("SELECT * FROM contact_submissions ORDER BY submitted_at DESC");
            $submissions = $stmt->fetchAll();
        } catch (PDOException $e) {
            $dbError = "Error de base de datos: " . $e->getMessage();
        }
    } else {
        $dbError = "No se pudo conectar a la base de datos. Verifica la configuración en includes/config.php";
    }
}

$activeTab = isset($_GET['tab']) ? $_GET['tab'] : 'submissions';

$categoryNames = [
    'licencias' => 'Licencias de Taxi',
    'gestorias' => 'Gestorías',
    'talleres' => 'Talleres Mecánicos',
    'elementos' => 'Elementos del Taxi',
    'escuelas' => 'Escuelas de Taxistas',
    'bolsa_trabajo' => 'Bolsa de Trabajo',
    'emisoras' => 'Emisoras y Apps',
    'seguros' => 'Seguros para Taxistas',
];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - AmarilloNegro.com</title>
    <link rel="stylesheet" href="/css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>

<?php if (!$isLoggedIn): ?>
<!-- Login Form -->
<div class="login-container">
    <div class="login-box">
        <h1>PANEL ADMIN</h1>
        <p style="color: var(--gray-600); margin-bottom: 1.5rem;">Acceso restringido a administradores</p>
        
        <?php if (isset($error)): ?>
        <div class="error-message"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label>Contraseña</label>
                <input type="password" name="password" required placeholder="Introduce la contraseña">
            </div>
            <button type="submit" class="btn-submit">Acceder</button>
        </form>
        
        <p style="margin-top: 1.5rem; text-align: center;">
            <a href="/" style="color: var(--yellow);">← Volver al portal</a>
        </p>
    </div>
</div>

<?php else: ?>
<!-- Admin Dashboard -->
<div class="admin-container">
    <header class="admin-header">
        <h1 class="admin-title">PANEL DE ADMINISTRACIÓN</h1>
        <a href="?logout=1" class="btn-logout">Cerrar Sesión</a>
    </header>
    
    <div class="admin-content">
        <?php if (isset($dbError)): ?>
        <div class="error-message" style="margin-bottom: 1.5rem;"><?php echo $dbError; ?></div>
        <?php endif; ?>
        
        <!-- Stats -->
        <div class="stats-grid">
            <div class="stat-card yellow">
                <div class="stat-number"><?php echo count($submissions); ?></div>
                <div class="stat-label">Servicios Pendientes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo count($subscribers); ?></div>
                <div class="stat-label">Taxistas Suscritos</div>
            </div>
        </div>
        
        <!-- Tabs -->
        <div class="tabs">
            <a href="?tab=submissions" class="tab-btn <?php echo $activeTab === 'submissions' ? 'active' : ''; ?>">
                Servicios Publicados
            </a>
            <a href="?tab=subscribers" class="tab-btn <?php echo $activeTab === 'subscribers' ? 'active' : ''; ?>">
                Newsletter
            </a>
        </div>
        
        <?php if ($activeTab === 'submissions'): ?>
        <!-- Submissions Table -->
        <div style="overflow-x: auto;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Negocio</th>
                        <th>Categoría</th>
                        <th>Contacto</th>
                        <th>Descripción</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($submissions)): ?>
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 2rem;">No hay solicitudes pendientes</td>
                    </tr>
                    <?php else: ?>
                    <?php foreach ($submissions as $index => $sub): ?>
                    <tr>
                        <td><?php echo $index + 1; ?></td>
                        <td>
                            <strong><?php echo htmlspecialchars($sub['business_name']); ?></strong>
                            <?php if ($sub['website']): ?>
                            <br><small><a href="<?php echo htmlspecialchars($sub['website']); ?>" target="_blank"><?php echo htmlspecialchars($sub['website']); ?></a></small>
                            <?php endif; ?>
                        </td>
                        <td>
                            <span style="background: var(--yellow); padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 700;">
                                <?php echo $categoryNames[$sub['service_category']] ?? $sub['service_category']; ?>
                            </span>
                        </td>
                        <td>
                            <?php echo htmlspecialchars($sub['name']); ?><br>
                            <small><?php echo htmlspecialchars($sub['email']); ?></small><br>
                            <small><?php echo htmlspecialchars($sub['phone']); ?></small>
                        </td>
                        <td style="max-width: 200px;"><?php echo htmlspecialchars(substr($sub['description'], 0, 100)); ?>...</td>
                        <td><?php echo date('d/m/Y H:i', strtotime($sub['submitted_at'])); ?></td>
                        <td>
                            <a href="?delete=<?php echo $sub['id']; ?>&type=submission&tab=submissions" 
                               class="btn-delete"
                               onclick="return confirm('¿Eliminar esta solicitud?')">
                                Eliminar
                            </a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        
        <?php else: ?>
        <!-- Subscribers Table -->
        <div style="overflow-x: auto;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($subscribers)): ?>
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem;">No hay suscriptores aún</td>
                    </tr>
                    <?php else: ?>
                    <?php foreach ($subscribers as $index => $sub): ?>
                    <tr>
                        <td><?php echo $index + 1; ?></td>
                        <td><?php echo htmlspecialchars($sub['name']); ?></td>
                        <td><a href="mailto:<?php echo htmlspecialchars($sub['email']); ?>"><?php echo htmlspecialchars($sub['email']); ?></a></td>
                        <td><?php echo htmlspecialchars($sub['phone'] ?: '-'); ?></td>
                        <td><?php echo date('d/m/Y H:i', strtotime($sub['subscribed_at'])); ?></td>
                    </tr>
                    <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>
        
        <p style="margin-top: 2rem; text-align: center;">
            <a href="/" style="color: var(--black); font-weight: 700;">← Volver al Portal</a>
        </p>
    </div>
</div>
<?php endif; ?>

</body>
</html>
