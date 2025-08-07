# 🛠️ Crear y conectar una base de datos en Azure

Este documento describe cómo **crear una base de datos en Azure** y conectarse a ella desde un gestor gráfico como **MySQL Workbench** o **Azure Data Studio**.

---

## 1️⃣ Crear una base de datos en Azure

Azure ofrece servicios gestionados como **Azure Database for MySQL** o **Azure Database for PostgreSQL**. Puedes crear una nueva instancia desde el portal siguiendo estos pasos:

1. Accede al [portal de Azure](https://portal.azure.com)
2. Haz clic en **Crear un recurso**
3. Busca y selecciona uno de los siguientes servicios:
   - **Azure Database for MySQL – Flexible Server**
   - **Azure Database for PostgreSQL – Flexible Server**
4. Configura los parámetros básicos:
   - **Grupo de recursos**: selecciona uno existente o crea uno nuevo
   - **Nombre del servidor**: único en Azure
   - **Región**: donde se desplegará el servicio
   - **Nombre de administrador** y **contraseña**
   - **Versión** de MySQL o PostgreSQL
5. En la pestaña **Redes**, selecciona "Acceso público" si te vas a conectar desde fuera de Azure
6. Ajusta las opciones de tamaño y almacenamiento si es necesario (puedes empezar con la configuración mínima)
7. Haz clic en **Revisar y crear**, y luego en **Crear**

⌛ Espera unos minutos mientras se despliega el servidor de base de datos.

---

## 2️⃣ Configurar redes autorizadas

Para poder conectarte desde tu equipo o entorno local, debes permitir el acceso desde tu IP pública:

1. Accede al [portal de Azure](https://portal.azure.com)
2. Navega a tu **instancia de base de datos**
3. Ve a la pestaña **Redes** o **Conectividad de red**
4. En **Reglas de firewall**, añade las IPs autorizadas (por ejemplo: tu IP actual o la de tu red corporativa)
5. Guarda los cambios ✅

---

## 3️⃣ Obtener los datos de conexión

Desde el portal de Azure, localiza la siguiente información en la sección **Información general** o **Propiedades** de la base de datos:

- 🌐 **Hostname / Servidor**: dirección DNS del servidor (por ejemplo: `mi-servidor.mysql.database.azure.com`)
- 👤 **Usuario**: el nombre de usuario creado al configurar la base de datos (ej.: `admin@mi-servidor`)
- 🔑 **Contraseña**: la contraseña definida durante la creación
- 🔌 **Puerto**: normalmente `3306` para MySQL o `5432` para PostgreSQL

---

## 4️⃣ Conectarse desde un cliente gráfico

Puedes utilizar herramientas como:

- **MySQL Workbench** (para bases de datos MySQL)
- **Azure Data Studio** o **pgAdmin** (para bases de datos PostgreSQL)

### 🧩 Configuración en MySQL Workbench (ejemplo)

1. Abre MySQL Workbench y crea una nueva conexión.

<div align="center">
  <img width="886" height="559" alt="image" src="https://github.com/user-attachments/assets/f3f655b0-40a1-4870-8934-1a5b24799e49" alt="setup-new-connection" style="max-width: 100%;"/>
</div>

2. Rellena los siguientes campos:

```
Connection Name: AzureDB (puedes poner cualquier nombre)
Hostname: <hostname del paso anterior>
Port: 3306
Username: <usuario configurado en Azure>
Password: <haz clic en Store in Vault... para guardar la contraseña>
```

3. Haz clic en **Test Connection**. Si la configuración es correcta, recibirás un mensaje de éxito.  
4. Pulsa **OK** para guardar la conexión.

---

## ✅ Recomendaciones finales

- Asegúrate de que tu base de datos en Azure **permite conexiones SSL** o **las requiere**, y configura esto en tu gestor si es necesario.
- Si tienes errores de conexión, revisa:
  - Que tu IP esté permitida en las reglas de red
  - Que el puerto no esté bloqueado por tu firewall local
  - Que el nombre de usuario incluya el sufijo `@<nombre del servidor>` en el caso de MySQL

---

🎉 ¡Listo! Ahora puedes trabajar con tu base de datos en Azure desde tu entorno local o de desarrollo.
