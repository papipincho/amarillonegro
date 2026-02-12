import mysql.connector
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv('/app/backend/.env')

# Database configuration
db_config = {
    "host": os.environ.get('MYSQL_HOST', 'localhost'),
    "user": os.environ.get('MYSQL_USER', 'root'),
    "password": os.environ.get('MYSQL_PASSWORD', ''),
    "database": os.environ.get('MYSQL_DATABASE', 'amarillonegro_db')
}

# Sample data
SAMPLE_SERVICES = [
    # Licencias
    ("licencias", "Licencia Taxi Barcelona Centro", "Licencia de taxi en venta en zona centro de Barcelona. Vehículo incluido, modelo 2020.", "Juan García", "juan.garcia@example.com", "+34 612 345 678", None, "Barcelona, España", "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"),
    ("licencias", "Vendo Licencia Taxi - Zona Eixample", "Licencia disponible en Eixample. Incluye Mercedes Clase E 2021.", "María López", "maria.lopez@example.com", "+34 623 456 789", None, "Eixample, Barcelona", "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"),
    # Gestorías
    ("gestorias", "Gestoría Taxi Pro", "Especialistas en gestión administrativa para taxistas. Más de 20 años de experiencia.", "Carlos Martínez", "info@gestoriataxipro.com", "+34 933 456 789", "https://www.gestoriataxipro.com", "Carrer de Balmes, 123, Barcelona", "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"),
    ("gestorias", "Administrativos del Taxi BCN", "Gestoría especializada en el sector del taxi. Atención personalizada.", "Ana Fernández", "contacto@admtaxibcn.es", "+34 934 567 890", "https://www.admtaxibcn.es", "Passeig de Gràcia, 45, Barcelona", "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"),
    # Talleres
    ("talleres", "Taller Mecánico AutoTaxi", "Taller especializado en mantenimiento de vehículos taxi. Servicio 24h.", "Pedro Sánchez", "taller@autotaxi.com", "+34 932 345 678", "https://www.autotaxi.com", "Carrer de Sants, 234, Barcelona", "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"),
    ("talleres", "Mecánica Rápida Taxi BCN", "Reparaciones express para taxistas. Precios especiales.", "Miguel Torres", "info@mecanicataxibcn.es", "+34 933 234 567", None, "Avinguda Diagonal, 567, Barcelona", "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"),
    # Elementos
    ("elementos", "Taxímetros Digitales Pro", "Venta e instalación de taxímetros homologados. Última tecnología.", "Roberto Díaz", "ventas@taximetrosdigitales.com", "+34 931 234 567", "https://www.taximetrosdigitales.com", "Carrer de la Marina, 89, Barcelona", "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"),
    ("elementos", "Mamparas y Equipamiento Taxi", "Mamparas de seguridad homologadas. Todo el equipamiento necesario.", "Laura Ruiz", "info@mamparastaxis.es", "+34 932 123 456", "https://www.mamparastaxis.es", "Carrer del Consell de Cent, 345, Barcelona", "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"),
    # Escuelas
    ("escuelas", "Escuela del Taxi Barcelona", "Centro oficial de formación. Cursos intensivos y flexibles.", "Carmen Morales", "info@escuelataxibcn.com", "+34 934 123 456", "https://www.escuelataxibcn.com", "Carrer d'Aragó, 234, Barcelona", "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"),
    ("escuelas", "Academia Profesional del Taxista", "Formación completa para el carnet de taxista. Alta tasa de aprobados.", "Francisco Jiménez", "academia@taxistapro.es", "+34 933 012 345", "https://www.taxistapro.es", "Gran Via, 456, Barcelona", "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"),
    # Bolsa trabajo
    ("bolsa_trabajo", "Taxista Profesional Disponible", "5 años de experiencia. Disponibilidad inmediata. Conocimiento total de Barcelona.", "Alberto Ramírez", "alberto.ramirez@example.com", "+34 645 123 456", None, "Barcelona", "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"),
    ("bolsa_trabajo", "Conductor Experimentado", "10 años de experiencia. Busco trabajo estable. Referencias disponibles.", "José Manuel Gómez", "jm.gomez@example.com", "+34 656 234 567", None, "Barcelona", "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"),
    # Emisoras
    ("emisoras", "Radio Taxi Barcelona", "Emisora líder. Sistema 24/7. App incluida.", "Servicio al Taxista", "alta@radiotaxibcn.com", "+34 933 033 033", "https://www.radiotaxibcn.com", "Carrer de Provença, 123, Barcelona", "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"),
    ("emisoras", "TaxiApp Barcelona", "App móvil para taxistas. Sin comisiones abusivas.", "Soporte TaxiApp", "soporte@taxiappbcn.es", "+34 931 999 888", "https://www.taxiappbcn.es", "Barcelona", "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"),
    # Seguros
    ("seguros", "Seguros TaxiSegur", "Seguros especializados para taxis. Cobertura completa. Asistencia 24h.", "Departamento Comercial", "info@taxisegur.com", "+34 935 100 200", "https://www.taxisegur.com", "Passeig de Sant Joan, 78, Barcelona", "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"),
    ("seguros", "Mutua del Taxi Barcelona", "Especialistas desde 1980. Las mejores coberturas.", "Asesor de Seguros", "comercial@mutuataxi.es", "+34 934 200 300", "https://www.mutuataxi.es", "Ronda de Sant Pere, 23, Barcelona", "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"),
]

NEWSLETTER_SUBSCRIBERS = [
    ("Carlos Ruiz", "carlos.ruiz@taxibcn.com"),
    ("María González", "maria.gonzalez@taxista.es"),
    ("Juan López", "juan.lopez@gmail.com"),
    ("Ana Martínez", "ana.martinez@outlook.com"),
    ("Pedro Sánchez", "pedro.sanchez@yahoo.es"),
]

def create_database_and_tables():
    """Create database and tables"""
    try:
        # Connect without database to create it
        conn = mysql.connector.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password']
        )
        cursor = conn.cursor()
        
        # Create database
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_config['database']} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print(f"✓ Database '{db_config['database']}' created/verified")
        
        cursor.close()
        conn.close()
        
        # Connect to the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Create services table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50) NOT NULL,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                contact_name VARCHAR(100),
                email VARCHAR(100),
                phone VARCHAR(20),
                website VARCHAR(200),
                address VARCHAR(200),
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✓ Table 'services' created")
        
        # Create contact_submissions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                service_category VARCHAR(50) NOT NULL,
                business_name VARCHAR(200) NOT NULL,
                description TEXT,
                website VARCHAR(200),
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_submitted_at (submitted_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✓ Table 'contact_submissions' created")
        
        # Create newsletter_subscriptions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_subscribed_at (subscribed_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✓ Table 'newsletter_subscriptions' created")
        
        conn.commit()
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"✗ Error: {err}")
        return False
    
    return True

def seed_data():
    """Insert sample data"""
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Clear existing data
        cursor.execute("DELETE FROM services")
        cursor.execute("DELETE FROM newsletter_subscriptions")
        print("✓ Existing data cleared")
        
        # Insert services
        query = """INSERT INTO services (category, name, description, contact_name, email, phone, website, address, image_url, created_at)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        
        for service in SAMPLE_SERVICES:
            values = service + (datetime.now(timezone.utc),)
            cursor.execute(query, values)
        
        print(f"✓ Inserted {len(SAMPLE_SERVICES)} services")
        
        # Insert newsletter subscribers
        query = "INSERT INTO newsletter_subscriptions (name, email, subscribed_at) VALUES (%s, %s, %s)"
        
        for subscriber in NEWSLETTER_SUBSCRIBERS:
            values = subscriber + (datetime.now(timezone.utc),)
            cursor.execute(query, values)
        
        print(f"✓ Inserted {len(NEWSLETTER_SUBSCRIBERS)} newsletter subscribers")
        
        conn.commit()
        
        # Verify
        cursor.execute("SELECT COUNT(*) FROM services")
        service_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM newsletter_subscriptions")
        subscriber_count = cursor.fetchone()[0]
        
        print(f"\n=== Database Summary ===")
        print(f"Services: {service_count}")
        print(f"Newsletter Subscribers: {subscriber_count}")
        
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"✗ Error seeding data: {err}")
        return False
    
    return True

if __name__ == "__main__":
    print("=== MySQL Database Setup ===")
    print(f"Database: {db_config['database']}")
    print(f"Host: {db_config['host']}\n")
    
    if create_database_and_tables():
        print("\n=== Seeding Data ===")
        if seed_data():
            print("\n✅ Database setup completed successfully!")
        else:
            print("\n✗ Error seeding data")
    else:
        print("\n✗ Error creating database and tables")
