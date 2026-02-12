<?php
$currentPage = 'home';
$pageTitle = 'Portal de Servicios para Taxistas';
include 'includes/header.php';

$categories = [
    ['id' => 'licencias', 'name' => 'Licencias de Taxi', 'icon' => '📋', 'desc' => 'Compra, venta y alquiler de licencias'],
    ['id' => 'gestorias', 'name' => 'Gestorías', 'icon' => '📁', 'desc' => 'Trámites y gestión administrativa'],
    ['id' => 'talleres', 'name' => 'Talleres Mecánicos', 'icon' => '🔧', 'desc' => 'Reparación y mantenimiento'],
    ['id' => 'elementos', 'name' => 'Elementos del Taxi', 'icon' => '🚖', 'desc' => 'Taxímetros, luminosos y equipamiento'],
    ['id' => 'escuelas', 'name' => 'Escuelas de Taxistas', 'icon' => '🎓', 'desc' => 'Formación y certificación'],
    ['id' => 'bolsa_trabajo', 'name' => 'Bolsa de Trabajo', 'icon' => '💼', 'desc' => 'Ofertas de empleo'],
    ['id' => 'emisoras', 'name' => 'Emisoras y Apps', 'icon' => '📱', 'desc' => 'Servicios de radio y aplicaciones'],
    ['id' => 'seguros', 'name' => 'Seguros para Taxistas', 'icon' => '🛡️', 'desc' => 'Pólizas especializadas'],
];
?>

<!-- Hero Section -->
<section class="hero">
    <div class="hero-content">
        <h1>PORTAL DE SERVICIOS</h1>
        <div class="hero-badge">TAXI BARCELONA</div>
        <p>El directorio completo de servicios profesionales para el sector del taxi en Barcelona</p>
        <a href="/publicar.php" class="btn-primary">Publicar mi servicio</a>
    </div>
</section>

<!-- Services Section -->
<section class="services-section">
    <div class="container">
        <h2 class="section-title">SERVICIOS DISPONIBLES</h2>
        <div class="section-divider"></div>
        
        <div class="services-grid">
            <?php foreach ($categories as $cat): ?>
            <a href="/categoria.php?id=<?php echo $cat['id']; ?>" class="service-card">
                <div class="service-icon"><?php echo $cat['icon']; ?></div>
                <h3><?php echo $cat['name']; ?></h3>
                <p><?php echo $cat['desc']; ?></p>
                <span class="service-count">Ver empresas →</span>
            </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
