# Ficha de Producto - RUTA

---

![Logo RUTA](assets/images/5eafd586-5369-46d4-8355-a213a11cba4e.png)

**Desarrollado por CRIAS Solutions**  
[crias.solutions](https://crias.solutions)

---

## Descripción General

**RUTA** es una aplicación móvil de ciencia ciudadana diseñada para recopilar datos de sensores de dispositivos móviles con el objetivo de analizar y mejorar la calidad de las carreteras.

Al utilizar los sensores integrados en smartphones y tablets (acelerómetro, giroscopio, magnetómetro y GPS), la aplicación captura información precisa sobre el movimiento vehicular y las condiciones del pavimento, transformando dispositivos cotidianos en herramientas de investigación vial.

---

## El Problema

Las autoridades y organizaciones de transporte enfrentan desafíos significativos para:

| Problema | Impacto |
|----------|---------|
| **Falta de datos granulares** | Decisiones basadas en información limitada o desactualizada |
| **Costos elevados de monitoreo** | Equipos especializados son caros y requieren personal capacitado |
| **Baches y deterioro no detectados** | Retrasos en la reparación que generan riesgos y costos mayores |
| **Infraestructura vial deficiente** | Afecta la seguridad, el consumo de combustible y el desgaste vehicular |

---

## Nuestra Solución

**RUTA** democratiza la recolección de datos viales al convertir el smartphone de cualquier usuario en un sensor de movimiento de alta precisión.

Los ciudadanos pueden contribuir activamente a mejorar sus comunidades simplemente conduciendo mientras la aplicación registra datos en segundo plano. Estos datos, luego de ser procesados, proporcionan información valiosa sobre:

- Condiciones superficiales del pavimento
- Ubicación geoespacial de baches y irregularidades
- Patrones de tráfico y comportamiento vehicular
- Zonas de alto deterioro que requieren intervención prioritaria

---

## Características Principales

### Sensores Integrados

| Sensor | Función | Frecuencia de Muestreo |
|--------|---------|------------------------|
| **Acelerómetro** | Detecta impactos y vibraciones del vehículo | 10 Hz |
| **Giroscopio** | Mide rotación y orientación del dispositivo | 10 Hz |
| **Magnetómetro** | Brújula digital y orientación espacial | 10 Hz |
| **GPS** | Posicionamiento geográfico preciso | Variable según red |

### Funcionalidades Clave

- **Grabación en segundo plano**: Recopilación de datos mientras el usuario conduce normalmente
- **Modo de ahorro de batería**: Optimización del consumo energético
- **Sin conexión requerida**: Los datos se almacenan localmente y se sincronizan cuando hay conectividad
- **Soporte multiidioma**: Disponible en múltiples idiomas para usuarios internacionales
- **Gestión de vehículos**: Registro y selección de diferentes tipos de vehículos
- **Subida a la nube**: Sincronización automática con Supabase para análisis posterior

### Privacidad y Consentimiento

- Aceptación clara de términos de uso antes de comenzar
- Ningún dato personal identificable es recopilado sin consentimiento
- Datos abiertos disponibles para la comunidad científica
- Cumplimiento con regulaciones de privacidad

---

## Flujo de Usuario

```
┌─────────────────┐
│   Pantalla de   │
│    Bienvenida   │
│  (Términos y    │
│   Condiciones)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Selección de   │
│    Vehículo     │
│                 │
│  🚗 🚌 🚕 🚚   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Pantalla de   │
│     Grabación    │
│                 │
│   [GRABANDO]    │
│   ●  ●  ●       │
│                 │
│  ┌───────────┐  │
│  │ Detener   │  │
│  └───────────┘  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Subida de     │
│     Datos       │
│                 │
│  [Subir a la   │
│    nube]        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Feedback     │
│   (Opcional)    │
└─────────────────┘
```

---

## Especificaciones Técnicas

### Plataformas Soportadas

| Plataforma | Estado | Notas |
|------------|--------|-------|
| **Android** | ✅ Disponible | Requier permissions de ubicación y sensores |
| **iOS** | ✅ Disponible | Requiere permisos de ubicación y sensores |
| **Web** | ✅ Disponible | Emulación de sensores para pruebas |

### Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Expo SDK | 54 | Framework de desarrollo |
| React Native | 0.81 | Interfaz de usuario nativa |
| TypeScript | 5.x | Tipado estático |
| Expo Sensors | 15.0.8 | Acceso a sensores del dispositivo |
| Expo Location | 19.0.8 | GPS y geolocalización |
| Expo Task Manager | 14.0.1 | Tareas en segundo plano |
| Supabase | - | Backend y base de datos |

### Almacenamiento de Datos

- **Formato de exportación**: CSV (valores separados por comas)
- **Archivos generados**: `sensor.csv` y `gps.csv`
- **Metadatos**: Identificador del viaje, vehículo, plataforma, timestamps

---

## Identidad Visual

### Paleta de Colores

| Color | Hexadecimal | Uso |
|-------|-------------|-----|
| **Primario** | `#4A5A7A` | Botones, elementos principales |
| **Secundario** | `#5E60CE` | Acentos, acciones secundarias |
| **Acento** | `#64B5F6` | Destacados, indicadores activos |
| **Fondo** | `#1A1A2E` | Fondo principal de la app |
| **Fondo Alternativo** | `#16213E` | Tarjetas y contenedores |
| **Texto** | `#FFFFFF` | Texto principal |

### Tipografía

| Estilo | Fuente | Peso |
|--------|--------|------|
| Títulos | Inter | 700 (Bold) |
| Subtítulos | Inter | 600 (SemiBold) |
| Cuerpo de texto | Inter | 400 (Regular) |

### Logos

| Recurso | Archivo |
|---------|---------|
| Logo RUTA (chico) | `eb0dc417-c307-4234-bba7-5445f45f296b.png` |
| Logo RUTA (mediano) | `bece3d82-8669-4205-a2de-f8e04ec1b98a.png` |
| Logo RUTA (grande) | `5eafd586-5369-46d4-8355-a213a11cba4e.png` |
| Logo RUTA (extra grande) | `4c90ad4b-09ad-4245-94d0-56b1fc84080e.png` |
| Logo CRIAS | `9f64f69f-0483-49b4-9307-b50b0fa3edac.png` |

---

## Datos Abiertos

Los datos recopilados por **RUTA** están disponibles como **Datos Abiertos** para:

- Investigadores académicos
- Organizaciones no gubernamentales
- Entidades gubernamentales
- Desarrolladores y emprendedores
- Comunidad en general

Esta apertura promueve la transparencia, la innovación y la colaboración en el mejora de la infraestructura vial.

---

## Próximos Pasos

| Funcionalidad | Prioridad | Estado |
|---------------|-----------|--------|
| Dashboard web para visualización | Alta | En desarrollo |
| Análisis automático de baches | Alta | Planificado |
| Integración con mapas interactivos | Media | Planificado |
| Reportes personalizados por zona | Media | Planificado |
| API pública para desarrolladores | Baja | En consideración |

---

## Contacto

**CRIAS Solutions**  
[crias.solutions](https://crias.solutions)  
[info@crias.solutions](mailto:info@crias.solutions)

---

*Este documento fue generado para fines de presentación y comunicación del proyecto RUTA.*
