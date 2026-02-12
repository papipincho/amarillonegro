<?php
$currentPage = 'servicios';
$pageTitle = 'Servicios';
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

<section class="category-header">
    <div class="container">
        <h1>TODOS LOS SERVICIOS</h1>
    </div>
</section>

<section class="services-section">
    <div class="container">
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
