    </main>
    
    <!-- Newsletter Section -->
    <section class="newsletter-section">
        <div class="container">
            <h3>RECIBE LAS NOVEDADES</h3>
            <p>Suscríbete para estar al día de todas las noticias del sector del taxi en Barcelona</p>
            
            <form id="newsletterForm" class="newsletter-form">
                <div class="form-row">
                    <input type="text" name="name" placeholder="Tu nombre *" required>
                    <input type="email" name="email" placeholder="Tu email *" required>
                    <input type="tel" name="phone" placeholder="Tu móvil">
                    <button type="submit">Suscribirse</button>
                </div>
                <p class="whatsapp-note">📱 Si quieres que te añadamos al canal de WhatsApp, introduce tu móvil</p>
                <div id="newsletterMessage" class="form-message"></div>
            </form>
        </div>
    </section>
    
    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h4 class="footer-title">AMARILLONEGRO.COM</h4>
                    <p>El portal de referencia para servicios profesionales del sector del taxi en Barcelona.</p>
                </div>
                <div class="footer-col">
                    <h4>ENLACES RÁPIDOS</h4>
                    <ul>
                        <li><a href="/">Inicio</a></li>
                        <li><a href="/servicios.php">Servicios</a></li>
                        <li><a href="/noticias.php">Noticias</a></li>
                        <li><a href="/publicar.php">Publicar Anuncio</a></li>
                        <li><a href="/admin/">Admin</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>CONTACTO</h4>
                    <p><a href="mailto:info@taxis.cat">📧 info@taxis.cat</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> AmarilloNegro.com - Portal Taxi Barcelona. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>
    
    <script src="/js/main.js"></script>
</body>
</html>
