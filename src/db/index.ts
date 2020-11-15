import mongoose from 'mongoose';

// Connect to database
mongoose.connect(
    process.env.DB_CONNECTION || 'mongo://localhost:27017/luciana',
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    () => (console.log('Successfully connected to MongoDB.'))
);

export default mongoose;