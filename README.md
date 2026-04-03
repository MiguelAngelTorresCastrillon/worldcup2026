# World Cup 2026 Predictor - Guía de Instalación

## Requisitos Previos

Antes de comenzar, asegurate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (v9 o superior) - viene con Node.js
- **Git** - [Descargar](https://git-scm.com/)

## Pasos de Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/MiguelAngelTorresCastrillon/worldcup2026.git
cd worldcup2026
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

### 4. Configurar variables de entorno

#### Backend

En la carpeta `backend/`, creá un archivo `.env` con el siguiente contenido:

```env
# Servidor
PORT=3000

# Supabase (base de datos)
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_anon_key

# JWT (generá una clave segura, mínimo 32 caracteres)
JWT_SECRET=tu_clave_jwt_muy_segura_aqui

# Correo electrónico (para forgot password)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicación
```

**Para obtener las credenciales de Supabase:**
1. Ir a [supabase.com](https://supabase.com)
2. Crear un proyecto o usar uno existente
3. Ir a Settings → API
4. Copiar "Project URL" y "anon public key"

**Para el email (Gmail):**
1. Activar autenticación de 2 factores en tu cuenta Google
2. Ir a Google Account → Security → App passwords
3. Generar una contraseña de aplicación de 16 caracteres
4. Usar esa contraseña en `EMAIL_PASS`

#### Frontend

En la carpeta `frontend/`, creá un archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Configurar la base de datos

El proyecto incluye migraciones SQL. Para ejecutarlas:

1. Ir al dashboard de Supabase
2. Ir a SQL Editor
3. Copiar el contenido de `backend/src/migrations/010_init_schema.sql`
4. Ejecutar el SQL

### 6. Ejecutar el proyecto

#### Terminal 1 - Backend (en carpeta `backend/`):

```bash
npm run dev
```

Deberías ver:
```
Server running on port 3000
Database connected
```

#### Terminal 2 - Frontend (en carpeta `frontend/`):

```bash
npm run dev
```

Deberías ver algo como:
```
VITE v5.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

### 7. Acceder a la aplicación

Abrir en el navegador: **http://localhost:5173**

## Credenciales de Prueba

### Para crear un usuario administrador:

1. Registrate normalmente en la app
2. En Supabase, ir a la tabla `users`
3. Cambiar el campo `role` de tu usuario a `ADMIN`

### Para iniciar sesión como admin:

- Email: el que registraste
- Password: el que pusiste
- Serás redirigido automáticamente al panel de admin

## Estructura del Proyecto

```
worldcup2026/
├── backend/
│   ├── src/
│   │   ├── app.js          # Servidor Express
│   │   ├── config/         # Configuración BD
│   │   ├── controllers/   # Lógica de rutas
│   │   ├── repositories/  # Consultas a BD
│   │   ├── services/      # Lógica de negocio
│   │   ├── routes/        # Definición de rutas
│   │   ├── middlewares/   # Auth, rate limiting
│   │   ├── migrations/    # SQL de BD
│   │   └── utils/         # Utilidades
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── context/       # Auth context
│   │   ├── routes/        # Router
│   │   └── services/      # Llamadas API
│   ├── index.html
│   └── package.json
└── README.md
```

## Solución de Problemas

### "Cannot find module" al iniciar
```bash
# Reinstalar dependencias
cd backend && npm install
cd ../frontend && npm install
```

### Error de conexión a Supabase
- Verificar que las variables `SUPABASE_URL` y `SUPABASE_KEY` sean correctas
- Asegurarse de tener internet

### Error de JWT
- Verificar que `JWT_SECRET` tenga al menos 32 caracteres
- Regenerar el token si se cambia la clave

### El frontend no se conecta al backend
- Verificar que el backend esté corriendo en puerto 3000
- Revisar que `VITE_API_URL` en frontend/.env sea correcto

### Errores de CORS
El backend ya tiene CORS configurado para el frontend en puerto 5173. Si hay problemas, revisar `backend/src/app.js`.

## Comandos Útiles

```bash
# Backend
cd backend
npm start        # Producción
npm run dev      # Desarrollo (con nodemon)

# Frontend  
cd frontend
npm run dev      # Desarrollo
npm run build    # Producción
```

## Soporte

Si tenés problemas, revisá:
1. La consola del navegador (F12 → Console)
2. Los logs del backend en la terminal
3. La documentación de [Supabase](https://supabase.com/docs)