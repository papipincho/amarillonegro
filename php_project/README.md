# AmarilloNegro.com - Portal Taxi Barcelona

Portal de servicios profesionales para taxistas en Barcelona.

## Requisitos

- PHP 7.4 o superior
- MySQL 5.7 o superior
- Apache con mod_rewrite habilitado

## Instalación

### 1. Subir archivos

Sube todos los archivos de este directorio a tu hosting mediante FTP o el gestor de archivos de tu panel de control.

### 2. Configurar la base de datos

1. Crea una base de datos MySQL en tu hosting (ej: `amarillonegro_db`)

2. Ejecuta el siguiente SQL en phpMyAdmin o tu cliente MySQL:

```sql
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Configurar conexión

Edita el archivo `includes/config.php` con los datos de tu hosting:

```php
define('DB_HOST', 'localhost');        // Servidor MySQL
define('DB_PORT', '3306');             // Puerto (normalmente 3306)
define('DB_NAME', 'tu_base_de_datos'); // Nombre de la BD
define('DB_USER', 'tu_usuario');       // Usuario MySQL
define('DB_PASS', 'tu_contraseña');    // Contraseña MySQL
```

### 4. Configurar URL del sitio

En `includes/config.php`, cambia la URL del sitio:

```php
define('SITE_URL', 'https://amarillonegro.com');
```

## Estructura de archivos

```
/
├── index.php              # Página principal
├── servicios.php          # Listado de categorías
├── categoria.php          # Listado de empresas por categoría
├── publicar.php           # Formulario de publicación
├── noticias.php           # Listado de noticias
├── .htaccess              # Configuración Apache
│
├── admin/
│   └── index.php          # Panel de administración
│
├── api/
│   ├── newsletter.php     # API de newsletter
│   └── contact.php        # API de contacto
│
├── includes/
│   ├── config.php         # Configuración (¡EDITAR!)
│   ├── header.php         # Cabecera común
│   └── footer.php         # Pie de página común
│
├── css/
│   └── styles.css         # Estilos
│
├── js/
│   └── main.js            # JavaScript
│
├── fichas/                # Páginas de empresas (HTML estático)
│   └── *.html
│
└── noticias/              # Páginas de noticias (HTML estático)
    └── *.html
```

## Panel de Administración

- **URL:** https://tudominio.com/admin/
- **Contraseña por defecto:** `Amarillonegro1?`

Para cambiar la contraseña, edita `includes/config.php`:
```php
define('ADMIN_PASSWORD', 'tu_nueva_contraseña');
```

## Añadir empresas

Las empresas se muestran como páginas HTML estáticas en la carpeta `/fichas/`.

Para añadir una nueva empresa:
1. Crea un archivo HTML en `/fichas/` (ej: `talleres_7.html`)
2. Usa como plantilla cualquiera de los archivos existentes
3. Actualiza el enlace en `categoria.php` si es necesario

## Soporte

Para cualquier duda, contacta en info@taxis.cat
