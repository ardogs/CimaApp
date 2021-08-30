const fs =  require('fs');
const axios = require('axios');

class Busquedas{

    historial = [];

    pathDB = './db/database.json';

    constructor(){
        //TODO: leer db si existe
        this.leerBD();
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.slice( 1 )  );

            return palabras.join( ' ' );
        })
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit' : 5,
            'language' : 'es'
        }
    }

    async ciudad( lugar = '' ){

        try {
            //Peticion http
             const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
             });
             
            const resp = await instance.get();
            
            return resp.data.features.map(({ id, place_name, center  }) => {
                return {
                    id,
                    nombre: place_name,
                    lng: center[0],
                    lat: center[1]
                }
            })
           // return []; //retornar los lugares que coincidan
            
        } catch (error) {
            console.log('Error');
            return []; //retornar los lugares que coincidan
            
        }

    }

    get paramsWeather(){
        return{
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async climaLugar( lat, lon ) {

        try {

            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsWeather, lat, lon }
            });

            const resp = await instance.get();

            const { weather, main } = resp.data;
            const { description } = weather[0];
            const { temp_min, temp_max, temp } =  main ;

            return {
                desc: description,
                min: temp_min,
                max: temp_max,
                temp: temp
            };        
        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial( lugar = '' ){
        //Eviatar duplicidad

        if( this.historial.includes( lugar.toLowerCase() ) )
            return;

        this.historial = this.historial.splice( 0, 5 );
        this.historial.unshift( lugar.toLowerCase() ) ;

        //Grabar en BD
        this.guardarBD();
    }

    guardarBD(){

        const payload = {
            historial: this.historial
        }
        fs.writeFileSync( this.pathDB, JSON.stringify( payload ));

    }

    leerBD(){
        if( fs.existsSync( this.pathDB ) ){
            const info =  fs.readFileSync( this.pathDB, { encoding: 'utf-8' })
            const data = JSON.parse( info );

            
            data.historial.forEach(element => {
               this.historial.push( element )
            });
            
        }
    }
}

module.exports =  Busquedas;