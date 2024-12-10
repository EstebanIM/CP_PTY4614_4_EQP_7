<div align="center">
<img src="./Fase 2/Evidencias Proyecto/Evidencias de sistema Aplicacion/CarMotorFix/Web/public/Logo-carmotorfix.png" height="150px" width="auto" /> 

## _CarMotorFix_ - Registro de Mantenimiento de Vehículos
</div>

## 📚 Tabla de Contenidos  

<div align="center">
    <a href="#🚀-empezar">Empezar</a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#🔧-requisitos-del-sistema">Requisitos del Sistema</a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#🚗-descripcion">Descripción</a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#⚙️-tecnologias-principales">Tecnologías Principales</a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#📂-estructura-del-proyecto">Estructura del Proyecto</a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#⚙️-configuracion-inicial">Configuración Inicial</a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#🧩-componentes-principales">Componentes Principales</a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#📦-dependencias-principales">Dependencias Principales</a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#📝-notas-importantes">Notas Importantes</a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#🔑-licencia">Licencia</a>
</div>
---
# 🌐 Integrantes


---

# 🚗 CarMotorFix

## 📄 Descripción  
El proyecto busca desarrollar un software de gestión de mantenimiento vehicular dirigido a talleres mecánicos, mejorando la eficiencia en la organización y control de reparaciones y mantenimientos. En la actualidad, muchos talleres, especialmente los pequeños y medianos, carecen de herramientas digitales que les permitan llevar un registro detallado de los servicios realizados, lo cual afecta la calidad del servicio y la satisfacción del cliente. 

---

## 🔧 Requisitos del Sistema  

### Software  
- ⚙️ **Node.js** (v18 o superior)  
- 🐘 **PostgreSQL** (v14 o superior)  
- 🧅 **Bun** (incluido con Node.js)  

### Hardware Recomendado (Servidor)  
- 🖥️ **CPU**: 4 cores  
- 💾 **RAM**: 8GB mínimo  
- 📀 **Almacenamiento**: 50GB SSD  
- 🌐 **Ancho de banda**: 100Mbps  

---

## 🚀 Tecnologías Principales  

- 🎨 **Frontend**: React + Vite + JavaScript  
- 💻 **Backend**: Strapi 
- 🗂️ **cms**: Strapi  
- 🐘 **Base de datos**: PostgreSQL  

---

## 📂 Estructura del Proyecto  

```plaintext
proyecto/  
proyecto/  
├── backend/ # Servidor Strapi (Patrón MVC)  
│   ├── src/  
│   │   ├── Admin/  
│   │   └── Api/  
│   └── web/ # Cliente vite + React
    │   ├── src/  
    │   │   ├── components/ 
    │   │   ├── context/  
    │   │   ├── lib/  
    │   │   ├── pages/ 
    │   │   ├── services/  
    │   │   └── utils/  
    │   ├── App.jsx  
    │   └── main.jsx
```
## ⚙️ Configuración Inicial  

### 1️⃣ Instalar Bun 🧅 (Gestor de Dependencias, omitir este paso si quiere trabajar con npm):

bash
# MacOS, WSL y Linux:
curl -fsSL https://bun.sh/install | bash

bash
# Windows powershell:
powershell -c "irm bun.sh/install.ps1 | iex"


### 2️⃣ Clonar el Repositorio  

bash
git clone https://github.com/EstebanIM/CP_PTY4614_4_EQP_7.git

bash
cd CP_PTY4614_4_EQP_7



### 3️⃣ Variables de Entorno  

#### 📂 Backend (.env)  

env

# Server
HOST=0.0.0.0
PORT=1337

# Secrets
APP_KEYS=KEY
API_TOKEN_SALT=TOKEN
ADMIN_JWT_SECRETKEY
TRANSFER_TOKEN_SALt:TOKEN

RESEND_API_KEY=KEY

# # Database
# DATABASE_CLIENT=postgres
# DATABASE_HOST=
# DATABASE_PORT=5432
# DATABASE_NAME=strapi
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=postgresql
# DATABASE_SSL=false
# DATABASE_FILENAME=
# JWT_SECRET=Key==


#### 📂 Web (.env)
env
VITE_STRAPI_URL=http://localhost
VITE_STRAPI_TOKEN_ACCOUNT=TOKEN


### 4️⃣ Instalación
# 🛠️ Instalación del backend  

bash
# Npm
cd CarMotorFix  
npm install  
npm run develop

bash
# bun
cd CarMotorFix  
bun install  
bun run develop

# 🛠️ Instalación del frontend
bash
# npm
cd /CarMotorFix/Web  
npm install
npm run dev

bash
# bun
cd /CarMotorFix/Web  
bun install
bun run dev

# 🛠️ Proyecto Salfa Capacitaciones  

Plataforma web CarMotorFix, diseñada para la gestión integral de talleres automotrices. La solución permite la administración de reparaciones, clientes, vehículos y servicios de manera eficiente, optimizando los procesos del taller y mejorando la experiencia del cliente.

---

## ⚙️ Configuración Inicial  


### 5️⃣ Ejecución del Proyecto  
#### ▶️ Backend(desde /CarMotorFix)  
bash
# npm
npm run develop

bash
# bun
bun run develop

#### ▶️ Frontend(desde /CarMotorFix/Web)  
bash
# npm 
npm run dev

bash
# bun
bun run dev


# 🌐 Puertos y URLs  

- 🎨 **Frontend**: [http://localhost:5173/](http://localhost:5173/)  
- 💻 **Backend**: [http://localhost:1337/](http://localhost:1337/)  

---

## 🧩 Componentes Principales  

- 📈 **Dashboard de Mecanico**  
- 📈 **Dashboard de Admin**  
- 📈 **Dashboard de Usuario**  
- 🛠️ **Sistema CRUD**
- 👥 **Gestión de usuarios**  
- 🔒 **Sistema de autenticación**  

---

## 📦 Dependencias Principales  

### 🛠️ Backend  

- 🚀 **strapi-provider-email-resend**: ^1.0.4
- 📘 **Strapi**: 5.1  
- 🔑 **strapi-v5-plugin-populate-deep**: ^4.0.4  

### 🎨 Frontend  

- ⚛️ **React**: ^18.3.1  
- ⚡ **Vite**: ^5.4.10  
- 🎨 **Tailwind**: ^6.1.6  
- 🎨 **lucide-react**: ^0.453.0
- 📜 **JSX**: ^5.2.2  
- 👍 **framer-motion**: ^11.11.11
- ⚠️ **react-toastify**: ^10.0.6
---

## 📝 Notas Importantes  

- 🔄 Ejecutar Primero el backend y despues el frontend  
- 🐘 Asegurar que **PostgreSQL** esté en ejecución antes de iniciar el backend.  

## 🔑 Licencia

[MIT](LICENSE.txt)

 no funciona
