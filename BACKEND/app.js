
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');




//accessing my .env
require('dotenv/config');

// const authjwt = require('./security/jwt');
// const errorHandler = require('./security/error-handler');


app.use(cors());
app.options('*', cors())

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
// app.use(authjwt());
// app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + 'public/uploads'));

 const api = process.env.API_URL;
//routes
 const productsRoutes = require('./routes/products');
 const usersRoutes = require('./routes/users');
 const ordersRoutes = require('./routes/orders');
 const categoriesRoutes = require('./routes/categories');








 app.use(`${api}/products`, productsRoutes);
 app.use(`${api}/users`, usersRoutes);
 app.use(`${api}/orders`, ordersRoutes);
 app.use(`${api}/categories`, categoriesRoutes);





 //connection for mongodb lesson 17 if any error
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Database connection is ready...')
})
.catch((err)=>{
    console.log(err);
})

app.listen(4200, ()=> {
    
   console.log(api);
    console.log('server is running...... http://localhost:4200')
})

