# 🚀 Despliegue de una aplicación Streamlit en Azure App Service con Azure Pipelines

## 1️⃣ Crear una instancia de Azure App Service

Para desplegar una aplicación Streamlit, primero debes crear la **Web App** en la que se alojará. Para ello, necesitas:

- 🗂️ Un grupo de recursos  
- 📦 Un plan de App Service

Accede al **[portal de Azure](https://portal.azure.com/)**, abre el **Cloud Shell** y selecciona **Bash** (no es necesario configurar almacenamiento).

<div align="center">
  <img src="https://github.com/user-attachments/assets/cd1fcb39-80ca-40c1-80f6-b4423a540570" alt="Cloud Shell" style="max-width: 100%;" />
</div>

### 🛠️ Crear los recursos necesarios

```bash
# Variables
RESOURCE_GROUP="streamlit-on-azure"     # Nombre del grupo de recursos
LOCATION="westeurope"                   # Ubicación geográfica
APP_SVC_PLAN="streamlitplan"           # Nombre del App Service Plan
WEB_APP_NAME="streamlitonazure"        # Nombre único global de la web app

# Crear grupo de recursos
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Crear App Service Plan (Linux)
az appservice plan create \
  --name $APP_SVC_PLAN \
  --resource-group $RESOURCE_GROUP \
  --is-linux \
  --sku S1

# Crear Web App
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SVC_PLAN \
  --name $WEB_APP_NAME \
  --runtime "PYTHON|3.10"
```

---

## 2️⃣ Configurar la Web App

Para ejecutar correctamente la app, crea un archivo `startup.sh` en el mismo directorio del archivo principal `.py` de tu aplicación:

```bash
# Contenido de startup.sh
python -m streamlit run <archivo_principal>.py --server.port 8000 --server.address 0.0.0.0
```

### ⚙️ Definir el archivo de inicio

```bash
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --startup-file startup.sh
```

### 📦 Instalar dependencias desde requirements.txt

```bash
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

---

## 3️⃣ Desplegar desde Azure DevOps

Una vez creada la Web App, es momento de desplegar el código desde **Azure DevOps**, utilizando un repositorio en **Azure Repos**.

<div align="center">
  <img src="https://github.com/user-attachments/assets/38727c28-363d-43c4-829a-81092eff26ce" alt="Azure Repos" style="max-width: 100%;" />
</div>

### 🔓 Activar Pipelines en Azure DevOps

Si aún no están activados, ve a:

**Project settings** → **Overview** → **Azure DevOps services**  
y activa la opción **Pipelines**.

<div align="center">
  <img src="https://github.com/user-attachments/assets/d730df9d-7b67-4175-8911-835f04b6ed5c" alt="Activar Pipelines" style="max-width: 100%;" />
</div>

### 🧩 Crear un nuevo Pipeline

1. Ve a la pestaña **Pipelines** y haz clic en **New Pipeline**
2. Selecciona **Azure Repos Git**

<div align="center">
  <img src="https://github.com/user-attachments/assets/41cdceb8-4dfa-42b7-b39b-c05a30f41036" alt="Seleccionar repositorio" style="max-width: 100%;" />
</div>

3. Elige tu repositorio y selecciona la opción  
   **Python to Linux Web App on Azure**
4. Selecciona tu suscripción y la Web App correspondiente

<div align="center">
  <img src="https://github.com/user-attachments/assets/9850e1ae-af9b-430b-9c18-8c7dc149e876" alt="Configuración de despliegue" style="max-width: 100%;" />
</div>

📝 Esto generará un archivo YAML que contiene la configuración del pipeline. Haz clic en **Save and run**.

Azure DevOps te pedirá hacer un commit directamente en `main` o crear una rama. Es recomendable usar la rama principal (`main`) para mantener la última versión en producción.

---

## 4️⃣ Otorgar permisos para el despliegue

La primera vez que ejecutes el pipeline, es probable que se detenga en la fase de *Build stage* solicitando permisos.

<div align="center">
  <img src="https://github.com/user-attachments/assets/928c866b-653d-4a24-b060-c2681b362972" alt="Permisos requeridos" style="max-width: 100%;" />
</div>

🔐 Pulsa en **Permission needed** → **Permit** para continuar con el despliegue. El proceso continuará automáticamente.

---

## 5️⃣ Ver la aplicación desplegada

Una vez finalizado el proceso, podrás acceder a la aplicación desde el **portal de Azure** mediante la URL pública de tu Web App.

<div align="center">
<img width="1113" height="720" alt="image" src="https://github.com/user-attachments/assets/6230491c-3140-461e-b644-791cf02baf86" alt="Streamlit running" style= "max-width: 100%;"/>
</div>
---

🎉 ¡Tu aplicación Streamlit está ahora funcionando en la nube con integración continua desde Azure DevOps!
