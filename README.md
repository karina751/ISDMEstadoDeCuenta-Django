# ISMEstadodeCuenta - Gestión de Estado de Cuenta y Recaudación

Este proyecto implementa un sistema de consulta de estado de cuenta para alumnos, con un panel administrativo de búsqueda, desarrollado con una arquitectura Full-Stack utilizando Django (Back-end) y React (Front-end).

---

##  Tecnologías Utilizadas

| Categoría | Tecnología/Librería | Propósito Principal |
| :--- | :--- | :--- |
| **Arquitectura** | Monorepo (Django/React Separados) | Permite el desarrollo y despliegue del servidor y la interfaz de forma independiente. |
| **Back-end (Servidor)**| **Django 5.2.x** | Framework principal para gestionar la lógica de negocio, modelos de datos y la API. |
| **API REST** | **Django REST Framework (DRF)** | Expone los datos (Alumnos, Cuotas, Recargos, Roles) en formato JSON. |
| **Base de Datos** | **MySQL 8.0.x** | Almacenamiento persistente de datos. |
| **Conector DB** | **PyMySQL** | Cliente Python que permite la conexión estable a MySQL en entornos de desarrollo (evitando errores de compilación). |
| **Front-end** | **React 18/19** | Librería de JavaScript para construir la interfaz de usuario dinámica (Login, Buscador, Estado de Cuenta). |
| **Generación de PDF** | **jspdf / jspdf-autotable** | Generación del PDF de Historial de Pagos y Deuda directamente en el navegador. |

---

## Configuración del Entorno y Puesta en Marcha

Para levantar el proyecto, debes inicializar el Back-end (servidor de datos) y el Front-end (interfaz de usuario) por separado.

### 1. Configuración de la Base de Datos (MySQL)

**Requisitos:** Tener un servidor **MySQL 8.0+** instalado y funcionando.

1.  **Crear la Base de Datos:** En MySQL Workbench o consola, crea la base de datos con el nombre exacto:
    ```sql
    CREATE DATABASE isdm_estado_de_cuenta_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```

2.  **Configurar Credenciales:** Crea el archivo **`.env`** en la carpeta `backend/` con las credenciales de tu usuario `root` (o el usuario que uses).
    ```ini
    # backend/.env
    # CLAVE DE MYSQL: Usa la contraseña de tu usuario 'root' o de desarrollo
    DB_PASSWORD=TU_CONTRASEÑA_MYSQL

    #CLAVE SECRETA DE DJANGO (IMPORTANTE: Copia el valor de SECRET_KEY del archivo settings.py)
    SECRET_KEY=CLAVE_DE_DESARROLLO_SEGURA_O_LA_COPIADA_DE_SETTINGS
    DEBUG=True
    ```
    *(Reemplaza `TU_CONTRASEÑA_MYSQL` con tu clave).*

---

## 2. Iniciar el Back-end (Django API)

**Ubicación:** `ISDM_ESTADO_DE_CUENTA_PROYECTO/backend`

1.  **Activar Entorno Virtual e Instalar Dependencias:**
    ```bash
    # (En la carpeta backend/)
    python -m venv venv
    venv\Scripts\activate  # CMD/PowerShell
    source venv/bin/activate # Bash
    
    # Instalar librerías
    pip install -r requirements.txt
    pip install python-dotenv djangorestframework django-extensions PyMySQL # Aseguramos todas las dependencias
    ```

2.  **Crear y Aplicar Tablas:**
    ```bash
    python manage.py makemigrations mi_app
    python manage.py migrate
    ```

3.  **Cargar Datos de Prueba (Roles, Recargos, Cuotas):**
    *Entra al shell de Django y ejecuta la función de carga de datos.*
    ```bash
    python manage.py shell_plus
    # Dentro del shell:
    >>> from mi_app.scripts.cargar_datos import cargar_datos_iniciales
    >>> cargar_datos_iniciales()
    >>> exit()
    ```

4.  **Iniciar Servidor API:**
    ```bash
    python manage.py runserver
    ```
    (La API estará disponible en `http://127.0.0.1:8000/`)

---

## 3. Iniciar el Front-end (React)

**Ubicación:** `ISDM_ESTADO_DE_CUENTA_PROYECTO/frontend/consulta-e`

1.  **Instalar Dependencias de Node.js:**
    *(Abre una nueva terminal y asegúrate de tener Node/npm instalado)*
    ```bash
    # (En la carpeta frontend/consulta-e/)
    npm install
    ```

2.  **Iniciar Servidor de React:**
    ```bash
    npm start
    ```
    (La aplicación se abrirá en `http://localhost:3000/`)

---

##  Cuentas de Prueba (Login Simulado)

Utiliza estos DNIs en la pantalla de "Simulación de Login" para probar los diferentes flujos:

* **Secretaria Administrativa:** `00000001` (Accede al rol Administrativo).
* **Alumno (Con Deuda y Recargos):** `34567890` (Juan Perez).
* **Alumno (Al Día):** `12345678` (Maria Lopez).