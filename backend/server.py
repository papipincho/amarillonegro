from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Define Models
class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    name: str
    description: str
    contact_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    service_category: str
    business_name: str
    description: str
    website: Optional[str] = None
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service_category: str
    business_name: str
    description: str
    website: Optional[str] = None

class NewsletterSubscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsletterSubscriptionCreate(BaseModel):
    name: str
    email: EmailStr


# Routes
@api_router.get("/")
async def root():
    return {"message": "Portal Taxi Barcelona API"}

@api_router.get("/services", response_model=List[Service])
async def get_all_services():
    services = await db.services.find({}, {"_id": 0}).to_list(1000)
    for service in services:
        if isinstance(service.get('created_at'), str):
            service['created_at'] = datetime.fromisoformat(service['created_at'])
    return services

@api_router.get("/services/{category}", response_model=List[Service])
async def get_services_by_category(category: str):
    services = await db.services.find({"category": category}, {"_id": 0}).to_list(1000)
    for service in services:
        if isinstance(service.get('created_at'), str):
            service['created_at'] = datetime.fromisoformat(service['created_at'])
    return services

@api_router.post("/services", response_model=Service)
async def create_service(input: ServiceCreate):
    service_dict = input.model_dump()
    service_obj = Service(**service_dict)
    
    doc = service_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.services.insert_one(doc)
    return service_obj

@api_router.post("/contact-submission")
async def submit_contact_form(input: ContactSubmissionCreate):
    # Create submission object
    submission_dict = input.model_dump()
    submission_obj = ContactSubmission(**submission_dict)
    
    # Save to database
    doc = submission_obj.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    await db.contact_submissions.insert_one(doc)
    
    # Send email if Resend is configured
    if RESEND_API_KEY:
        try:
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #FFCC00;">
                        <h2 style="color: #0A0A0A; border-bottom: 3px solid #FFCC00; padding-bottom: 10px;">
                            Nueva solicitud de publicación - Portal Taxi Barcelona
                        </h2>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
                            <h3 style="color: #FFCC00; margin-top: 0;">Datos de contacto:</h3>
                            <p><strong>Nombre:</strong> {input.name}</p>
                            <p><strong>Email:</strong> {input.email}</p>
                            <p><strong>Teléfono:</strong> {input.phone}</p>
                        </div>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
                            <h3 style="color: #FFCC00; margin-top: 0;">Información del servicio:</h3>
                            <p><strong>Nombre del negocio:</strong> {input.business_name}</p>
                            <p><strong>Categoría:</strong> {input.service_category}</p>
                            <p><strong>Descripción:</strong> {input.description}</p>
                            {f'<p><strong>Sitio web:</strong> {input.website}</p>' if input.website else ''}
                        </div>
                        
                        <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
                            Este correo fue enviado automáticamente desde el formulario de publicación del Portal Taxi Barcelona.
                        </p>
                    </div>
                </body>
            </html>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": ["info@taxis.cat"],
                "subject": f"Nueva solicitud: {input.business_name} - {input.service_category}",
                "html": html_content
            }
            
            email_result = await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Email sent successfully: {email_result.get('id')}")
            
            return {
                "status": "success",
                "message": "Tu solicitud ha sido enviada correctamente. Te contactaremos pronto.",
                "submission_id": submission_obj.id,
                "email_sent": True
            }
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return {
                "status": "partial_success",
                "message": "Tu solicitud ha sido guardada, pero hubo un problema al enviar el email.",
                "submission_id": submission_obj.id,
                "email_sent": False,
                "error": str(e)
            }
    else:
        logger.warning("Resend API key not configured")
        return {
            "status": "success",
            "message": "Tu solicitud ha sido guardada correctamente.",
            "submission_id": submission_obj.id,
            "email_sent": False,
            "note": "Email not configured"
        }

@api_router.post("/newsletter-subscribe")
async def subscribe_newsletter(input: NewsletterSubscriptionCreate):
    # Check if email already exists
    existing = await db.newsletter_subscriptions.find_one({"email": input.email}, {"_id": 0})
    if existing:
        return {
            "status": "info",
            "message": "Este email ya está suscrito a nuestras novedades."
        }
    
    # Create subscription object
    subscription_dict = input.model_dump()
    subscription_obj = NewsletterSubscription(**subscription_dict)
    
    # Save to database
    doc = subscription_obj.model_dump()
    doc['subscribed_at'] = doc['subscribed_at'].isoformat()
    await db.newsletter_subscriptions.insert_one(doc)
    
    logger.info(f"New newsletter subscription: {input.email}")
    
    return {
        "status": "success",
        "message": "¡Gracias por suscribirte! Recibirás las últimas novedades del sector.",
        "subscription_id": subscription_obj.id
    }

@api_router.get("/newsletter-subscriptions")
async def get_newsletter_subscriptions():
    subscriptions = await db.newsletter_subscriptions.find({}, {"_id": 0}).to_list(1000)
    for sub in subscriptions:
        if isinstance(sub.get('subscribed_at'), str):
            sub['subscribed_at'] = datetime.fromisoformat(sub['subscribed_at'])
    return subscriptions


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
