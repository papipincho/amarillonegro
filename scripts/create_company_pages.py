"""
Script para crear páginas HTML estáticas de empresas
"""
import os

# Definir las 8 categorías con 6 empresas cada una
COMPANIES = {
    "licencias": [
        {"slug": "licencia-taxi-centro-bcn", "name": "Licencia Taxi Centro Barcelona", "address": "Carrer de Balmes, 45", "phone": "+34 933 123 456"},
        {"slug": "licencias-premium-taxi", "name": "Licencias Premium Taxi", "address": "Passeig de Gràcia, 78", "phone": "+34 934 234 567"},
        {"slug": "venta-licencias-eixample", "name": "Venta Licencias Eixample", "address": "Carrer d'Aragó, 234", "phone": "+34 935 345 678"},
        {"slug": "taxi-licenses-barcelona", "name": "Taxi Licenses Barcelona", "address": "Avinguda Diagonal, 456", "phone": "+34 936 456 789"},
        {"slug": "licencias-taxi-profesional", "name": "Licencias Taxi Profesional", "address": "Gran Via, 567", "phone": "+34 937 567 890"},
        {"slug": "compraventa-licencias-bcn", "name": "Compraventa Licencias BCN", "address": "Ronda de Sant Pere, 89", "phone": "+34 938 678 901"},
    ],
    "gestorias": [
        {"slug": "gestoria-taxi-pro", "name": "Gestoría Taxi Pro", "address": "Carrer de Balmes, 123", "phone": "+34 933 456 789"},
        {"slug": "administrativos-taxi-bcn", "name": "Administrativos del Taxi BCN", "address": "Passeig de Gràcia, 45", "phone": "+34 934 567 890"},
        {"slug": "gestoria-integral-taxista", "name": "Gestoría Integral Taxista", "address": "Carrer de Sants, 156", "phone": "+34 935 678 901"},
        {"slug": "tramites-taxi-barcelona", "name": "Trámites Taxi Barcelona", "address": "Via Laietana, 78", "phone": "+34 936 789 012"},
        {"slug": "asesoria-legal-taxi", "name": "Asesoría Legal Taxi", "address": "Carrer del Consell de Cent, 234", "phone": "+34 937 890 123"},
        {"slug": "gestoria-rapida-taxi", "name": "Gestoría Rápida Taxi", "address": "Carrer de Provença, 345", "phone": "+34 938 901 234"},
    ],
    "talleres": [
        {"slug": "taller-mecanico-autotaxi", "name": "Taller Mecánico AutoTaxi", "address": "Carrer de Sants, 234", "phone": "+34 932 345 678"},
        {"slug": "mecanica-rapida-taxi-bcn", "name": "Mecánica Rápida Taxi BCN", "address": "Avinguda Diagonal, 567", "phone": "+34 933 234 567"},
        {"slug": "taller-especializado-taxi", "name": "Taller Especializado Taxi", "address": "Carrer de la Marina, 123", "phone": "+34 934 123 456"},
        {"slug": "reparaciones-express-taxi", "name": "Reparaciones Express Taxi", "address": "Carrer de Badal, 89", "phone": "+34 935 012 345"},
        {"slug": "auto-servicio-taxi", "name": "Auto Servicio Taxi", "address": "Carrer de Numància, 234", "phone": "+34 936 123 456"},
        {"slug": "taller-premium-taxi", "name": "Taller Premium Taxi", "address": "Carrer de Tarragona, 156", "phone": "+34 937 234 567"},
    ],
    "elementos": [
        {"slug": "taximetros-digitales-pro", "name": "Taxímetros Digitales Pro", "address": "Carrer de la Marina, 89", "phone": "+34 931 234 567"},
        {"slug": "mamparas-equipamiento-taxi", "name": "Mamparas y Equipamiento Taxi", "address": "Carrer del Consell de Cent, 345", "phone": "+34 932 123 456"},
        {"slug": "tecnologia-taxi-bcn", "name": "Tecnología Taxi BCN", "address": "Carrer de Provença, 234", "phone": "+34 933 012 345"},
        {"slug": "instalaciones-taxi-pro", "name": "Instalaciones Taxi Pro", "address": "Avinguda Meridiana, 123", "phone": "+34 934 901 234"},
        {"slug": "equipamiento-completo-taxi", "name": "Equipamiento Completo Taxi", "address": "Carrer de Pallars, 156", "phone": "+34 935 890 123"},
        {"slug": "elementos-seguridad-taxi", "name": "Elementos de Seguridad Taxi", "address": "Carrer del Bogatell, 89", "phone": "+34 936 789 012"},
    ],
    "escuelas": [
        {"slug": "escuela-taxi-barcelona", "name": "Escuela del Taxi Barcelona", "address": "Carrer d'Aragó, 234", "phone": "+34 934 123 456"},
        {"slug": "academia-profesional-taxista", "name": "Academia Profesional del Taxista", "address": "Gran Via, 456", "phone": "+34 933 012 345"},
        {"slug": "formacion-taxi-integral", "name": "Formación Taxi Integral", "address": "Carrer de Valencia, 345", "phone": "+34 935 234 567"},
        {"slug": "centro-estudios-taxi", "name": "Centro de Estudios Taxi", "address": "Ronda Universitat, 123", "phone": "+34 936 345 678"},
        {"slug": "cursos-credencial-taxista", "name": "Cursos Credencial Taxista", "address": "Carrer de Pau Claris, 234", "phone": "+34 937 456 789"},
        {"slug": "academia-taxi-express", "name": "Academia Taxi Express", "address": "Passeig Sant Joan, 156", "phone": "+34 938 567 890"},
    ],
    "bolsa_trabajo": [
        {"slug": "conductores-profesionales-bcn", "name": "Conductores Profesionales BCN", "address": "Carrer de Balmes, 234", "phone": "+34 645 123 456"},
        {"slug": "taxistas-disponibles", "name": "Taxistas Disponibles", "address": "Avinguda Diagonal, 345", "phone": "+34 656 234 567"},
        {"slug": "empleo-taxi-barcelona", "name": "Empleo Taxi Barcelona", "address": "Gran Via, 234", "phone": "+34 667 345 678"},
        {"slug": "trabajo-conductor-taxi", "name": "Trabajo Conductor Taxi", "address": "Carrer de Provença, 123", "phone": "+34 678 456 789"},
        {"slug": "taxistas-con-experiencia", "name": "Taxistas con Experiencia", "address": "Passeig de Gràcia, 234", "phone": "+34 689 567 890"},
        {"slug": "bolsa-conductores-taxi", "name": "Bolsa Conductores Taxi", "address": "Ronda Sant Pere, 156", "phone": "+34 690 678 901"},
    ],
    "emisoras": [
        {"slug": "radio-taxi-barcelona", "name": "Radio Taxi Barcelona", "address": "Carrer de Provença, 123", "phone": "+34 933 033 033"},
        {"slug": "taxiapp-barcelona", "name": "TaxiApp Barcelona", "address": "Avinguda Diagonal, 234", "phone": "+34 931 999 888"},
        {"slug": "emisora-taxi-digital", "name": "Emisora Taxi Digital", "address": "Carrer de Balmes, 345", "phone": "+34 934 888 777"},
        {"slug": "plataforma-taxi-pro", "name": "Plataforma Taxi Pro", "address": "Gran Via, 456", "phone": "+34 935 777 666"},
        {"slug": "central-taxi-bcn", "name": "Central Taxi BCN", "address": "Passeig Sant Joan, 234", "phone": "+34 936 666 555"},
        {"slug": "app-conductores-taxi", "name": "App Conductores Taxi", "address": "Carrer de Sants, 123", "phone": "+34 937 555 444"},
    ],
    "seguros": [
        {"slug": "seguros-taxisegur", "name": "Seguros TaxiSegur", "address": "Passeig de Sant Joan, 78", "phone": "+34 935 100 200"},
        {"slug": "mutua-taxi-barcelona", "name": "Mutua del Taxi Barcelona", "address": "Ronda de Sant Pere, 23", "phone": "+34 934 200 300"},
        {"slug": "aseguradora-taxi-pro", "name": "Aseguradora Taxi Pro", "address": "Carrer de Balmes, 156", "phone": "+34 936 300 400"},
        {"slug": "seguros-integrales-taxi", "name": "Seguros Integrales Taxi", "address": "Avinguda Diagonal, 678", "phone": "+34 937 400 500"},
        {"slug": "proteccion-taxi-bcn", "name": "Protección Taxi BCN", "address": "Gran Via, 789", "phone": "+34 938 500 600"},
        {"slug": "cobertura-total-taxi", "name": "Cobertura Total Taxi", "address": "Carrer de Provença, 456", "phone": "+34 939 600 700"},
    ],
}

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - AmarilloNegro.com</title>
    <style>
        body {{
            font-family: 'Inter', -apple-system, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }}
        .header {{
            background-color: #0A0A0A;
            color: white;
            padding: 1rem 2rem;
            border-bottom: 4px solid #FFCC00;
        }}
        .header h1 {{
            margin: 0;
            font-size: 1.5rem;
            font-weight: 700;
        }}
        .back-link {{
            display: inline-block;
            color: #FFCC00;
            text-decoration: none;
            margin-bottom: 1rem;
            font-weight: 600;
        }}
        .back-link:hover {{
            text-decoration: underline;
        }}
        .company-card {{
            background: white;
            border: 2px solid #000;
            box-shadow: 6px 6px 0px 0px #000;
            padding: 2rem;
            margin-bottom: 2rem;
        }}
        .company-title {{
            font-size: 2.5rem;
            font-weight: 700;
            color: #0A0A0A;
            margin-bottom: 1rem;
            font-family: 'Oswald', sans-serif;
        }}
        .category-badge {{
            display: inline-block;
            background-color: #FFCC00;
            color: #000;
            padding: 0.5rem 1rem;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
        }}
        .section {{
            margin-bottom: 2rem;
        }}
        .section-title {{
            font-size: 1.5rem;
            font-weight: 700;
            color: #0A0A0A;
            margin-bottom: 1rem;
            border-left: 4px solid #FFCC00;
            padding-left: 1rem;
        }}
        .info-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }}
        .info-item {{
            background: #f9f9f9;
            padding: 1rem;
            border: 1px solid #ddd;
        }}
        .info-label {{
            font-weight: 700;
            color: #666;
            font-size: 0.875rem;
            text-transform: uppercase;
            margin-bottom: 0.5rem;
        }}
        .info-value {{
            color: #0A0A0A;
            font-size: 1.125rem;
        }}
        .services-list {{
            list-style: none;
            padding: 0;
        }}
        .services-list li {{
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            background: #f9f9f9;
            border-left: 3px solid #FFCC00;
        }}
        .description {{
            font-size: 1.125rem;
            line-height: 1.8;
            color: #333;
        }}
        .cta-box {{
            background: #FFCC00;
            padding: 2rem;
            text-align: center;
            border: 2px solid #000;
            margin-top: 2rem;
        }}
        .cta-box h3 {{
            margin-top: 0;
            font-size: 1.75rem;
        }}
        .edit-note {{
            background: #fff3cd;
            border: 2px dashed #ffc107;
            padding: 1rem;
            margin-bottom: 2rem;
            font-style: italic;
            color: #856404;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🚕 AMARILLONEGRO.COM</h1>
    </div>

    <div class="container">
        <a href="/" class="back-link">← Volver al portal</a>

        <div class="edit-note">
            📝 <strong>Nota:</strong> Esta es una plantilla HTML estática. Edita este archivo directamente para actualizar la información de la empresa.
        </div>

        <div class="company-card">
            <!-- TÍTULO Y CATEGORÍA -->
            <h1 class="company-title">{name}</h1>
            <span class="category-badge">{category_name}</span>

            <!-- DESCRIPCIÓN PRINCIPAL -->
            <div class="section">
                <h2 class="section-title">Descripción</h2>
                <p class="description">
                    [EDITAR AQUÍ] Descripción detallada de la empresa, servicios que ofrece, años de experiencia, 
                    especialidades, certificaciones, equipo profesional, etc. Este texto debe ser persuasivo y 
                    proporcionar información relevante para los taxistas que buscan estos servicios.
                </p>
            </div>

            <!-- INFORMACIÓN DE CONTACTO -->
            <div class="section">
                <h2 class="section-title">Información de Contacto</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">📍 Dirección</div>
                        <div class="info-value">{address}<br>Barcelona, España</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">📞 Teléfono</div>
                        <div class="info-value">{phone}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">📧 Email</div>
                        <div class="info-value">[EDITAR] info@empresa.com</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">🌐 Sitio Web</div>
                        <div class="info-value">[EDITAR] www.empresa.com</div>
                    </div>
                </div>
            </div>

            <!-- HORARIO -->
            <div class="section">
                <h2 class="section-title">Horario de Atención</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Lunes a Viernes</div>
                        <div class="info-value">[EDITAR] 9:00 - 19:00</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Sábados</div>
                        <div class="info-value">[EDITAR] 9:00 - 14:00</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Domingos</div>
                        <div class="info-value">[EDITAR] Cerrado</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Servicio de Urgencias</div>
                        <div class="info-value">[EDITAR] 24/7 disponible</div>
                    </div>
                </div>
            </div>

            <!-- SERVICIOS OFRECIDOS -->
            <div class="section">
                <h2 class="section-title">Servicios Ofrecidos</h2>
                <ul class="services-list">
                    <li>[EDITAR] Servicio 1 - Descripción breve del servicio</li>
                    <li>[EDITAR] Servicio 2 - Descripción breve del servicio</li>
                    <li>[EDITAR] Servicio 3 - Descripción breve del servicio</li>
                    <li>[EDITAR] Servicio 4 - Descripción breve del servicio</li>
                    <li>[EDITAR] Servicio 5 - Descripción breve del servicio</li>
                </ul>
            </div>

            <!-- VENTAJAS / POR QUÉ ELEGIRNOS -->
            <div class="section">
                <h2 class="section-title">¿Por Qué Elegirnos?</h2>
                <ul class="services-list">
                    <li>[EDITAR] ✓ Ventaja 1 - Experiencia de más de X años</li>
                    <li>[EDITAR] ✓ Ventaja 2 - Atención personalizada</li>
                    <li>[EDITAR] ✓ Ventaja 3 - Precios competitivos</li>
                    <li>[EDITAR] ✓ Ventaja 4 - Servicio rápido y eficiente</li>
                    <li>[EDITAR] ✓ Ventaja 5 - Profesionales certificados</li>
                </ul>
            </div>

            <!-- PRECIOS / TARIFAS (OPCIONAL) -->
            <div class="section">
                <h2 class="section-title">Tarifas</h2>
                <p class="description">
                    [EDITAR] Información sobre precios, paquetes, descuentos especiales para taxistas, 
                    formas de pago aceptadas, etc. Si no aplica, eliminar esta sección.
                </p>
            </div>

            <!-- LLAMADA A LA ACCIÓN -->
            <div class="cta-box">
                <h3>¿Interesado en Nuestros Servicios?</h3>
                <p>Contáctanos hoy mismo para más información o para solicitar un presupuesto sin compromiso.</p>
                <p><strong>📞 {phone}</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
"""

def create_company_pages():
    """Create HTML pages for all companies"""
    category_names = {
        "licencias": "Licencias de Taxi",
        "gestorias": "Gestorías",
        "talleres": "Talleres Mecánicos",
        "elementos": "Elementos del Taxi",
        "escuelas": "Escuelas de Taxistas",
        "bolsa_trabajo": "Bolsa de Trabajo",
        "emisoras": "Emisoras y Apps",
        "seguros": "Seguros para Taxistas"
    }
    
    base_dir = "/app/frontend/public/empresas"
    total_created = 0
    
    for category, companies in COMPANIES.items():
        category_dir = os.path.join(base_dir, category)
        
        for company in companies:
            html_content = HTML_TEMPLATE.format(
                name=company['name'],
                slug=company['slug'],
                category_name=category_names[category],
                address=company['address'],
                phone=company['phone']
            )
            
            file_path = os.path.join(category_dir, f"{company['slug']}.html")
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            total_created += 1
            print(f"✓ Created: {category}/{company['slug']}.html")
    
    print(f"\n✅ Total pages created: {total_created}")
    return COMPANIES

if __name__ == "__main__":
    print("=== Creating Company HTML Pages ===\n")
    companies = create_company_pages()
    print("\n=== All pages created successfully ===")
