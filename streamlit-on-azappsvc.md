# Desplegar una aplicación con Streamlit en Azure App Service mediante Azure Pipelines

## Crear una instancia de Azure App Service

Para desplegar una aplicación, primero se necesita crear la web app donde estará alojada, para ello se necesita:

- El grupo de recursos

- El App Service Plan

Entonces, nos dirigimos al **portal de Azure** y seleccionamos el **Cloud Shell** y seleccionamos **Bash** sin necesidad de tener ningún tipo de almacenamiento.

<img width="1146" height="311" alt="image" src="https://github.com/user-attachments/assets/cd1fcb39-80ca-40c1-80f6-b4423a540570" />

A continuación, generamos la web app service:

```bash
# Variables
RESOURCE_GROUP="streamlit-on-azure" #opcional
LOCATION="westeurope"
APP_SVC_PLAN="streamlitplan" #opcional
WEB_APP_NAME="streamlitonazure" #opcional pero nombre unico en el mundo

# Create resource group
az group create \
--name $RESOURCE_GROUP \
--location $LOCATION

# Create App Service Plan
az appservice plan create \
--name $APP_SVC_PLAN \
--resource-group $RESOURCE_GROUP \
--is-linux \
--sku S1

# Create Web App
az webapp create \
--resource-group $RESOURCE_GROUP \
--plan $APP_SVC_PLAN \
--name $WEB_APP_NAME \
--runtime "PYTHON|3.10"
```

## Configurar la instancia de web app service

En el caso de App Service, para que esta aplicación se ejecute correctamente debemos acompañar la misma de un archivo de arranque, el cual se llamará *startup.sh* (debe de estar en el mismo fichero que el archivo ejecutable):

```bash
python -m streamlit run <archivo principal de la aplicación>.py --server.port 8000 --server.address 0.0.0.0
```

Para que la App Service lo tenga en cuenta, se debe indicar en la configuración del mismo:
```bash
az webapp config set \
--resource-group $RESOURCE_GROUP \
--name $WEB_APP_NAME \
--startup-file startup.sh
```

Por otro lado, también se ha de indicarle que durante el despliegue se tienen que instalar todos los módulos que aparecen en el archivo *requirements.txt*
```bash
az webapp config appsettings set \
--resource-group $RESOURCE_GROUP \
--name $WEB_APP_NAME \
--settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

## Implementación desde Azure Devops
Una vez creado el Web App Service, es momento de implementar el código desde Azure Devops. Para ello, el archivo debe estar subido en un Azure Repos.

<img width="1196" height="558" alt="image" src="https://github.com/user-attachments/assets/38727c28-363d-43c4-829a-81092eff26ce" />

Si no se tienen activados, se han de activar los *Pipelines* de Azure Repos. Para ello, en *Project settings* dentro de la pestaña *General* dentro de *Overview* en el apartado de *Azure DevOps services* enciende el interruptor de *Pipelines*

<img width="1171" height="646" alt="image" src="https://github.com/user-attachments/assets/d730df9d-7b67-4175-8911-835f04b6ed5c" />

Una vez activado, se va a la pestaña de *Pipelines* y se selecciona *New pipeline*.

Se selecciona *Azure Repos Git* en la primera pestaña:

<img width="845" height="410" alt="image" src="https://github.com/user-attachments/assets/41cdceb8-4dfa-42b7-b39b-c05a30f41036" />

Se selecciona el repositorio que queremos conectar y en la pestaña de configuración del pipeline, seleccionamos *Python to Linux Web App on Azure*. Te pedirá que selecciones la suscripción de Azure a la que quieres apuntar y dentro de esta a la Web App Service que queremos conectar.

<img width="1063" height="405" alt="image" src="https://github.com/user-attachments/assets/9850e1ae-af9b-430b-9c18-8c7dc149e876" />

Esto generará un archivo YAML el cual tendrá toda la información necesaria para conectar este repositorio con la Web App. 

Para concluir pulsamos en *Save and run*. A continuación, te preguntará si quieres realizar el commit directamente en la rama principal o generar una nueva, esto es indistinto pero es más recomendable que se haga el rama principal para que la Web App tenga siempre la versión principal. Se selecciona *Save and run* de nuevo.

Comenzará el deployment de la Web App, si es la primera vez que realizas esta acción en esta organización te dará error y te solicitará rellenar un formulario indicando que uso quieres hacer de esa organización. Una vez complimentado este formulario tendrás libre acceso a los deployments en toda la organización en unos 5 días.

Cuando termine la fase de *Build stage* se detendrá la ejecución ya que el deployment necesita permisos.

<img width="293" height="185" alt="image" src="https://github.com/user-attachments/assets/928c866b-653d-4a24-b060-c2681b362972" />

Si se pulsa sobre donde pone *Permission needed* y después en *Permit* empezará el deployment automaticamente, este durará unos minutos.

Una vez terminado el deployment ya se puede visitar la aplicación desde el portal de azure.
