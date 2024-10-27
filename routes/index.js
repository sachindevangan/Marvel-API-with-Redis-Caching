import marvelRoutes from './marvel.js'

const constructorMethod = (app) =>{
    app.use('/api', marvelRoutes);

    app.use("*",(req, res) =>{
        res.status(404).json({error : "Route Not Found"});
    });
};

export default constructorMethod;