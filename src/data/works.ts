interface Post {
  size: number;
  title: string;
  author: string;
  src: string;
  body: string;
  tags: string[];
  href: string[];
  date: string;
}

export const WorksData: Post[] = [
  {
    title: "Spring-Login",
    author: 'Alexander Parco Flores',
    size: 220,
    src: "spring.png",
    body: "Este proyecto tiene como objetivo mostrar cómo funciona la dependencia Spring Boot Security mediante la implementación de un sistema de autenticación y autorización para las funcionalidades de inicio de sesión y registro de usuarios. A través de la aplicación de diferentes técnicas como la autenticación, autorización, autoridad otorgada y roles, se garantiza la seguridad y protección de los datos de los usuarios. ",
    tags: ["ReactJs", "Java", "Spring-Boot"],
    href: ["", "https://github.com/AlexParco/login-jwt-spring-boot.git"],
    date: "10/28/2022"
  },
  {
    title: "PokeApp",
    size: 300,
    author: 'Alexander Parco Flores',
    src: "pokeapp1.png",
    body: "Pokeapp es una aplicación donde podrás agregar a una lista de favoritos los pokemons que más te gusten, además de esto podrás dejar un comentario sobre este y así interactuar con otros usuarios",
    tags: ["Go", "ReactJS", "TypeScript"],
    href: ["", "https://github.com/AlexParco/pokeapp"],
    date: "10/06/2022"
  },
  {
    title: "TodoApp",
    size: 300,
    author: 'Alexander Parco Flores',
    src: "todoapp.png",
    body: "La aplicación Todo App es una herramienta útil para listar y organizar nuestras tareas diarias. Con su interfaz intuitiva, nos permite agregar, editar y eliminar tareas fácilmente, lo que nos ayuda a mantener el control y la organización de nuestras actividades cotidianas. Además, al ser una aplicación móvil, podemos llevar nuestras listas de tareas con nosotros dondequiera que vayamos, asegurándonos de no olvidar nada importante.",
    tags: ["ReactJS", "TypeScript"],
    href: ["https://alexparco.github.io/todoapp/", "https://github.com/AlexParco/todoapp.git"],
    date: "05/26/2022"
  },
  {
    title: "Task Api - TypeScript",
    author: 'Alexander Parco Flores',
    size: 400,
    src: "taskapi.PNG",
    body: "Esta API escrita en TypeScript fue desarrollada con el fin de brindar una funcionalidad completa de un CRUD para una aplicación de ToDo, permitiendo así a los usuarios realizar operaciones de crear, leer, actualizar y eliminar tareas de su lista de pendientes de manera eficiente y segura",
    tags: ["NodeJs", "TypeScript"],
    href: ["", "https://github.com/AlexParco/task-api"],
    date: "01/05/2023"
  }
]