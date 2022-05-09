
## Agregar a sitio web
* Add+ Change Theme ✅ 
* Add+ Stack


## Next
`<Link></Link>` una transicion de rutas del lado del cliente en nextjs 'next/link' 
Por ejemplo, Pages es un directorio con los siguientes archivos
* Pages\index.js
* Pages\about.js
* Pages\works.js

- con esto evitaremos que el navegador actualizara la pagina entera 
[NexLink]https://www.benmvp.com/blog/wrapping-next-link-custom-ui-link-component/

```javascript
function Home() {
  return (
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/about">
          <a>About Us</a>
        </Link>
      </li>
      <li>
        <Link href="/blog/hello-world">
          <a>Blog Post</a>
        </Link>
      </li>
    </ul>
  )
}
```
`<LinkBox></LinkBox>` remplaza a el `<a></a>`

