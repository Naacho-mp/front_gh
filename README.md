Frontend Sistema de Gestión Horaria

Frontend del **Sistema de Gestión Horaria**, desarrollado con [Angular](https://angular.dev/) y Angular Material. Permite administrar y visualizar la información relacionada con el control de horarios para la carrera de Ingeniería Civil en Informática - UCM.

## Tecnologías

- **Angular** `21.x`
- **Angular Material** y **Angular CDK**
- **RxJS**
- **Bootstrap Icons** / **PrimeIcons**
- **xlsx** (lectura/escritura de archivos Excel)
- **Vitest** (testing)
- **Prettier** (formateo de código)

## Estructura del proyecto

```
front_gh/
├── public/        # Archivos estáticos
├── src/           # Código fuente de la aplicación (Componentes, forms, layouts, pages, services, shared )
├── angular.json   # Configuración de Angular CLI
├── package.json   # Dependencias y scripts
└── tsconfig*.json # Configuración de TypeScript
```

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión compatible con Angular 21)
- [npm](https://www.npmjs.com/) `11.x` (o el gestor configurado en `packageManager`)
- [Angular CLI](https://angular.dev/tools/cli) instalado globalmente (opcional, pero recomendado)

```bash
npm install -g @angular/cli
```

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/Naacho-mp/front_gh.git
cd front_gh
```

2. Instalar las dependencias:

```bash
npm install
```

## Servidor de desarrollo

Para levantar el servidor local de desarrollo:

```bash
npm start
```

o bien:

```bash
ng serve
```

Luego abrir el navegador en `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques los archivos fuente.

## Build

Para compilar el proyecto:

```bash
ng build
```

Los artefactos de compilación se guardarán en el directorio `dist/`. Por defecto, el build de producción optimiza la aplicación para mejorar el rendimiento y la velocidad.

## Code

Para ver el listado completo de esquemas disponibles (`components`, `directives`, `pipes`, etc.):

```bash
ng generate --help
```
