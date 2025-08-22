# User Management App

Aplicación en **Next.js 13 (App Router)** para gestión de usuarios utilizando la API pública de [DummyAPI](https://dummyapi.io/).  
Permite **crear, listar, editar, eliminar y ver en detalle** usuarios de manera sencilla.

## 🚀 Tecnologías usadas
- [Next.js 13](https://nextjs.org/) con App Router
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) para estilos
- [DummyAPI](https://dummyapi.io/) como backend de ejemplo

## 📂 Estructura principal
```
src/
 ├─ app/
 │   ├─ layout.tsx       # Layout principal
 │   ├─ page.tsx         # Página principal (tabla de usuarios)
 │   ├─ globals.css      # Estilos globales
 │   └─ components/
 │       ├─ Modal.tsx
 │       ├─ UserForm.tsx
 │       ├─ editarUsuarioForm.tsx
 │       ├─ modalDetalle.tsx
 │       └─ ...
```

## ⚙️ Configuración inicial
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   cd tu-repo
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Inicia el proyecto:
   ```bash
   npm run dev
   ```

4. Abre en tu navegador:
   ```
   http://localhost:3000
   ```

## ✨ Funcionalidades

Listado de usuarios con paginación
Crear usuario
Editar usuario
Eliminar usuario
Ver detalle de usuario
Validaciones en formularios

## 📝 Notas
- Este proyecto está pensado como **demo / práctica** para consumir una API REST desde Next.js.
- Si el API devuelve **error 400** al crear/editar, probablemente falten campos requeridos.


👨‍💻 Autor: Angel Steban Acosta Daza 
📧 Contacto: stebandaza11@gmail.com