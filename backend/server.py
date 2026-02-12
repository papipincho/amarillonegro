from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import pooling, Error as MySQLError
import os
import logging
import asyncio
import secrets
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timezone
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MySQL configuration from environment
MYSQL_CONFIG = {
    "host": os.environ.get('MYSQL_HOST', 'localhost'),
    "port": int(os.environ.get('MYSQL_PORT', 3306)),
    "user": os.environ.get('MYSQL_USER', 'root'),
    "password": os.environ.get('MYSQL_PASSWORD', ''),
    "database": os.environ.get('MYSQL_DATABASE', 'amarillonegro_db'),
}

# Connection pool
connection_pool = None

def init_db_pool():
    """Initialize MySQL connection pool"""
    global connection_pool
    try:
        pool_config = {
            **MYSQL_CONFIG,
            "pool_name": "mypool",
            "pool_size": 5,
            "pool_reset_session": True
        }
        connection_pool = pooling.MySQLConnectionPool(**pool_config)
        logging.info("MySQL connection pool created successfully")
        return True
    except MySQLError as err:
        logging.error(f"Error creating connection pool: {err}")
        return False

def get_db_connection():
    """Get a connection from the pool"""
    global connection_pool
    if connection_pool is None:
        if not init_db_pool():
            return None
    try:
        return connection_pool.get_connection()
    except MySQLError as err:
        logging.error(f"Error getting connection: {err}")
        return None

def init_database():
    """Initialize database tables"""
    conn = get_db_connection()
    if conn is None:
        logging.warning("Could not initialize database - no connection")
        return False
    
    try:
        cursor = conn.cursor()
        
        # Create newsletter_subscriptions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(50),
                subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        # Create contact_submissions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                service_category VARCHAR(100) NOT NULL,
                business_name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                website VARCHAR(500),
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        # Create services table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(100) NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                contact_name VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(50),
                website VARCHAR(500),
                address VARCHAR(500),
                image_url VARCHAR(500),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        conn.commit()
        logging.info("Database tables initialized successfully")
        return True
    except MySQLError as err:
        logging.error(f"Error initializing database: {err}")
        return False
    finally:
        cursor.close()
        conn.close()

# Resend configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Admin credentials
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'Amarillonegro1?')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBasic()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify admin credentials"""
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not correct_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


# Pydantic Models
class Service(BaseModel):
    id: Optional[int] = None
    category: str
    name: str
    description: str
    contact_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None

class ServiceCreate(BaseModel):
    category: str
    name: str
    description: str
    contact_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    image_url: Optional[str] = None

class ContactSubmission(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    phone: str
    service_category: str
    business_name: str
    description: str
    website: Optional[str] = None
    submitted_at: Optional[datetime] = None

class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service_category: str
    business_name: str
    description: str
    website: Optional[str] = None

class NewsletterSubscription(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    phone: Optional[str] = None
    subscribed_at: Optional[datetime] = None

class NewsletterSubscriptionCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None


# Routes
@api_router.get("/")
async def root():
    return {"message": "AmarilloNegro.com - Portal Taxi Barcelona API"}

@api_router.get("/health")
async def health_check():
    """Health check endpoint to verify database connection"""
    conn = get_db_connection()
    if conn is None:
        return {"status": "error", "database": "disconnected"}
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}
    finally:
        conn.close()

@api_router.get("/services", response_model=List[Service])
async def get_all_services():
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM services ORDER BY created_at DESC")
        services = cursor.fetchall()
        cursor.close()
        return services
    except MySQLError as err:
        logger.error(f"Error fetching services: {err}")
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        conn.close()

@api_router.get("/services/{category}", response_model=List[Service])
async def get_services_by_category(category: str):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM services WHERE category = %s ORDER BY created_at DESC", (category,))
        services = cursor.fetchall()
        cursor.close()
        return services
    except MySQLError as err:
        logger.error(f"Error fetching services by category: {err}")
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        conn.close()

@api_router.post("/services", response_model=Service)
async def create_service(input: ServiceCreate):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = conn.cursor()
        query = """INSERT INTO services (category, name, description, contact_name, email, phone, website, address, image_url, created_at)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        values = (
            input.category, input.name, input.description, input.contact_name,
            input.email, input.phone, input.website, input.address, input.image_url,
            datetime.now(timezone.utc)
        )
        cursor.execute(query, values)
        conn.commit()
        service_id = cursor.lastrowid
        cursor.close()
        
        # Fetch the created service
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM services WHERE id = %s", (service_id,))
        service = cursor.fetchone()
        cursor.close()
        return service
    except MySQLError as err:
        logger.error(f"Error creating service: {err}")
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        conn.close()

@api_router.post("/contact-submission")
async def submit_contact_form(input: ContactSubmissionCreate):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = conn.cursor()
        query = """INSERT INTO contact_submissions (name, email, phone, service_category, business_name, description, website, submitted_at)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        values = (
            input.name, input.email, input.phone, input.service_category,
            input.business_name, input.description, input.website,
            datetime.now(timezone.utc)
        )
        cursor.execute(query, values)
        conn.commit()
        submission_id = cursor.lastrowid
        cursor.close()
        
        # Send email if Resend is configured
        if RESEND_API_KEY:
            try:
                html_content = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #FFCC00;">
                            <h2 style="color: #0A0A0A; border-bottom: 3px solid #FFCC00; padding-bottom: 10px;">
                                Nueva solicitud - AmarilloNegro.com
                            </h2>
                            <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
                                <h3 style="color: #FFCC00; margin-top: 0;">Datos de contacto:</h3>
                                <p><strong>Nombre:</strong> {input.name}</p>
                                <p><strong>Email:</strong> {input.email}</p>
                                <p><strong>Teléfono:</strong> {input.phone}</p>
                            </div>
                            <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
                                <h3 style="color: #FFCC00; margin-top: 0;">Información del servicio:</h3>
                                <p><strong>Negocio:</strong> {input.business_name}</p>
                                <p><strong>Categoría:</strong> {input.service_category}</p>
                                <p><strong>Descripción:</strong> {input.description}</p>
                                {f'<p><strong>Web:</strong> {input.website}</p>' if input.website else ''}
                            </div>
                        </div>
                    </body>
                </html>
                """
                
                params = {
                    "from": SENDER_EMAIL,
                    "to": ["info@taxis.cat"],
                    "subject": f"Nueva solicitud: {input.business_name}",
                    "html": html_content
                }
                
                await asyncio.to_thread(resend.Emails.send, params)
                logger.info(f"Email sent for submission {submission_id}")
                return {"status": "success", "message": "Solicitud enviada correctamente", "id": submission_id, "email_sent": True}
            except Exception as e:
                logger.error(f"Email error: {str(e)}")
                return {"status": "success", "message": "Solicitud guardada", "id": submission_id, "email_sent": False}
        
        return {"status": "success", "message": "Solicitud guardada correctamente", "id": submission_id}
    except MySQLError as err:
        logger.error(f"Error saving contact submission: {err}")
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        conn.close()

@api_router.post("/newsletter-subscribe")
async def subscribe_newsletter(input: NewsletterSubscriptionCreate):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = conn.cursor(dictionary=True)
        # Check if email already exists
        cursor.execute("SELECT id FROM newsletter_subscriptions WHERE email = %s", (input.email,))
        existing = cursor.fetchone()
        
        if existing:
            cursor.close()
            return {"status": "info", "message": "Este email ya está suscrito"}
        
        # Insert new subscription
        cursor.execute(
            "INSERT INTO newsletter_subscriptions (name, email, phone, subscribed_at) VALUES (%s, %s, %s, %s)",
            (input.name, input.email, input.phone, datetime.now(timezone.utc))
        )
        conn.commit()
        subscription_id = cursor.lastrowid
        cursor.close()
        
        logger.info(f"New newsletter subscription: {input.email}")
        return {
            "status": "success",
            "message": "¡Gracias por suscribirte! Recibirás las últimas novedades.",
            "id": subscription_id
        }
    except MySQLError as err:
        logger.error(f"Error subscribing to newsletter: {err}")
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        conn.close()

# Admin routes
@api_router.get("/admin/newsletter-subscriptions", response_model=List[NewsletterSubscription])
async def get_newsletter_subscriptions(username: str = Depends(verify_admin)):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC")
        subscriptions = cursor.fetchall()
        cursor.close()
        return subscriptions
    except MySQLError as err:
        logger.error(f"Error fetching subscriptions: {err}")
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        conn.close()

@api_router.get("/admin/contact-submissions", response_model=List[ContactSubmission])
async def get_contact_submissions(username: str = Depends(verify_admin)):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM contact_submissions ORDER BY submitted_at DESC")
        submissions = cursor.fetchall()
        cursor.close()
        return submissions
    except MySQLError as err:
        logger.error(f"Error fetching contact submissions: {err}")
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        conn.close()

@api_router.delete("/admin/contact-submissions/{submission_id}")
async def delete_contact_submission(submission_id: int, username: str = Depends(verify_admin)):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM contact_submissions WHERE id = %s", (submission_id,))
        conn.commit()
        affected_rows = cursor.rowcount
        cursor.close()
        
        if affected_rows == 0:
            raise HTTPException(status_code=404, detail="Solicitud no encontrada")
        
        logger.info(f"Deleted contact submission {submission_id}")
        return {"status": "success", "message": "Solicitud eliminada correctamente"}
    except MySQLError as err:
        logger.error(f"Error deleting submission: {err}")
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        conn.close()

@api_router.post("/admin/verify")
async def verify_admin_password(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify admin password for frontend login"""
    verify_admin(credentials)
    return {"status": "success", "message": "Autenticación correcta"}


# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Application starting...")
    # Try to initialize database
    if init_database():
        logger.info("Database initialized successfully")
    else:
        logger.warning("Database initialization failed - will retry on first request")
    logger.info("Application started")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutdown")
