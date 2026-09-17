function Reservas(){

return(

<section className="reservas">

<h2>Reserva tu entrenamiento</h2>

<input type="text" placeholder="Nombre"/>

<select>

<option>Selecciona clase</option>
<option>Crossfit</option>
<option>Cardio</option>
<option>Pesas</option>

</select>

<input type="date"/>

<button>Reservar</button>

</section>

)

}

export default Reservas;