import React from 'react';
import '../styles/global-map.css';

function GlobalMap() {
  return (
    <div className="global-mapa-container" id="mapa">
      <h2>¿Dónde estamos ubicados?</h2>
      <p className="global-mapa-direccion">
        📍 Ubicado en: <br/>
        Av. 13 de junio y Av. Equinoccial.<br/>
        Vendetta Fitness Industry (Matriz)<br/> 
        (Tercer y Cuarto piso Edificio Equinoccial Center)
      </p>

      <div className="global-mapa-wrapper">
        <iframe
          title="ubicacion-gym"
          src="https://www.google.com/maps?q=VENDETTA+Fitness+Industry+Quito&output=embed"
          width="100%"
          height="400"
          style={{border:0}}
          allowFullScreen=""
          loading="lazy"
        />
      </div>

      {/* TEXTO INFORMATIVO DE SUCURSALES (Abajo del mapa) */}
      <div className="global-mapa-anuncio" style={{ marginTop: '40px', textAlign: 'center', color: '#ccc', lineHeight: '1.6', fontSize: '18px', padding: '0 20px' }}>
        <h3 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px', textShadow: '0 0 10px rgba(255,0,0,0.8)' }}>
          🚧 ¡Próximamente en Vendetta Fitness Industry! 🚧
        </h3>
        
        <p style={{ marginBottom: '20px' }}>Muy pronto anunciaremos la ubicación de nuestras nuevas sucursales.</p>
        
        <p style={{ fontWeight: 'bold', color: '#fff' }}>✨ Prepárate para vivir la experiencia Vendetta en más lugares.</p>
        <p style={{ color: 'red', fontWeight: 'bold', fontSize: '20px', marginBottom: '5px', textShadow: '0 0 5px rgba(255,0,0,0.5)' }}>
          🔥 ¡ESTO RECIÉN COMIENZA! 🔥
        </p>
      </div>
    </div>
  );
}

export default GlobalMap;
