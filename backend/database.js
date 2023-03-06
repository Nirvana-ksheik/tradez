import {connect, set} from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

function connectDB() {
    
    set('strictQuery', true);
    connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
     })
     .then(()=> {console.log('Connected to the database.')
     })
     .catch((err)=>{console.log('Failed to connect to Database error:' + err)
     });
}

export {connectDB}