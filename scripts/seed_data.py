"""
Script to seed the database with sample services for the Taxi Barcelona portal
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "test_database"

# Sample data for each category
SAMPLE_SERVICES = [
    # Licencias de Taxi
    {
        "id": "lic-001",
        "category": "licencias",
        "name": "Licencia Taxi Barcelona Centro",
        "description": "Licencia de taxi en venta en zona centro de Barcelona. Vehículo incluido, modelo 2020 en excelente estado. Precio negociable.",
        "contact_name": "Juan García",
        "email": "juan.garcia@example.com",
        "phone": "+34 612 345 678",
        "website": None,
        "address": "Barcelona, España",
        "image_url": "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "lic-002",
        "category": "licencias",
        "name": "Vendo Licencia Taxi - Zona Eixample",
        "description": "Licencia de taxi disponible en el Eixample. Incluye vehículo Mercedes Clase E 2021. Ingresos comprobables.",
        "contact_name": "María López",
        "email": "maria.lopez@example.com",
        "phone": "+34 623 456 789",
        "website": None,
        "address": "Eixample, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    # Gestorías
    {
        "id": "ges-001",
        "category": "gestorias",
        "name": "Gestoría Taxi Pro",
        "description": "Especialistas en gestión administrativa para taxistas. Trámites de licencias, renovaciones, seguros y más. Más de 20 años de experiencia en el sector.",
        "contact_name": "Carlos Martínez",
        "email": "info@gestoriataxipro.com",
        "phone": "+34 933 456 789",
        "website": "https://www.gestoriataxipro.com",
        "address": "Carrer de Balmes, 123, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "ges-002",
        "category": "gestorias",
        "name": "Administrativos del Taxi BCN",
        "description": "Gestoría especializada en el sector del taxi. Tramitamos licencias, permisos, seguros y toda la documentación necesaria. Atención personalizada.",
        "contact_name": "Ana Fernández",
        "email": "contacto@admtaxibcn.es",
        "phone": "+34 934 567 890",
        "website": "https://www.admtaxibcn.es",
        "address": "Passeig de Gràcia, 45, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1721379800770-fda153205b1c?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    # Talleres Mecánicos
    {
        "id": "tal-001",
        "category": "talleres",
        "name": "Taller Mecánico AutoTaxi",
        "description": "Taller especializado en mantenimiento y reparación de vehículos taxi. Servicio 24h, revisiones rápidas. Homologaciones oficiales.",
        "contact_name": "Pedro Sánchez",
        "email": "taller@autotaxi.com",
        "phone": "+34 932 345 678",
        "website": "https://www.autotaxi.com",
        "address": "Carrer de Sants, 234, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "tal-002",
        "category": "talleres",
        "name": "Mecánica Rápida Taxi BCN",
        "description": "Reparaciones express para taxistas. Precios especiales para el sector. Mecánica general, chapa y pintura. Servicio de recogida y entrega.",
        "contact_name": "Miguel Torres",
        "email": "info@mecanicataxibcn.es",
        "phone": "+34 933 234 567",
        "website": None,
        "address": "Avinguda Diagonal, 567, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1764869427883-9d2815278845?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    # Elementos del Taxi
    {
        "id": "ele-001",
        "category": "elementos",
        "name": "Taxímetros Digitales Pro",
        "description": "Venta e instalación de taxímetros homologados. Última tecnología digital. Servicio técnico oficial. Instalación en 24h.",
        "contact_name": "Roberto Díaz",
        "email": "ventas@taximetrosdigitales.com",
        "phone": "+34 931 234 567",
        "website": "https://www.taximetrosdigitales.com",
        "address": "Carrer de la Marina, 89, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1758411897888-3ca658535fdf?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "ele-002",
        "category": "elementos",
        "name": "Mamparas y Equipamiento Taxi",
        "description": "Especialistas en mamparas de seguridad homologadas para taxis. También disponemos de luminosos, emisoras y todo el equipamiento necesario.",
        "contact_name": "Laura Ruiz",
        "email": "info@mamparastaxis.es",
        "phone": "+34 932 123 456",
        "website": "https://www.mamparastaxis.es",
        "address": "Carrer del Consell de Cent, 345, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1758411897888-3ca658535fdf?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    # Escuelas de Taxistas
    {
        "id": "esc-001",
        "category": "escuelas",
        "name": "Escuela del Taxi Barcelona",
        "description": "Centro oficial de formación para obtener la credencial de taxista. Cursos intensivos y flexibles. Alta tasa de aprobados. Matrícula abierta.",
        "contact_name": "Carmen Morales",
        "email": "info@escuelataxibcn.com",
        "phone": "+34 934 123 456",
        "website": "https://www.escuelataxibcn.com",
        "address": "Carrer d'Aragó, 234, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1679669602647-aff24d24e414?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "esc-002",
        "category": "escuelas",
        "name": "Academia Profesional del Taxista",
        "description": "Formación completa para sacarte el carnet de taxista en Barcelona. Profesores con experiencia. Horarios de mañana y tarde. ¡Consigue tu credencial!",
        "contact_name": "Francisco Jiménez",
        "email": "academia@taxistapro.es",
        "phone": "+34 933 012 345",
        "website": "https://www.taxistapro.es",
        "address": "Gran Via de les Corts Catalanes, 456, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1679669602647-aff24d24e414?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    # Bolsa de Trabajo
    {
        "id": "bol-001",
        "category": "bolsa_trabajo",
        "name": "Taxista con Credencial - Disponible",
        "description": "Taxista profesional con 5 años de experiencia y credencial en vigor. Disponibilidad inmediata para jornada completa o parcial. Conocimiento total de Barcelona.",
        "contact_name": "Alberto Ramírez",
        "email": "alberto.ramirez@example.com",
        "phone": "+34 645 123 456",
        "website": None,
        "address": "Barcelona",
        "image_url": "https://images.unsplash.com/photo-1761579638951-9121bbfcb2a6?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "bol-002",
        "category": "bolsa_trabajo",
        "name": "Conductor Experimentado Busca Trabajo",
        "description": "Taxista con credencial oficial y 10 años de experiencia. Busco trabajo estable. Referencias disponibles. Vehículo adaptado propio opcional.",
        "contact_name": "José Manuel Gómez",
        "email": "jm.gomez@example.com",
        "phone": "+34 656 234 567",
        "website": None,
        "address": "Barcelona",
        "image_url": "https://images.unsplash.com/photo-1761579638951-9121bbfcb2a6?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    # Emisoras y Apps
    {
        "id": "emi-001",
        "category": "emisoras",
        "name": "Radio Taxi Barcelona",
        "description": "Emisora de taxi líder en Barcelona. Sistema de gestión de servicios 24/7. App para conductores incluida. Comisiones competitivas.",
        "contact_name": "Servicio al Taxista",
        "email": "alta@radiotaxibcn.com",
        "phone": "+34 933 033 033",
        "website": "https://www.radiotaxibcn.com",
        "address": "Carrer de Provença, 123, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1764347923709-fc48487f2486?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "emi-002",
        "category": "emisoras",
        "name": "TaxiApp Barcelona",
        "description": "Aplicación móvil para taxistas independientes. Consigue más servicios sin comisiones abusivas. Pago directo al conductor. Descarga gratuita.",
        "contact_name": "Soporte TaxiApp",
        "email": "soporte@taxiappbcn.es",
        "phone": "+34 931 999 888",
        "website": "https://www.taxiappbcn.es",
        "address": "Barcelona",
        "image_url": "https://images.unsplash.com/photo-1764347923709-fc48487f2486?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    # Seguros
    {
        "id": "seg-001",
        "category": "seguros",
        "name": "Seguros TaxiSegur",
        "description": "Seguros especializados para taxis y VTC. Cobertura completa a medida. Asistencia 24h. Precios competitivos con descuentos para taxistas.",
        "contact_name": "Departamento Comercial",
        "email": "info@taxisegur.com",
        "phone": "+34 935 100 200",
        "website": "https://www.taxisegur.com",
        "address": "Passeig de Sant Joan, 78, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1758518730384-be3d205838e8?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "seg-002",
        "category": "seguros",
        "name": "Mutua del Taxi Barcelona",
        "description": "Seguros para taxistas con las mejores coberturas. Especialistas en el sector desde 1980. Tramitación rápida. Consulta sin compromiso.",
        "contact_name": "Asesor de Seguros",
        "email": "comercial@mutuataxi.es",
        "phone": "+34 934 200 300",
        "website": "https://www.mutuataxi.es",
        "address": "Ronda de Sant Pere, 23, Barcelona",
        "image_url": "https://images.unsplash.com/photo-1758518730384-be3d205838e8?w=600&h=400&fit=crop",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
]

async def seed_database():
    """Seed the database with sample services"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Clear existing services
    await db.services.delete_many({})
    print("Cleared existing services")
    
    # Insert sample services
    await db.services.insert_many(SAMPLE_SERVICES)
    print(f"Inserted {len(SAMPLE_SERVICES)} sample services")
    
    # Verify insertion
    count = await db.services.count_documents({})
    print(f"Total services in database: {count}")
    
    client.close()

if __name__ == "__main__":
    print("Seeding database with sample data...")
    asyncio.run(seed_database())
    print("Database seeded successfully!")
