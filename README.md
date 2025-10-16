# Emergencia Pablo - Webapp de Mensajes

Una aplicación web simple que permite a los usuarios enviar mensajes de emergencia a través de un servidor ntfy.

## Características

- Formulario simple con campos "Tu nombre" y "Mensaje"
- Envío automático a servidor ntfy con autenticación
- Interfaz minimalista y responsive
- Confirmación de envío al usuario

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
export NTFY_URL="https://tu-servidor-ntfy.com"
export NTFY_USER="tu-usuario"
export NTFY_PASSWORD="tu-password"
export PORT=3000  # opcional, por defecto 3000
```

3. Ejecutar la aplicación:
```bash
npm start
```

## Variables de Entorno

- `NTFY_URL`: URL de tu servidor ntfy (requerido)
- `NTFY_USER`: Usuario para autenticación en ntfy (requerido)
- `NTFY_PASSWORD`: Contraseña para autenticación en ntfy (requerido)
- `PORT`: Puerto donde correr la aplicación (opcional, por defecto 3000)

## Uso

1. Abre tu navegador en `http://localhost:3000` (o el puerto configurado)
2. Completa el formulario con tu nombre y mensaje
3. Haz clic en "Enviar Mensaje"
4. Recibirás confirmación si el mensaje se envió correctamente

## Despliegue

### Opción 1: Docker (Recomendado)

1. Crea un archivo `.env` con tus credenciales:
```bash
NTFY_URL=https://tu-servidor-ntfy.com
NTFY_USER=tu-usuario
NTFY_PASSWORD=tu-password
```

2. Ejecuta con Docker Compose:
```bash
docker-compose up -d
```

La aplicación estará disponible en `http://localhost:3000`

### Opción 2: Instalación directa

Para desplegar en un servidor Linux:

1. Sube los archivos al servidor
2. Instala Node.js (versión 14 o superior)
3. Configura las variables de entorno
4. Ejecuta `npm install` para instalar dependencias
5. Ejecuta `npm start` para iniciar la aplicación

### Ejemplo con systemd (opcional)

Crear archivo `/etc/systemd/system/emergenciapablo.service`:

```ini
[Unit]
Description=Emergencia Pablo Webapp
After=network.target

[Service]
Type=simple
User=tu-usuario
WorkingDirectory=/ruta/a/emergenciapablo
Environment=NTFY_URL=https://tu-servidor-ntfy.com
Environment=NTFY_USER=tu-usuario
Environment=NTFY_PASSWORD=tu-password
Environment=PORT=3000
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Luego:
```bash
sudo systemctl daemon-reload
sudo systemctl enable emergenciapablo
sudo systemctl start emergenciapablo
```

## Estructura del Proyecto

```
emergenciapablo/
├── server.js          # Servidor Express principal
├── package.json       # Dependencias y scripts
├── Dockerfile         # Configuración de Docker
├── docker-compose.yml # Orquestación con Docker Compose
├── public/
│   ├── index.html     # Página principal
│   └── style.css      # Estilos CSS
└── README.md          # Este archivo
```

## Notas

- Los mensajes se envían al topic "Emergencia" en tu servidor ntfy
- El formato del mensaje es: "Nombre: Mensaje"
- La aplicación valida que ambos campos estén completos antes de enviar
