//Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

//variable para modo edicion
let editando;

//Clases
class Citas{
    constructor(){
        this.citas = []; //creamos un arreglo, porque vamos a poder almacernar VARIOS OBJETOS, por eso sera un ARRAY DE OBJETOS
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita]
        console.log(this.citas);
    }

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id); //filtrame todas las que NO SEAN ESE ID de parametro
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
        // ? significa que en caso de que sean iguales el objeto completo pasa a ser citaActualizada, se reescribe el objeto
        // : caso contrario vamos a retornar la cita actual en cada iteracion/ lo mantenemos
    }
}

class UI{
    imprimirAlerta(mensaje, tipo){
        //Crear el Div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar clases segun el tipo
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success')
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Agregando al HTML
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //Quitando la alerta despues de 4 segundos
        setTimeout(()=>{
            divMensaje.remove();
        }, 4000)
    }

    imprimirCitas({citas}){ //asi tambien podemos hacer destructuring, desde el parametro, para poder acceder el arreglo de citas
        //si solo le dejamos citas sin el destrcuturing, tendriamos que usar citas.citas probablemente, hay citas dentro de citas
        //En la consola se veria Citas{citas:Array(1)}
        //Osease (el objeto)AdminitrarCitas: {citas:[{}]} algo asi
        //Por eso extraemos citas (lo que esta dentro de administrarCitas) quedando solo citas:[{}] y ahora pudiendo usar el 
        //metodo forEach
        //queando algo similar a esto:
        //const citas = [{nombre:'Jesus'}, {nombre: 'Eduardo'}]
        //citas.forEach(cita => {
        //   console.log(cita.nombre)
        // })
        console.log(citas);
        this.limpiarHTML(); //se pone this, es para llamar elementos dentro de la clase
        citas.forEach(cita =>{ //cita ahora va a iterar sobre el objeto de citas, este tiene dentro como puedes ver en el console.log
            //de la linea de arriba, contiene fecha hora id mascota propietario, etc..
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita; //entonces podemos extraerlos de ese objeto
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            //Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
            <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class="font-weight-bolder">Telefono: </span> ${telefono}
            `

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class="font-weight-bolder">Hora: </span> ${hora}
            `

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
            `

            //Boton para eliminar esta cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`;

            btnEliminar.onclick = ()=> eliminarCita(id); //este llama a la funcion eliminarCita en la ventana global, NO LA CLASE

            //Boton para editar la cita
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = `
            Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
            `
            btnEditar.onclick = () => cargarEdicion(cita);//le pasamos como argumento la cita completa, la que declaramos en este
            //forEach

            //Agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        })
    }
    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    };
}

//Instancias
const ui = new UI();
const administrarCitas = new Citas();

//Registrar eventos
eventListeners();
function eventListeners(){
    mascotaInput.addEventListener('change', datosCita);
    propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    sintomasInput.addEventListener('change', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

//Objeto con la informacion de la cita
const citaObj = {
    mascota : '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}


//Agregar datos al objeto de cita
function datosCita(e){
    //TENEMOS QUE TENER EL NAME
    citaObj[e.target.name] = e.target.value; //para que esto funciona, el NAME, tiene que ser igual escrito que el que tenemos en el 
    //OBJETO citaObj, osease el name='mascota' en el html tiene que tener como propiedad en el objeto 'mascota'
    console.log(citaObj);
}

//Valida y agrega una nueva cita a la clase de citas
function nuevaCita(e){
    e.preventDefault();

    //Extraer la informacion del objeto de citaObj
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;
    
    //Validar
    if( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if(editando){
        ui.imprimirAlerta('Editado Correctamente');

        //Pasar el objeto de la cita edicion, en este punto el objeto global ya se edito
        administrarCitas.editarCita({...citaObj});

        //Regresando el texto original
        formulario.querySelector('button[type="submit"]').textContent = 'CREAR CITA';

        //Quitando el modo edicion
        editando = false;
        

    }else{
        //Generar un ID unico
        citaObj.id = Date.now(); //le agregamos al objeto global un ID
        console.log(citaObj);

        //Creando una nueva cita    
        administrarCitas.agregarCita({...citaObj}); //esto es para que no se sobreescriba/duplique el objeto,
        //ya que si solo dejamos administrarCitas.agregarCita(citaObj); si agregamos primero mascota y luego mascota 2
        //el objeto tendra 2 mascota 2, se va a sobreescribir, en vez de acceder al valor global, accedemos a la COPIA

        //Mas explicacion: si solo dejamos administrarCitas.agregarCita(citaObj); el objeto sera pasado POR REFERENCIA
        //osea apuntara al mismo lugar de memoria y al modificarse, modificara los valores anteriores, para eso
        //usamos el SPREAD OPERATOR CON LOS {}, para poder hacer una COPIA Y QUE CADA NUEVO VALOR TENGA SU PROPIO LUGAR
        //EN MEMORIA

        //Mensaje de agregado correctamente
        ui.imprimirAlerta('Se agrego correctamente'); //Nota: aqui la funcion imprimirAlerta tiene 2 parametros(mensaje,tipo), pero
        //aqui en el argumento solo se lleno 1, si se llena solo 1, el segundo, que en este caso es tipo, si no se especifica
        //que es error, entonces es que esta bien, esto por el if(error) else... 
    }

        //Mostrar el HTML de las citas
        ui.imprimirCitas(administrarCitas);

    //Estos de abajo se fueron para arriba por el modo edicion
    // //Generar un ID unico
    // citaObj.id = Date.now();

    // //Creando una nueva cita    
    // administrarCitas.agregarCita({...citaObj}); //esto es para que no se sobreescriba/duplique el objeto,
    // //ya que si solo dejamos administrarCitas.agregarCita(citaObj); si agregamos primero mascota y luego mascota 2
    // //el objeto tendra 2 mascota 2, se va a sobreescribir, en vez de acceder al valor global, accedemos a la COPIA

    //Reiniciar el objeto para la validacion
    reiniciarObjeto(); //esto se hace porque si le damos click a crear cita, el formulario se reinicia y teniendo todos los campos
    //vacios si le volvemos a dar click con los campos vacios, nos generara otro objeto, para eso es esta funcion, porque sigue
    //teniendo valores el objeto

    //Reinicia el formulario
    formulario.reset();
}

//Reiniciando el Objeto
function reiniciarObjeto(){
    citaObj.mascota = '',
    citaObj.propietario = '',
    citaObj.telefono = '',
    citaObj.fecha = '',
    citaObj.hora = '',
    citaObj.sintomas = ''
}

function eliminarCita(id){
    //Eliminar la cita
    administrarCitas.eliminarCita(id); //este llama a la funcion de eliminarCita EN LA CLASE
    //Muestre un mensaje
    ui.imprimirAlerta('La cita se elimino correctamente')
    //Refrescar las citas
    ui.imprimirCitas(administrarCitas);
}

//Cargar los datos y el modo edicion
function cargarEdicion(cita){ //Se le pasa la cita completa DE ESE ELEMENTO AL QUE SE LE DIO CLICK, al parecer
    //onclick sabe a cual elemento se le dio click, lo podemos comprobar en la consola mandando el parametro
    console.log(cita);
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    //Llenar los inputs
    mascotaInput.value = mascota; //esto es para que cuando le den click en editar, se llene los campos con lo que teniamos
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Llenar el objeto
    //Esto es para que al guardando de nuevo no nos salga 'todos los campos son obligatorios', tenemos que llenar el objeto
    //global que tenemos
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;
}