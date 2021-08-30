const inquirer =  require( 'inquirer' ) ;
require( 'colors' );

const preguntas = [
    {
        type:       'list',
        name:       'opcion',
        message:    '¿Qué desea hacer?',
        choices:    [ 
            {   value: 1, name: `${'1.'.green} Buscar Ciudad` },
            {   value: 2, name: `${'2.'.green} Historial` },
            {   value: 0, name: `${'0.'.green} Salir` }
         ] 
    }
];


const inquirerMenu = async() => {
    console.clear();
    console.log('========================'.green) ;
    console.log(' Seleccione una opción'.white) ;
    console.log('========================\n'.green) ;

    const { opcion } = await inquirer.prompt( preguntas ) ;
    return opcion ;
}

const pausa = async() => {
    const preguntas = [{
        type: 'input',
        name: 'enter',
        message: `Presione ${ 'ENTER'.green } para continuar`,
    }];

    console.log('\n');
    await inquirer.prompt( preguntas );
}

const leerInput = async( message ) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                return (value.length === 0 ) ? 'Por favor ingrese un valor' : true ;
            }

        }
    ];

    const { desc } = await inquirer.prompt( question );

    return desc ;
}

const listarLugares = async( lugares = [] ) => {

    const choices = lugares.map( (lugar, i) => {
        const idx = `${ i + 1 }`.green;
        return {
            value: lugar.id,
            name: `${idx}. ${lugar.nombre}`
        }
    });

    const preguntas = [
        {
            type:       'list',
            name:       'id',
            message:    'Seleccione lugar',
            choices 
        }
    ];

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });
    
    const { id } = await inquirer.prompt( preguntas ) ;
    return id ;
}

const confirmar = async( message ) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt( question ) ;
    return ok;
}


const mostrarListadoCheckList = async( tareas = [] ) => {

    const choices = tareas.map( (tarea, i) => {
        const idx = `${ i + 1 }`.green;
        return {
            value: tarea.id,
            name: `${idx}. ${tarea.desc}`,
            checked: ( tarea.completadoEn ) ?  true :  false 
        }
    });

    const pregunta = [
        {
            type:       'checkbox',
            name:       'ids',
            message:    'Selecione',
            choices 
        }
    ];
    
    const { ids } = await inquirer.prompt( pregunta ) ;
    return ids ;
}

module.exports = {
    inquirerMenu,
    pausa, 
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}

