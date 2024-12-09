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
├── backend/ # Servidor Strapi (Patrón MVC)  
│   ├── src/  
│   │   ├── Admin/  
│   │   └── Api/  
├── web/ # Cliente vite + React  
│   ├── src/  
│   │   ├── components/ 
│   │   ├── context/  
│   │   ├── lib/  
│   │   ├── pages/ 
│   │   ├── services/  
│   │   └── utils/  
│   ├── App.jsx  
│   └── main.jsx 
