from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
import logging
import asyncio
import secrets
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, timezone
from bson import ObjectId
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'amarillonegro_db')

try:
    mongo_client = MongoClient(MONGO_URL)
    db = mongo_client[DB_NAME]
    logging.info("MongoDB connection established successfully")
except Exception as e:
    logging.error(f"Error connecting to MongoDB: {e}")
    db = None

# Resend configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Admin credentials
ADMIN_PASSWORD = "Amarillonegro1?"

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


# Helper function to serialize MongoDB documents
def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    doc['id'] = str(doc.pop('_id'))
    return doc


# Pydantic Models
class Service(BaseModel):
    id: Optional[str] = None
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
    id: Optional[str] = None
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
    id: Optional[str] = None
    name: str
    email: str
    phone: Optional[str] = None
    subscribed_at: Optional[datetime] = None

class NewsletterSubscriptionCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str


# Routes
@api_router.get("/")
async def root():
    return {"message": "AmarilloNegro.com - Portal Taxi Barcelona API"}

@api_router.get("/services", response_model=List[Service])
async def get_all_services():
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        services = list(db.services.find().sort("created_at", -1))
        return [serialize_doc(s) for s in services]
    except Exception as e:
        logger.error(f"Error fetching services: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/services/{category}", response_model=List[Service])
async def get_services_by_category(category: str):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        services = list(db.services.find({"category": category}).sort("created_at", -1))
        return [serialize_doc(s) for s in services]
    except Exception as e:
        logger.error(f"Error fetching services by category: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/services", response_model=Service)
async def create_service(input: ServiceCreate):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        service_data = {
            "category": input.category,
            "name": input.name,
            "description": input.description,
            "contact_name": input.contact_name,
            "email": input.email,
            "phone": input.phone,
            "website": input.website,
            "address": input.address,
            "image_url": input.image_url,
            "created_at": datetime.now(timezone.utc)
        }
        result = db.services.insert_one(service_data)
        service_data['id'] = str(result.inserted_id)
        return service_data
    except Exception as e:
        logger.error(f"Error creating service: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/contact-submission")
async def submit_contact_form(input: ContactSubmissionCreate):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        submission_data = {
            "name": input.name,
            "email": input.email,
            "phone": input.phone,
            "service_category": input.service_category,
            "business_name": input.business_name,
            "description": input.description,
            "website": input.website,
            "submitted_at": datetime.now(timezone.utc)
        }
        result = db.contact_submissions.insert_one(submission_data)
        submission_id = str(result.inserted_id)
        
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
    except Exception as e:
        logger.error(f"Error saving contact submission: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/newsletter-subscribe")
async def subscribe_newsletter(input: NewsletterSubscriptionCreate):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        # Check if email already exists
        existing = db.newsletter_subscriptions.find_one({"email": input.email})
        
        if existing:
            return {"status": "info", "message": "Este email ya está suscrito"}
        
        # Insert new subscription
        subscription_data = {
            "name": input.name,
            "email": input.email,
            "phone": input.phone,
            "subscribed_at": datetime.now(timezone.utc)
        }
        result = db.newsletter_subscriptions.insert_one(subscription_data)
        subscription_id = str(result.inserted_id)
        
        logger.info(f"New newsletter subscription: {input.email}")
        return {
            "status": "success",
            "message": "¡Gracias por suscribirte! Recibirás las últimas novedades.",
            "id": subscription_id
        }
    except Exception as e:
        logger.error(f"Error subscribing to newsletter: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Admin routes
@api_router.get("/admin/newsletter-subscriptions", response_model=List[NewsletterSubscription])
async def get_newsletter_subscriptions(username: str = Depends(verify_admin)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        subscriptions = list(db.newsletter_subscriptions.find().sort("subscribed_at", -1))
        return [serialize_doc(s) for s in subscriptions]
    except Exception as e:
        logger.error(f"Error fetching subscriptions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/contact-submissions", response_model=List[ContactSubmission])
async def get_contact_submissions(username: str = Depends(verify_admin)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        submissions = list(db.contact_submissions.find().sort("submitted_at", -1))
        return [serialize_doc(s) for s in submissions]
    except Exception as e:
        logger.error(f"Error fetching contact submissions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/admin/contact-submissions/{submission_id}")
async def delete_contact_submission(submission_id: str, username: str = Depends(verify_admin)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        result = db.contact_submissions.delete_one({"_id": ObjectId(submission_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Solicitud no encontrada")
        
        logger.info(f"Deleted contact submission {submission_id}")
        return {"status": "success", "message": "Solicitud eliminada correctamente"}
    except Exception as e:
        logger.error(f"Error deleting submission: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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
    logger.info("Application started")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutdown")
