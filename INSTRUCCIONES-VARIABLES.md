# Configuración de Variables de Entorno de Supabase

## Problema Identificado

Las variables de entorno de Supabase en este proyecto tienen nombres no estándar que no funcionan correctamente en el navegador.

## Variables Actuales (NO FUNCIONAN en el cliente)

- `SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY`

Estas variables NO están disponibles en el navegador porque Next.js solo expone al cliente las variables que empiezan exactamente con `NEXT_PUBLIC_`.

## Solución Requerida

Necesitas agregar las siguientes variables de entorno en tu proyecto de Vercel:

1. Ve a tu proyecto en Vercel
2. Ve a Settings → Environment Variables
3. Agrega estas dos variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
\`\`\`

Puedes obtener estos valores de:
- Tu dashboard de Supabase → Project Settings → API
- O de las variables existentes que ya tienes configuradas

## Alternativa Temporal

El código ahora intenta usar primero las variables estándar (`NEXT_PUBLIC_*`) y si no las encuentra, usa las variables con prefijo `SUPABASE_*` que solo funcionan en el servidor.

Para que la aplicación funcione completamente, especialmente en componentes del cliente como el módulo de facturas/albaranes, DEBES agregar las variables `NEXT_PUBLIC_*` correctas.
