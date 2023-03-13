interface Post {
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
    src: "spring.png",
    body: "Proyecto realizado para detallar el funcionamiento de la dependencia spring boot security aplicando autenticación, autorización, autoridad otorgada y roles a un login y register de usuarios",
    tags: ["ReactJs", "Java", "Spring-Boot"],
    href: ["", "https://github.com/AlexParco/login-jwt-spring-boot.git"],
    date: "10/28/2022"
  },
  {
    title: "PokeApp",
    author: 'Alexander Parco Flores',
    src: "pokeapp1.png",
    body: "Pokeapp es una aplicación donde podrás agregar a una lista de favoritos los pokemons que más te gusten, además de esto podrás dejar un comentario sobre este y así interactuar con otros usuarios",
    tags: ["Go", "ReactJS", "TypeScript"],
    href: ["", "https://github.com/AlexParco/pokeapp"],
    date: "10/06/2022"
  },
  {
    title: "TodoApp",
    author: 'Alexander Parco Flores',
    src: "todoapp.png",
    body: "Todo App es la típica aplicación donde se puede listar diferentes tareas que tengamos pendientes, el objetivo de esta app es ayudar con nuestra organización diaria",
    tags: ["ReactJS", "TypeScript"],
    href: ["https://alexparco.github.io/todoapp/", "https://github.com/AlexParco/todoapp.git"],
    date: "05/26/2022"
  },
  {
    title: "Task Api - TypeScript",
    author: 'Alexander Parco Flores',
    src: "taskapi.PNG",
    body: "API escrita en TypeScript la cual cumples funciones de un CRUD para un TodoApp",
    tags: ["NodeJs", "TypeScript"],
    href: ["", "https://github.com/AlexParco/task-api"],
    date: "01/05/2023"
  }
]