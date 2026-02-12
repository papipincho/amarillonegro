<?php
/**
 * Header Component
 */
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle . ' - ' : ''; ?>AmarilloNegro.com - Portal Taxi Barcelona</title>
    <meta name="description" content="Portal de servicios profesionales para taxistas en Barcelona">
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="logo">
                <span class="logo-amarillo">AMARILLO</span><span class="logo-negro">NEGRO</span><span class="logo-com">.COM</span>
            </a>
            <div class="nav-links" id="navLinks">
                <a href="/" class="<?php echo $currentPage === 'home' ? 'active' : ''; ?>">Inicio</a>
                <a href="/servicios.php" class="<?php echo $currentPage === 'servicios' ? 'active' : ''; ?>">Servicios</a>
                <a href="/noticias.php" class="<?php echo $currentPage === 'noticias' ? 'active' : ''; ?>">Noticias</a>
                <a href="/publicar.php" class="btn-publish">Publicar Anuncio</a>
            </div>
            <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>
    <main>
