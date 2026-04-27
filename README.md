# 🛒 Lista Súper

Una aplicación móvil desarrollada en **React Native (Expo)** para gestionar listas de supermercado. Permite llevar un registro de la canasta básica mexicana, ajustar cantidades, modificar precios y guardar el progreso de forma independiente por sucursal (Walmart, Bodega Aurrerá, Costco, Sam's, 3B).

## 📋 Requisitos Previos (Instalaciones necesarias)

Para que el proyecto funcione correctamente en tu computadora, debes descargar e instalar estrictamente lo siguiente antes de clonar el código:

1. **Node.js (Entorno de ejecución):**
   * Ve a [nodejs.org](https://nodejs.org/).
   * Descarga e instala la versión **LTS (Long Term Support)**. Esto instalará automáticamente `npm` (Node Package Manager), que necesitamos para instalar las dependencias.
2. **Git (Control de versiones):**
   * Ve a [git-scm.com](https://git-scm.com/downloads) y descarga el instalador para tu sistema operativo. Déjalo con las opciones predeterminadas durante la instalación.
3. **Editor de Código (Recomendado):**
   * Descarga [Visual Studio Code](https://code.visualstudio.com/).
4. **En tu celular (Dispositivo físico):**
   * Ve a la Play Store (Android) o App Store (iOS) y descarga la aplicación **Expo Go**.


## 🚀 Instalación y Configuración Local

Sigue estos pasos puntuales en tu terminal (puedes usar la terminal integrada de VS Code abriendo el programa y presionando `` Ctrl + ` ``):

**1. Clonar el repositorio:**

git clone [https://github.com/DebiantNico/ListaSuper.git](https://github.com/DebiantNico/ListaSuper.git)

2. Entrar a la carpeta del proyecto:

cd ListaSuperMex

3. Instalar las dependencias exactas del proyecto:

npm install
(Este comando lee el archivo package.json y descarga React Native, Expo y AsyncStorage).

4. Instalar las dependencias de Expo (Almacenamiento):
Para asegurarnos de que la memoria de la aplicación funcione correctamente y tenga la versión compatible con nuestro Expo, ejecuta:

npx expo install @react-native-async-storage/async-storage

📱 Cómo ejecutar la aplicación
Una vez que todo esté instalado, ejecuta el siguiente comando para levantar el servidor de desarrollo. Usamos la bandera
-c para limpiar la caché y evitar errores de versiones anteriores:

npx expo start -c
Para verlo en tu celular:

Asegúrate de que tu computadora y tu celular estén conectados a la misma red Wi-Fi.

Abre la app Expo Go en tu celular.

Si usas Android, escanea el código QR que aparece en la terminal directamente desde la app Expo Go.

Si usas iOS, abre la cámara nativa de tu iPhone, enfoca el código QR y toca la notificación que te abrirá la app.

📂 Estructura Principal del Proyecto
Dado que estamos utilizando las versiones más recientes de Expo con el sistema de enrutamiento Expo Router, la estructura lógica se encuentra aquí:

/app/index.tsx -> Pantalla principal y lógica core. Aquí reside la interfaz de la lista, los estados de los productos y la conexión con el almacenamiento local.

AsyncStorage -> Utilizado para guardar el estado de las listas de manera persistente en el dispositivo (@list_Walmart, @list_Aurrera, etc.).

👥 Flujo de Trabajo para el Equipo
(Nota para el equipo: Definir aquí si se trabajará mediante Forks y Pull Requests o mediante Ramas/Branches en este mismo repositorio).

Nunca trabajes directamente sobre la rama main.

Antes de empezar tu tarea, asegúrate de tener la última versión: git pull origin main.

Crea una rama para tu tarea: git checkout -b feature-nombreDeTuTarea.

Al terminar, sube tus cambios y avisa al equipo para revisión.
