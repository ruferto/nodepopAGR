# nodepopAGR

## Iniciar base de datos
Para ejecutar el script para iniciar la base de datos escribimos:

`npm run installDB`

Una vez creados los registros, ya podemos arrancar la aplicación con:

Producción: `npm run start`

Desarrollo: `npm run dev`

## API
El servicio API se encuentra en http://localhost:3000/api/anuncios

La ruta principal dará como resultado un json con todos los anuncios disponibles. Ejemplo:

`{"tags":["lifestyle","motor"],"_id":"601c78699d85b60a20602e87","nombre":"Bicicleta","venta":true,"precio":230.15,"foto":"bici.jpg"}`

Para filtrar, se le pueden pasar por querystring al método get los siguientes parámetros referidos a los artículos:
- nombre
- precio
- tag
- venta
- foto

Además de otros para paginación, ordenación y campos que mostrar:
- start
- skip
- limit
- sort
- fields

Para el nombre se usará la cadena enviada como comienzo del nombre de artículo. No se discriminan mayúsculas y minúsculas.

El precio debe tener el formato *'mínimo-máximo'* para rango, *'mínimo-'* para únicamente límite inferior, *'-máximo'*, para únicamente límite superior y sólamente un número para precio exacto.
Ejemplos de cada uno:

- `10-100` Valores entre 10 y 100 inclusives.
- `10-` Valores mayores o iguales a 10.
- `-100` Valores menores o iguales a 100.
- `10` El precio es 10.

Para buscar por más de un tag, se pasarán tantos parámetros tag como número de ellos haya.

La venta debe ser `'true'` para artículos en venta o `'false'` para artículos buscados.

Por ejemplo, la petición:

http://localhost:3000/api/anuncios/?nombre=i&tag=lifestyle&precio=100-1500&start=0&limit=2&sort=precio&fields=nombre%20precio-_id

Daría como resultado:

`[{"_id":"601c78699d85b60a20602e96","nombre":"iPad Mini"},{"_id":"601c78699d85b60a20602e89","nombre":"iMac"}]`

La ruta *http://localhost:3000/api/anuncios/tags* devuelve un json con la lista de tags de todos los artículos y http://localhost:3000/api/anuncios/tags-articles devuelve un json con todos los tags junto al número de artículos que lo llevan.

Mediante post pueden añadirse artículos pasándole a http://localhost:3000/api/anuncios/ los argumentos de más arriba referidos a artículos.

## Frontend

En http://localhost:3000/ pueden verse todos los artículos disponibles, además de admitir búsquedas mediante get con parámetros en querystring (los mismos que en la API).

En la parte superior derecha de la página hay un botón con el que se muestra un pequeño formulario con el que añadir nuevos artículos.