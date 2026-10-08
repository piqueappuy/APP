# Conexión del login de PIQUE

Proyecto: ymeebtslnjseouenizdt. La configuración del navegador contiene únicamente la clave publicable.

## Configuración necesaria en Supabase

En Authentication → URL Configuration:

- Site URL: http://127.0.0.1:8765
- Redirect URLs: http://127.0.0.1:8765/auth-callback.html

Guardar. Mantener activada la confirmación de correo.

Para producción, sustituir las direcciones locales por las de la aplicación publicada con HTTPS. Un enlace local solo funciona en la computadora donde corre PIQUE, no en otro celular.

El servicio de correo predeterminado de Supabase tiene restricciones de destinatarios y frecuencia. Configurar un proveedor SMTP propio antes de abrir el registro al público.

## Probar

1. Abrir http://127.0.0.1:8765/#registro.
2. Crear una cuenta propia y abrir el correo de confirmación en esta computadora.
3. Confirmar que MI PERFIL muestra la sesión.
4. Cerrar sesión e ingresar nuevamente.
5. Probar OLVIDÉ MI CONTRASEÑA y abrir el enlace en esta computadora.

No se crearon usuarios ni enviaron correos automáticamente durante la implementación.

## Alcance

El registro, login, cierre de sesión y recuperación usan Supabase Auth.
Los perfiles profesionales y piques siguen en la demostración local del navegador; no están sincronizados ni vinculados todavía a cuentas. No usar esta versión como plataforma pública.
Antes de conectar tablas de datos: crear esquema, habilitar RLS y políticas de propietario, y probar aislamiento entre usuarios.

La biblioteca oficial supabase-js está incluida localmente y fijada a la versión indicada en preview/vendor/README.txt.
