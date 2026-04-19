# 🏴‍☠️ Bot de Discord - One Piece Shop

Bot de Discord para gestionar una tienda en tu servidor de rol de One Piece.

## 📋 Requisitos

- Node.js 16.9.0 o superior
- Un token de bot de Discord

## 🚀 Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd one-piece-shop-bot
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar el token**
   - Abre el archivo `.env`
   - Reemplaza `your_bot_token_here` con tu token de bot de Discord

   ```env
   DISCORD_TOKEN=tu_token_aqui
   PREFIX=!
   ```

4. **Iniciar el bot**
   ```bash
   npm start
   ```

## 📖 Comandos

| Comando | Descripción |
|---------|-------------|
| `!tienda` | Ver todas las tiendas disponibles |
| `!tienda <nombre>` | Ver los items de una tienda específica |
| `!creartienda <nombre> [descripción]` | Crear una nueva tienda |
| `!eliminartienda <nombre>` | Eliminar una tienda |
| `!agregaritem <tienda> <nombre> <precio> <descripción>` | Agregar un item a una tienda |
| `!eliminaritem <tienda> <id_item>` | Eliminar un item de una tienda |
| `!ayuda` | Mostrar la lista de comandos |

## 📁 Estructura de Datos

Los datos se guardan en `data/shops.json`. Ejemplo:

```json
{
  "guildId": {
    "tiendaNombre": {
      "name": "tiendaNombre",
      "description": "Descripción de la tienda",
      "items": [
        {
          "id": "1234567890",
          "name": "Espada",
          "price": "1000",
          "description": "Una espada legendaria"
        }
      ],
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

## 🔧 Crear tu Bot de Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Haz clic en "New Application"
3. Ve a la sección "Bot" y haz clic en "Add Bot"
4. En "TOKEN", haz clic en "Copy" para copiar tu token
5. En "OAuth2" > "URL Generator", selecciona:
   - Scopes: `bot`
   - Permissions: `Send Messages`, `Read Messages/View Channels`, `Read Message History`
6. Copia la URL generada y abre en tu navegador para invitar el bot a tu servidor

## 📝 Ejemplos de Uso

```
!creartienda armas Tienda de armas legendarias
!agregaritem armas espada 1000 Una espada legendaria
!tienda armas
!eliminaritem armas 1234567890
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia ISC.

## 💡 Notas

- Los datos se guardan en archivos JSON locales (sin base de datos)
- El bot utiliza prefijo `!` por defecto (configurable en `.env`)
- Cada servidor (guild) tiene sus propias tiendas separadas

---

¡Disfruta tu bot! 🏴‍☠️
