const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = 8000;

const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(express.json());   
app.use(cookieParser());        
app.use(express.urlencoded({ extended: true }));

require('./config/mongoose.config');
require('./routes/customer.routes')(app);

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});