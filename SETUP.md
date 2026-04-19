# Bot One Piece Shop - Guía de Configuración

## Pasos para Poner en Funcionamiento

### 1. Obtener el Token del Bot

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Inicia sesión con tu cuenta de Discord
3. Haz clic en "New Application" y dale un nombre
4. Ve a la sección "Bot" en el menú izquierdo
5. Haz clic en "Add Bot"
6. Bajo "TOKEN", haz clic en "Copy"
7. Pega el token en el archivo `.env`:

```env
DISCORD_TOKEN=tu_token_aqui
PREFIX=!
```

### 2. Configurar Permisos del Bot

En Developer Portal:
1. Ve a "OAuth2" → "URL Generator"
2. En "SCOPES", selecciona:
   - `bot`
3. En "PERMISSIONS", selecciona:
   - `Send Messages`
   - `Read Messages/View Channels`
   - `Read Message History`
   - `Embed Links` (opcional, para mejor visualización)
4. Copia la URL generada y abre en tu navegador
5. Selecciona el servidor donde quieres agregar el bot

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar el Bot

```bash
npm start
```

Deberías ver en la consola:
```
✅ Bot conectado como BotName#0000
📋 6 comandos disponibles
```

### 5. Probar los Comandos

En tu servidor de Discord:
```
!ayuda
!creartienda prueba
!tienda
```

## Solución de Problemas

**Error: "DISCORD_TOKEN is not defined"**
- Asegúrate de que el token esté en el archivo `.env`
- Reinicia el bot

**El bot no responde a comandos**
- Verifica que el prefijo sea `!`
- Comprueba los permisos del bot en el servidor
- Asegúrate de que el bot tenga permiso para enviar mensajes

**Error de dependencias**
- Ejecuta `npm install` nuevamente
- Elimina `node_modules/` y `package-lock.json`, luego ejecuta `npm install`

## Características

✅ Sistema de tienda multiservidor
✅ Guardar datos en archivos JSON
✅ Comandos con prefijo configurable
✅ Embeds atractivos para Discord
✅ Gestión completa de tiendas e items

---

¡Tu bot está listo para usar! 🚀
