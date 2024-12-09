<div align="center">
<img src="./Fase 2/Evidencias Proyecto/Evidencias de sistema Aplicacion/CarMotorFix/Web/public/Logo-carmotorfix.png" height="150px" width="auto" /> 

## _CarMotorFix_ - Registro de Mantenimiento de Vehículos
</div>


## 📚 Tabla de Contenidos  

<div align="center">
    <a href="#🚀-empezar">
        Empezar
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#🧞-comandos">
        Comandos
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#🔑-licencia">
        Licencia
    </a>
</div>

---
## 🚀 Descripción del Proyecto

El proyecto busca desarrollar un software de gestión de mantenimiento vehicular dirigido a talleres mecánicos, mejorando la eficiencia en la organización y control de reparaciones y mantenimientos. En la actualidad, muchos talleres, especialmente los pequeños y medianos, carecen de herramientas digitales que les permitan llevar un registro detallado de los servicios realizados, lo cual afecta la calidad del servicio y la satisfacción del cliente.

## 🛠️ Tecnologías  

- [**Vite + React**](https://vitejs.dev/) - Entorno de desarrollo ultrarrápido con React para aplicaciones web modernas.  
- [**Tailwind CSS**](https://tailwindcss.com/) - Framework de CSS de utilidad para diseñar interfaces personalizables rápidamente.  
- [**Strapi**](https://strapi.io/) - CMS headless autohospedado para gestionar contenido con APIs personalizables.  
- [**PostgreSQL**](https://www.postgresql.org/) - Sistema de gestión de bases de datos relacional, potente y de código abierto.  

---

## 🚀 Empezar  

### 1. Instalar Bun (Gestor de Dependencias):  

```bash
# MacOS, WSL y Linux:
curl -fsSL https://bun.sh/install | bash

# Windows:
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. Configurar el Backend (Strapi):
```bash
# Navega a la carpeta del backend:
cd "Fase 2/Evidencias Proyecto/Evidencias de sistema Aplicacion/CarMotorFix"

# Instala las dependencias:
bun install

```
### 3. Ejecuta el servidor de desarrollo (Backend):

```bash
# Disfruta del resultado
bun run develop
```
### 4. Configurar el Frontend (React):
```bash
# Abre otra terminal y navega a la carpeta del frontend:
cd Web

# Instala las dependencias:
bun install
```
### 5. Ejecuta el servidor de desarrollo (Frontend):

```bash
# Disfruta del resultado
bun run dev
```

### Acceso a la Aplicación
1. Backend: Abre [**http://localhost:1337/**](http://localhost:1337/) en tu navegador para ver el resultado 🚀 
2. Frontend: Abre [**http://localhost:5173/**](http://localhost:5173/) en tu navegador para ver el resultado 🚀

## 🧞 Comandos

|     | Comando          | Acción                                        |
| :-- | :--------------- | :-------------------------------------------- |
| ⚙️  | `i` o `install` | Instala las dependencias  |
| ⚙️  | `run develop` | Lanza un servidor de desarrollo local en en el Backend `localhost:1337`.  |
| ⚙️  | `run dev` | Lanza un servidor de desarrollo local en en el Frontend `localhost:5173`.  |

## 🔑 Licencia

[MIT](LICENSE.txt)


