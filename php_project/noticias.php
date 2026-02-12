<?php
$currentPage = 'noticias';
$pageTitle = 'Noticias';
include 'includes/header.php';

$news = [
    [
        'title' => 'Nueva normativa para licencias de taxi en Barcelona',
        'date' => '15 Diciembre 2025',
        'excerpt' => 'El Ayuntamiento de Barcelona ha anunciado cambios importantes en la regulación de las licencias de taxi que entrarán en vigor en 2026.',
        'slug' => 'nueva-normativa-licencias'
    ],
    [
        'title' => 'Subvenciones para vehículos eléctricos',
        'date' => '10 Diciembre 2025',
        'excerpt' => 'Se amplía el programa de ayudas para la adquisición de taxis eléctricos e híbridos enchufables en el área metropolitana.',
        'slug' => 'subvenciones-electricos'
    ],
    [
        'title' => 'Acuerdo con las apps de movilidad',
        'date' => '5 Diciembre 2025',
        'excerpt' => 'Las principales asociaciones de taxistas han llegado a un acuerdo con las plataformas digitales de movilidad.',
        'slug' => 'acuerdo-apps-movilidad'
    ],
];
?>

<section class="category-header">
    <div class="container">
        <h1>NOTICIAS DEL SECTOR</h1>
    </div>
</section>

<section class="services-section">
    <div class="container">
        <div class="listings-grid">
            <?php foreach ($news as $article): ?>
            <div class="listing-card">
                <a href="/noticias/<?php echo $article['slug']; ?>.html">
                    <h3><?php echo $article['title']; ?></h3>
                    <p><?php echo $article['excerpt']; ?></p>
                    <div class="listing-meta">
                        <span>📅 <?php echo $article['date']; ?></span>
                    </div>
                </a>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
