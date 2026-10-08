# PIQUE

Primera versión navegable del recorrido de usuario que busca servicios.

## Qué podés probar

- Inicio con ocho rubros.
- Crear un pedido en tres pasos: descripción, zona/urgencia y revisión.
- Comparar tres propuestas ficticias por precio, disponibilidad o valoración.
- Ver el perfil, trabajos y opiniones de un profesional.
- Elegir un profesional de ejemplo y revisar el pedido.

## Dos carpetas, estados distintos

**`preview/`**: demo web independiente en HTML, CSS y JavaScript. Ejecutada y comprobada en el navegador. Guarda pedidos y selecciones en el almacenamiento local del navegador. Es una vista de prueba, no una compilación de Flutter.

**`flutter/`**: proyecto Dart/Flutter preparado con el mismo recorrido y pruebas de formulario y estado. **No compilado ni ejecutado todavía**: Flutter no estaba instalado y las descargas oficiales consultadas devolvieron errores HTTP 404 en esta sesión. Por eso no se afirma que las pruebas Flutter hayan pasado. Los pedidos de esta versión se mantienen en memoria, hasta cerrar o recargar la app.

Ambas versiones usan datos ficticios. No hay usuarios registrados, servidores de pedidos, pagos, mensajes ni contrataciones reales. Fotos, adjuntos y el flujo de profesional quedan para etapas posteriores. Los perfiles reutilizados por rubro son ejemplos de interfaz, no profesionales reales ni una recomendación.

## Abrir la vista web

En esta computadora: abrir `http://127.0.0.1:8765` mientras el servidor de la sesión esté activo.

Para iniciarlo otra vez, ejecutar `Abrir-PIQUE.ps1` con PowerShell. También se puede abrir `preview/index.html` directamente en un navegador, aunque el guardado local puede variar cuando se abre como archivo.

En otra computadora con Python instalado:

```powershell
python -m http.server 8765 --bind 127.0.0.1 --directory preview
```

## Ejecutar Flutter cuando el SDK esté disponible

Desde la carpeta `flutter/`:

```powershell
flutter pub get
dart format lib test
flutter analyze
flutter test
flutter run -d web-server --web-hostname 127.0.0.1 --web-port 8766
```

Para una compilación web de distribución:

```powershell
flutter build web
```

El proyecto incluye el punto de entrada web; no incluye carpetas de plataforma Android/iOS generadas. Se pueden añadir después con `flutter create --platforms=android,ios .` una vez revisado el identificador definitivo de la aplicación. Compilar iOS requiere un entorno macOS con las herramientas correspondientes.

La preparación del SDK sigue la [instalación manual oficial](https://docs.flutter.dev/install/manual).

## Verificación realizada

- JavaScript: comprobación de sintaxis con Node.
- Navegador: rechazo de pedido vacío, creación de pedido de Electricidad, revisión de barrio y urgencia, generación de propuestas, orden por menor precio, perfil, opiniones y confirmación simulada.
- Guardado: la selección persiste al recargar la vista web.
- Diseño: inspección visual de escritorio y móvil; sin desbordamiento horizontal a 390 px.
- Flutter: pruebas incluidas pero pendientes de ejecutar.

## Próximo paso

Resolver la instalación del SDK, ejecutar las pruebas y abrir la versión Flutter. Después, unificar el diseño definitivo y acordar el servicio de autenticación y base de datos.
