<?php
$currentPage = 'publicar';
$pageTitle = 'Publicar Servicio';
include 'includes/header.php';

$categories = [
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

<section class="page-section" style="background: var(--black); min-height: calc(100vh - 200px);">
    <div class="container" style="max-width: 700px;">
        
        <!-- Form Container -->
        <div id="formContainer" class="card">
            <div class="card-header">PUBLICAR SERVICIO</div>
            
            <p style="color: var(--gray-600); margin-bottom: 2rem;">
                Completa el formulario y nos pondremos en contacto contigo para informarte sobre las condiciones y precios de publicación en el portal.
            </p>
            
            <form id="publishForm">
                <div class="form-group">
                    <label>Tu nombre *</label>
                    <input type="text" name="name" required>
                </div>
                
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label>Teléfono *</label>
                    <input type="tel" name="phone" required>
                </div>
                
                <div class="form-group">
                    <label>Categoría del servicio *</label>
                    <select name="service_category" required>
                        <option value="">Selecciona una categoría</option>
                        <?php foreach ($categories as $id => $name): ?>
                        <option value="<?php echo $id; ?>"><?php echo $name; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Nombre del negocio/servicio *</label>
                    <input type="text" name="business_name" required>
                </div>
                
                <div class="form-group">
                    <label>Descripción del servicio *</label>
                    <textarea name="description" required></textarea>
                </div>
                
                <div class="form-group">
                    <label>Sitio web (opcional)</label>
                    <input type="url" name="website" placeholder="https://">
                </div>
                
                <div style="background: var(--gray-100); border: 2px solid var(--black); padding: 1rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 0.875rem; color: var(--gray-600); margin: 0;">
                        * Campos obligatorios. Al enviar este formulario, recibiremos tu solicitud en <strong>info@taxis.cat</strong> y nos pondremos en contacto contigo.
                    </p>
                </div>
                
                <button type="submit" class="btn-submit">Enviar solicitud</button>
            </form>
        </div>
        
        <!-- Success Container -->
        <div id="successContainer" class="card" style="display: none;">
            <div class="success-box">
                <div class="success-icon">✓</div>
                <h2>¡SOLICITUD ENVIADA!</h2>
                <p style="color: var(--gray-600); margin-bottom: 2rem;">
                    Gracias por tu interés. Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto para informarte sobre las condiciones y precios de publicación.
                </p>
                <a href="/" class="btn-primary">Volver al inicio</a>
            </div>
        </div>
        
    </div>
</section>

<?php include 'includes/footer.php'; ?>
