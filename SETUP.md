# Guía de Configuración Completa

## Paso 1: Configurar Supabase

### 1.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Guarda las credenciales (URL y anon key)

### 1.2 Ejecutar Scripts de Base de Datos

Ejecuta los siguientes scripts en el SQL Editor de Supabase **en este orden**:

#### Script 1: Configuración Inicial
\`\`\`bash
scripts/00-setup-database.sql
\`\`\`
Este script crea todas las tablas necesarias y configura Row Level Security.

#### Script 2: Datos de Ejemplo (Opcional)
\`\`\`bash
scripts/02-seed-data.sql
\`\`\`
Este script añade datos de ejemplo para probar la aplicación.

### 1.3 Configurar Storage

1. Ve a Storage en tu proyecto de Supabase
2. Crea un nuevo bucket llamado `imagenes`
3. Configúralo como público:
   - Haz clic en el bucket
   - Ve a Policies
   - Añade una política pública de lectura

## Paso 2: Variables de Entorno

Las variables ya están configuradas en tu proyecto v0. Si despliegas en otro lugar, necesitarás:

\`\`\`env
SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY=tu-anon-key
SUPABASE_SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_USE_SUPABASE_TABLES=true
\`\`\`

## Paso 3: Crear Usuario Administrador

### Método 1: Desde Supabase Dashboard (Recomendado)

1. Ve a **Authentication > Users** en tu proyecto de Supabase
2. Haz clic en **"Add user"** > **"Create new user"**
3. Ingresa:
   - Email: `admin@empresa.com`
   - Password: `admin123` (o la que prefieras)
   - Marca "Auto Confirm User"
4. Haz clic en **"Create user"**
5. Ve al **SQL Editor** y ejecuta:

\`\`\`sql
-- Actualizar el perfil del usuario para darle rol de admin
UPDATE profiles 
SET role = 'admin', full_name = 'Administrador'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@empresa.com');
\`\`\`

### Método 2: Usando Script Node.js

Si prefieres usar el script automatizado:

1. Configura las variables de entorno localmente
2. Ejecuta:
\`\`\`bash
node scripts/create-admin-user.mjs
\`\`\`

## Paso 4: Verificar Instalación

1. Inicia la aplicación:
\`\`\`bash
npm run dev
\`\`\`

2. Verifica que:
   - ✅ La aplicación carga sin errores
   - ✅ Puedes ver el dashboard
   - ✅ Los datos de ejemplo aparecen (si ejecutaste el seed)
   - ✅ Puedes crear nuevos artículos y pedidos

## Paso 5: Configuración Adicional (Opcional)

### Configurar Horarios de Operación

Ejecuta este SQL para configurar horarios:

\`\`\`sql
-- Horario de lunes a viernes: 9:00 - 18:00
INSERT INTO horarios_operacion (dia_semana, abierto, hora_inicio, hora_fin)
VALUES 
  (1, true, '09:00', '18:00'),  -- Lunes
  (2, true, '09:00', '18:00'),  -- Martes
  (3, true, '09:00', '18:00'),  -- Miércoles
  (4, true, '09:00', '18:00'),  -- Jueves
  (5, true, '09:00', '18:00'),  -- Viernes
  (6, false, NULL, NULL),        -- Sábado cerrado
  (0, false, NULL, NULL);        -- Domingo cerrado
\`\`\`

### Añadir Categorías Personalizadas

\`\`\`sql
INSERT INTO categorias (nombre, descripcion)
VALUES 
  ('Iluminación', 'Equipos de iluminación profesional'),
  ('Mobiliario', 'Mesas, sillas y mobiliario para eventos'),
  ('Audio', 'Equipos de sonido y audio'),
  ('Decoración', 'Elementos decorativos');
\`\`\`

## Solución de Problemas Comunes

### Error: "relation does not exist"
**Causa**: Las tablas no se han creado correctamente.
**Solución**: Ejecuta el script `00-setup-database.sql` nuevamente.

### Error: "Invalid API key"
**Causa**: Las variables de entorno no están configuradas.
**Solución**: Verifica que las variables de Supabase estén correctamente configuradas.

### No aparecen datos
**Causa**: No se ejecutó el script de seed o hay un problema con RLS.
**Solución**: 
1. Ejecuta `02-seed-data.sql`
2. Verifica las políticas RLS en Supabase

### No puedo subir imágenes
**Causa**: El bucket de Storage no está configurado.
**Solución**: Crea el bucket "imagenes" y configúralo como público.

## Próximos Pasos

Una vez configurado todo:

1. 📝 Personaliza los datos de ejemplo
2. 🎨 Ajusta los estilos según tu marca
3. 📧 Configura notificaciones por email (opcional)
4. 🚀 Despliega a producción

## Soporte

Si encuentras problemas:
1. Revisa los logs de la consola del navegador
2. Verifica los logs de Supabase
3. Consulta la documentación de Supabase
