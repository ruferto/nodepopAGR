# nodepopAGR

Antes de nada, hay que generar un archivo `.env` en la raiz sigiendo el modelo `.env.example`.

## Inicializar la base de datos

Para ejecutar el script para inicializar la base de datos escribimos:

`npm run installDB`

o bien ejecutar directamente `install_db.js` en el directorio base de la aplicación con `node install_db.js`.

Una vez creados los documentos, ya podemos arrancar la aplicación con:

Producción: `npm run start`

Desarrollo: `npm run dev`

Test: `npm test`

Asímismo, para arrancar el microservicio de creación de thumbnails puede usarse: `npm run thumbServ`

## API

Todas las operaciones, excepto el login requieren autenticación.
Para la autenticación es necesario una petición POST a http://localhost:3000/api/v1//loginJWT con los campos 'email' y 'password'.

El servicio API se encuentra en http://localhost:3000/api/v1/anuncios

La ruta principal dará como resultado un json con todos los anuncios disponibles. Ejemplo de un solo artículo:

`{"tags":["lifestyle","motor"],"_id":"601c78699d85b60a20602e87","name":"Bicicleta","sale":true,"price":230.15,"photo":"bici.jpg"}`

Para filtrar, se le pueden pasar por el método GET los siguientes parámetros referidos a los artículos:

- name
- price
- tag
- sale
- photo

Además de otros para paginación, ordenación y campos que mostrar:

- start
- skip
- limit
- sort
- fields

Para el nombre se usará la cadena enviada como comienzo del nombre de artículo. No se discriminan mayúsculas y minúsculas.

El precio debe tener el formato _'mínimo-máximo'_ para rango, _'mínimo-'_ para únicamente límite inferior, _'-máximo'_, para únicamente límite superior y sólamente un número para precio exacto.
Ejemplos de cada uno:

- `10-100` Valores entre 10 y 100 inclusives.
- `10-` Valores mayores o iguales a 10.
- `-100` Valores menores o iguales a 100.
- `10` El precio es 10.

El mínimo debe ir antes del máximo. valores como `100-10` devolverán un error.

Para buscar por más de un tag, se pasarán tantos parámetros tag como número de ellos haya.

La venta debe ser `'true'` para artículos en venta o `'false'` para artículos buscados. Cualquier otro valor devolverá un error.

Por ejemplo, la petición:

http://localhost:3000/api/anuncios/?name=i&tag=lifestyle&price=100-1500&start=0&limit=2&sort=price&fields=name%20price

Daría como resultado:

`[{"_id":"601d52580466bb05ae34e6f7","name":"iPad Mini","price":199.95},{"_id":"601d52580466bb05ae34e6ea","name":"iMac","price":1090}]`

La ruta _http://localhost:3000/api/v1/anuncios/tags_ devuelve un json con la lista de tags de todos los artículos y http://localhost:3000/api/v1/anuncios/tags-articles devuelve un json con todos los tags junto al número de artículos que lo llevan.

Mediante post pueden añadirse artículos pasándole a http://localhost:3000/api/v1/anuncios/ los argumentos de más arriba referidos a artículos mediante POST. Todos los campos son obligatorios excepto 'photo'.

## Frontend

En http://localhost:3000/ pueden verse todos los artículos disponibles, además de admitir búsquedas mediante get con parámetros en querystring (los mismos que en la API).

En la parte superior derecha de la página hay un botón, que al pulsarlo, muestra un pequeño formulario con el que añadir nuevos artículos.
