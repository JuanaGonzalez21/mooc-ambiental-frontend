# 🌱 MOOC Ambiental - Plataforma de Educación Ambiental

Una plataforma moderna de aprendizaje en línea (MOOC) especializada en educación ambiental y sostenibilidad. Desarrollada con Next.js 15 y React 19, ofrece una experiencia de aprendizaje completa y accesible para estudiantes de todos los niveles.

## 🎯 Objetivo del Proyecto

Democratizar el acceso a la educación ambiental de calidad a través de una plataforma web moderna, permitiendo a usuarios de todo el mundo aprender sobre sostenibilidad, ecología y medio ambiente a su propio ritmo.

## ✨ Características Principales

- 🎓 **Catálogo de Cursos**: Amplia variedad de cursos ambientales organizados por nivel y categoría
- 👥 **Sistema de Usuarios**: Roles diferenciados (Estudiante, Instructor, Administrador)
- 📚 **Módulos Interactivos**: Contenido estructurado en módulos para mejor organización
- ⭐ **Sistema de Calificaciones**: Reseñas y valoraciones de cursos
- 📱 **Diseño Responsivo**: Interfaz adaptable para dispositivos móviles y desktop
- 🔐 **Autenticación Segura**: Sistema completo de registro y login con JWT
- 📊 **Dashboard Personalizado**: Panel de control para estudiantes e instructores

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS v4** - Framework de estilos utilitarios
- **Lucide React** - Iconografía moderna

### Backend
El backend (API REST, base de datos MySQL y autenticación JWT) vive en un repositorio y despliegue aparte (Railway). Este frontend solo lo consume vía `NEXT_PUBLIC_API_URL`.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun
- El backend de MOOC Ambiental corriendo (local o desplegado)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/JuanaGonzalez21/mooc-ambiental-frontend.git
cd mooc-ambiental-frontend
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local con la siguiente variable:
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

4. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

5. **Abrir en el navegador**
Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 📁 Estructura del Proyecto

```
mooc-ambiental-frontend/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── cursos/            # Páginas de cursos
│   │   ├── dashboard/         # Panel de usuario
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes reutilizables
│   │   ├── auth/              # Componentes de autenticación
│   │   ├── layout/            # Header, Footer
│   │   ├── sections/          # Secciones de la landing
│   │   └── ui/                # Componentes de UI
│   ├── config/                # Configuración de API
│   ├── data/                  # Adaptadores de datos
│   ├── lib/                   # Utilidades y configuración
│   └── types/                 # Definiciones de TypeScript
├── public/                    # Archivos estáticos
└── package.json              # Dependencias y scripts
```

## 🎨 Componentes Principales

- **MoocPage**: Página principal con landing page completa
- **HeroSection**: Sección hero con call-to-action
- **FeaturedCoursesSection**: Cursos destacados con carga dinámica
- **CourseCard**: Tarjeta de curso reutilizable
- **LoginModal/RegisterModal**: Modales de autenticación
- **Dashboard**: Panel de control personalizado por rol

## 🔧 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run start    # Servidor de producción
npm run lint     # Linter de código
```

## 🌐 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio con [Vercel](https://vercel.com)
2. Configura las variables de entorno en el dashboard
3. El despliegue se realizará automáticamente

### Otros Proveedores
- **Netlify**: Compatible con builds estáticos
- **Railway**: Para aplicaciones full-stack
- **DigitalOcean**: App Platform

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para preguntas o sugerencias sobre el proyecto, puedes contactarnos a través de:
- Email: juana.gonzalez.dev@gmail.com
- Issues: [GitHub Issues](https://github.com/JuanaGonzalez21/mooc-ambiental-frontend/issues)

---

**Desarrollado con 💚 para la educación ambiental**
