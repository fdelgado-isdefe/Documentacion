# Despliegue de una aplicación Streamlit en Azure App Service usando Azure Pipelines

## 1. Crear una instancia de Azure App Service

Para desplegar una aplicación, primero es necesario crear la **Web App** donde estará alojada. Para ello, se necesitan:

- Un grupo de recursos
- Un plan de App Service

Accede al **portal de Azure**, abre el **Cloud Shell** y selecciona **Bash** (no necesitas configurar almacenamiento previamente).

![Cloud Shell](https://github.com/user-attachments/assets/cd1fcb39-80ca-40c1-80f6-b4423a540570)

### Crear los recursos necesarios

```bash
# Variables
RESOURCE_GROUP="streamlit-on-azure"     # Nombre del grupo de recursos 
LOCATION="westeurope"                   # Ubicación geográfica 
APP_SVC_PLAN="streamlitplan"            # Nombre del App Service Plan
WEB_APP_NAME="streamlitonazure"         # Nombre único global de la web app

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

## 2. Configurar la Web App

Para que la aplicación funcione correctamente, debes incluir un archivo de arranque llamado `startup.sh` en el mismo directorio que el archivo principal de tu app:

```bash
# Contenido del archivo startup.sh
python -m streamlit run <archivo_principal>.py --server.port 8000 --server.address 0.0.0.0
```

### Establecer el archivo de inicio en la configuración

```bash
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --startup-file startup.sh
```

### Habilitar la instalación de dependencias

Es necesario indicar que se deben instalar los paquetes definidos en `requirements.txt` durante el despliegue:

```bash
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

---

## 3. Desplegar desde Azure DevOps

Una vez configurada la Web App, puedes implementar el código directamente desde **Azure DevOps**. Para ello, asegúrate de tener el repositorio alojado en **Azure Repos**.

![Azure Repos](https://github.com/user-attachments/assets/38727c28-363d-43c4-829a-81092eff26ce)

### Activar los Pipelines

Si los Pipelines no están habilitados, ve a:

**Project settings** → **Overview** → **Azure DevOps services**  
y activa la opción *Pipelines*.

![Activar Pipelines](https://github.com/user-attachments/assets/d730df9d-7b67-4175-8911-835f04b6ed5c)

### Crear el pipeline

1. Ve a la pestaña **Pipelines** y haz clic en **New Pipeline**.
2. Selecciona **Azure Repos Git**.

![Seleccionar repositorio](https://github.com/user-attachments/assets/41cdceb8-4dfa-42b7-b39b-c05a30f41036)

3. Escoge el repositorio correspondiente.
4. En la configuración del pipeline, selecciona **Python to Linux Web App on Azure**.
5. Selecciona la suscripción de Azure y la Web App deseada.

![Seleccionar configuración](https://github.com/user-attachments/assets/9850e1ae-af9b-430b-9c18-8c7dc149e876)

Esto generará automáticamente un archivo YAML con toda la información necesaria para conectar el repositorio con la Web App.

Haz clic en **Save and run**. Se te preguntará si deseas hacer commit directamente en la rama principal o crear una nueva. Se recomienda usar la rama principal para asegurar que la Web App siempre tenga la última versión estable.

Presiona nuevamente **Save and run** para iniciar el despliegue.

---

## 4. Permisos y finalización

Durante la primera ejecución del pipeline, es posible que se detenga en la fase de *Build stage* debido a que el despliegue requiere permisos adicionales.

![Permisos](https://github.com/user-attachments/assets/928c866b-653d-4a24-b060-c2681b362972)

Haz clic en **Permission needed** y luego en **Permit** para autorizar el proceso. El despliegue se reanudará automáticamente y puede tardar unos minutos.

---

## 5. Resultado final

Una vez completado el despliegue, podrás acceder a tu aplicación directamente desde el **portal de Azure**.

<img width="1113" height="720" alt="image" src="https://github.com/user-attachments/assets/6230491c-3140-461e-b644-791cf02baf86" />

---
