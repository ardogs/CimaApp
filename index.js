require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/enquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {


    let opt = null;
    const busquedas =  new Busquedas();

    

    

    do {

        opt =  await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje

                const lugar = await leerInput('Ciudad: ')
                const lugares = await busquedas.ciudad( lugar );
                const id = await listarLugares( lugares )
                if( id === '0' ) continue;
                const lugarSel = lugares.find( lugar => lugar.id === id )
            
                // console.log(lugarSel)
                //Buscar los lugares
                //Seleccionar el lugar
                //Clima
                //Mostrar resultados

                const { nombre, lng, lat } = lugarSel ;
                busquedas.agregarHistorial( nombre );

                const clima = await busquedas.climaLugar( lat, lng );

                console.clear();

                console.log('\nInformación de la ciudad\n'.green) ;
                console.log('Ciudad: '.green, nombre) ;
                console.log('Lat:'.green, lat) ;
                console.log('Lng:'.green, lng) ;
                console.log('Temperatura:'.green, clima.temp + ' °C') ;
                console.log('Mínima:'.green, clima.min + ' °C') ;
                console.log('Máxima:'.green, clima.max + ' °C');
                console.log('Estado del clima:'.green, clima.desc) ;
            break;
            
            case 2:
                busquedas.historialCapitalizado.forEach( ( lugar, i ) => {
                    const idx = `${i + 1}.`.green ; 
                    console.log( `${ idx } ${ lugar }` ) ;
                })
            break;
        }

        (opt !== 0) && await pausa();
        
    } while (opt != 0);

    
    

}

main();