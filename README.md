# blockbusterExample API
Hay que agregar las variables de entorno

CADUCIDAD_TOKEN='7d'

SEED_AUTENTICACION='secret'

DATABASE_URL="mysql://user:password@localhost:yourconfigport/databaseName?schema=public"

//Test Endpoint database

DATABASE_URL_TEST="mysql://user:password@localhost:yourconfigport/databaseName?schema=public"

### Levantar base de datos en prisma


* Migrar Base de datos
```
npx prisma db push
```
* Cargar movies con el seed
```
npm run seed
```

#Consigna del Trabajo
   
    Se te ha encargado el trabajo de crear un sistema de alquiler de películas. 
    
    El front end se va a enviar a otro equipo así que es imperativo que cumplas un estándar con tus respuestas porque sino llamara a problemas en el futuro.

    Para stockear las peliculas se usa la API ghibli https://ghibliapi.herokuapp.com/, necesitan stockear con estas películas y usar la información de esta API para sacar los detalles

#Requerimientos

    1-Sistema de usuarios: Debe crearse un sistema donde se puedan registrar usuarios y hacer login y logout 

      Register  ✅
       route : /register
       metodo: POST 
       req.body: {"email":"demo@demo.com", "dni":"1234561","phone":"12567811" , "password":"123456"}
       res.body:
          {
             "ok": true,
              "usuario": {
              "id": 1,
              "email": "demo@demo.com",
              "dni": "1234561",
              "phone": "12567811",
              "password": "$2b$10$RzDmUxZ8t4tVNn7WfOA2Wezl9xJT.6LIjqfnAKU4EBBzP1PEwwB8C",
              "updatedAt": "2022-11-07T14:36:12.558Z",
              "createdAt": "2022-11-07T14:36:12.558Z",
              "role": "USER"
                         }
           }

      Login  ✅
       route : /login
       metodo: POST
       req.body: {"email":"demo@demo.com", "password":"123456"}
       res.body:
             {
                   "ok": true,
                   "usuario": {
                               "id": 2,
                               email": "demo@demo.com",
                               "dni": "1234561",
                               "phone": "12567811",
                               "password": "$2b$10$RzDmUxZ8t4tVNn7WfOA2Wezl9xJT.6LIjqfnAKU4EBBzP1PEwwB8C",
                               "updatedAt": "2022-11-07T14:36:12.558Z",
                               "createdAt": "2022-11-07T14:36:12.558Z",
                               "role": "USER"
                           },                                                                                        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoyLCJlbWFpbCI6ImRlbW9AZGVtby5jb20iLCJkbmkiOiIxMjM0NTYxIiwicGhvbmUiOiIxMjU2NzgxMSIsInBhc3N3b3JkIjoiJDJiJDEwJFJ6RG1VeFo4dDR0Vk5uN1dmT0EyV2V6bDl4SlQuNkxJanFmbkFLVTRFQkJ6UDFQRXd3QjhDIiwidXBkYXRlZEF0IjoiMjAyMi0xMS0wN1QxNDozNjoxMi41NThaIiwiY3JlYXRlZEF0IjoiMjAyMi0xMS0wN1QxNDozNjoxMi41NThaIiwicm9sZSI6IlVTRVIifSwiaWF0IjoxNjY3ODMxODcyLCJleHAiOjE2Njg0MzY2NzJ9.6CKsxXWaBwJDXuqxtPelgWuk4oP4dpwt3TId1AWBG9o"
                        }

       Logout  ✅
         route : /logout
         metodo: Get
         Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoyLCJlbWFpbCI6ImRlbW9AZGVtby5jb20iLCJkbmkiOiIxMjM0NTYxIiwicGhvbmUiOiIxMjU2NzgxMSIsInBhc3N3b3JkIjoiJDJiJDEwJFJ6RG1VeFo4dDR0Vk5uN1dmT0EyV2V6bDl4SlQuNkxJanFmbkFLVTRFQkJ6UDFQRXd3QjhDIiwidXBkYXRlZEF0IjoiMjAyMi0xMS0wN1QxNDozNjoxMi41NThaIiwiY3JlYXRlZEF0IjoiMjAyMi0xMS0wN1QxNDozNjoxMi41NThaIiwicm9sZSI6IlVTRVIifSwiaWF0IjoxNjY3ODMxODcyLCJleHAiOjE2Njg0MzY2NzJ9.6CKsxXWaBwJDXuqxtPelgWuk4oP4dpwt3TId1AWBG9o"
         res.body:
            {
                You must to logued in
             } 


    2-Se debe poder buscar películas por nombre o por código, la información deberá salir desde la API

        Get movie by title ✅
            route: movies/
            metodo: GET
            res.body
                [{
                    Array with all movies from ghibli api
                }]

        Get movie by Id ✅
            route: /movies/:id
            metodo: GET
            res.body
                {
                    "id": "790e0028-a31c-4626-a694-86b7a8cada40",
                    "title": "Earwig and the Witch",
                    "description": "An orphan girl, Earwig, is adopted by a witch and comes home to a spooky house filled with mystery and magic.",
                    "director": "Gorō Miyazaki",
                    "producer": "Toshio Suzuki",
                    "release_date": "Toshio Suzuki",
                    "running_time": "82",
                    "rt_score": "30"}

       Get movie by Title ✅
            route: /movies/title/:title
            metodo: GET
            res.body
                {
                      "id": "790e0028-a31c-4626-a694-86b7a8cada40",
                      "title": "Earwig and the Witch",
                      "description": "An orphan girl, Earwig, is adopted by a witch and comes home to a spooky house filled with mystery and magic.",
                      "director": "Gorō Miyazaki",
                      "producer": "Toshio Suzuki",
                      "release_date": "Toshio Suzuki",
                      "running_time": "82",
                      "rt_score": "30"}
                
    3-Sistema de alquiler: Se debe poder registrar un alquiler, actualizar el stock y luego poder registrar la devolución del alquiler, y mantener registro de las veces que una película fue alquilada

        Alquilar pelicula ✅
            route: /rents/:code
            metodo: POST
            Authorization: `Bearer ${token}` 
            res.body:                
                   {"id_rent": 6,
                    "id_user": 2,
                    "code": "12cfb892-aac0-4c5b-94af-521852e46d6a",
                    "rent_date": "2022-11-07T14:57:19.277Z",
                    "refund_date": "2022-11-14T14:57:19.277Z",
                    "userRefund_date": "2022-11-07T14:57:19.279Z",
                    "updatedAt": "2022-11-07T14:57:19.279Z",
                    "createdAt": "2022-11-07T14:57:19.279Z"}
                

        Devolver pelicula ✅
            route: /rents/:id
            metodo: PUT
            data: id
            req.params
                {
                   /rents/1
                }

        Peliculas alquiladas ✅
            route: /rents/user
            metodo: GET
            Authorization: `Bearer ${token}` 
            querys: order:  { asc, desc }
            res.body:[ Array con todos los alquileres del usuario]
        
        
        
        Todas las Peliculas alquiladas ✅
            route: /rents/all
            metodo: GET             
            querys: order:  { asc, desc }
            res.body:[ Array con todos los alquileres de todos los usuarios]
    
    4-Sistema de multas: Al devolver un alquiler se le envía al usuario el precio final del alquiler, que es dependiendo de la duración esperada del alquiler, si se pasa de esta fecha se le agrega un monto exponencial por cada día.

        Sistema de multas ✅
            route: /rents/:id_rent
            metodo: PUT
            Authorization: `Bearer ${token}` 
            req.params
                { "message": "The movie was returned",
                  "price": 100}
            helper : rentPrice.js

    5-Sistema de favoritos: Los usuarios pueden registrar qué películas son sus favoritas y opcionalmente dejar una pequeña reseña

        Agregar favoritos ✅
            route: /favorites/:code
            metodo: POST
            Authorization: `Bearer ${token}` 
            req.body
            {
                "review":"I absolutely adore all of the Ghibli films that I've seen, especially Howl's Moving Castle."
            }
            res.body:{Movie Added to Favorites}
            
            
            
         Listar favoritos ✅
            route: /favorites
            metodo: Get
            Authorization: `Bearer ${token}` 
            res.body:[Array con todos los favoritos de ese usuario]
            
            
<<<<<<< HEAD
        
=======
        
>>>>>>> f3f160c0483a78c20a0d6d8d28bfcbaf63de793b
