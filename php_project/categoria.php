<?php
$categoryId = isset($_GET['id']) ? $_GET['id'] : '';

$categories = [
    'licencias' => ['name' => 'Licencias de Taxi', 'icon' => '📋'],
    'gestorias' => ['name' => 'Gestorías', 'icon' => '📁'],
    'talleres' => ['name' => 'Talleres Mecánicos', 'icon' => '🔧'],
    'elementos' => ['name' => 'Elementos del Taxi', 'icon' => '🚖'],
    'escuelas' => ['name' => 'Escuelas de Taxistas', 'icon' => '🎓'],
    'bolsa_trabajo' => ['name' => 'Bolsa de Trabajo', 'icon' => '💼'],
    'emisoras' => ['name' => 'Emisoras y Apps', 'icon' => '📱'],
    'seguros' => ['name' => 'Seguros para Taxistas', 'icon' => '🛡️'],
];

if (!isset($categories[$categoryId])) {
    header('Location: /servicios.php');
    exit;
}

$category = $categories[$categoryId];
$currentPage = 'servicios';
$pageTitle = $category['name'];

// Sample companies for each category (6 per category)
$companies = [
    ['name' => 'Empresa ' . $category['name'] . ' 1', 'desc' => 'Especialistas en servicios para taxistas en Barcelona', 'phone' => '93 XXX XX XX', 'zone' => 'Barcelona Centro'],
    ['name' => 'Empresa ' . $category['name'] . ' 2', 'desc' => 'Más de 20 años de experiencia en el sector', 'phone' => '93 XXX XX XX', 'zone' => 'L\'Hospitalet'],
    ['name' => 'Empresa ' . $category['name'] . ' 3', 'desc' => 'Servicio profesional y atención personalizada', 'phone' => '93 XXX XX XX', 'zone' => 'Badalona'],
    ['name' => 'Empresa ' . $category['name'] . ' 4', 'desc' => 'Precios competitivos y calidad garantizada', 'phone' => '93 XXX XX XX', 'zone' => 'Sant Adrià'],
    ['name' => 'Empresa ' . $category['name'] . ' 5', 'desc' => 'Líderes en el sector del taxi barcelonés', 'phone' => '93 XXX XX XX', 'zone' => 'Cornellà'],
    ['name' => 'Empresa ' . $category['name'] . ' 6', 'desc' => 'Tu socio de confianza para el taxi', 'phone' => '93 XXX XX XX', 'zone' => 'El Prat'],
];

include 'includes/header.php';
?>

<section class="category-header">
    <div class="container">
        <h1><?php echo $category['icon']; ?> <?php echo strtoupper($category['name']); ?></h1>
    </div>
</section>

<section class="services-section">
    <div class="container">
        <div class="listings-grid">
            <?php foreach ($companies as $index => $company): ?>
            <div class="listing-card">
                <a href="/fichas/<?php echo $categoryId; ?>_<?php echo ($index + 1); ?>.html">
                    <h3><?php echo $company['name']; ?></h3>
                    <p><?php echo $company['desc']; ?></p>
                    <div class="listing-meta">
                        <span>📞 <?php echo $company['phone']; ?></span>
                        <span>📍 <?php echo $company['zone']; ?></span>
                    </div>
                </a>
            </div>
            <?php endforeach; ?>
        </div>
        
        <div style="text-align: center; margin-top: 2rem;">
            <a href="/publicar.php" class="btn-primary">¿Quieres aparecer aquí? Publica tu servicio</a>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
