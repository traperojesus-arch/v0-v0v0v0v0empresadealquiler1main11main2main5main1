# Sistema de Gestión de Alquiler

Aplicación completa para gestionar un negocio de alquiler de equipos y artículos.

## 🚀 Inicio Rápido

### 1. Configurar Base de Datos

Ejecuta los scripts SQL en orden desde la carpeta `scripts/`:

1. **00-setup-database.sql** - Crea todas las tablas y configuración inicial
2. **02-seed-data.sql** - Datos de ejemplo (opcional)

Para ejecutar los scripts:
- Ve a tu proyecto de Supabase
- Abre el SQL Editor
- Copia y pega el contenido de cada script
- Ejecuta en orden

### 2. Variables de Entorno

Las siguientes variables ya están configuradas en tu proyecto:

\`\`\`
SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL
SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY
SUPABASE_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_USE_SUPABASE_TABLES=true
\`\`\`

### 3. Crear Usuario Administrador

Después de ejecutar los scripts de base de datos, crea un usuario admin:

**Opción A: Desde Supabase Dashboard**
1. Ve a Authentication > Users
2. Crea un nuevo usuario con email y contraseña
3. Ejecuta este SQL para darle rol de admin:

\`\`\`sql
UPDATE profiles 
SET role = 'admin', full_name = 'Administrador'
WHERE id = (SELECT id FROM auth.users WHERE email = 'tu-email@ejemplo.com');
\`\`\`

**Opción B: Usar el script de creación**
Ejecuta el script `scripts/create-admin-user.mjs` (requiere configurar las variables de entorno localmente)

### 4. Iniciar la Aplicación

\`\`\`bash
npm install
npm run dev
\`\`\`

## 📋 Características

- **Dashboard**: Vista general de estadísticas y actividad
- **Gestión de Artículos**: Catálogo completo con inventario
- **Pedidos**: Sistema de reservas y seguimiento
- **Clientes**: Base de datos de clientes
- **Proveedores**: Gestión de proveedores
- **Facturación**: Sistema de facturación integrado
- **Informes**: Análisis y reportes del negocio

## 🔐 Roles de Usuario

- **admin**: Acceso completo a todas las funciones
- **premium**: Acceso a facturación e informes avanzados
- **standard**: Acceso básico al sistema

## 🛠️ Tecnologías

- **Next.js 15** - Framework React
- **Supabase** - Base de datos y autenticación
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **TypeScript** - Tipado estático

## 📝 Estructura del Proyecto

\`\`\`
├── app/                    # Páginas y rutas de Next.js
│   ├── actions/           # Server actions
│   ├── articulos/         # Gestión de artículos
│   ├── clientes/          # Gestión de clientes
│   ├── pedidos/           # Gestión de pedidos
│   └── ...
├── components/            # Componentes React
├── lib/                   # Utilidades y configuración
│   └── supabase/         # Cliente de Supabase
├── scripts/              # Scripts SQL de base de datos
└── public/               # Archivos estáticos
\`\`\`

## 🐛 Solución de Problemas

### Error: "relation does not exist"
- Asegúrate de haber ejecutado todos los scripts SQL en orden
- Verifica que `NEXT_PUBLIC_USE_SUPABASE_TABLES=true` esté configurado

### No puedo iniciar sesión
- Verifica que hayas creado un usuario en Supabase Auth
- Asegúrate de que el usuario tenga un perfil en la tabla `profiles`

### Las imágenes no se cargan
- Crea un bucket llamado "imagenes" en Supabase Storage
- Configura el bucket como público

## 📄 Licencia

Este proyecto es privado y confidencial.
