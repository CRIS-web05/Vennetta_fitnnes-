import translations from "../translations";
import "../styles/redes.css";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";

function Redes({ selectedLanguage }){
  const locale = selectedLanguage?.code || "es";
  const t = translations[locale]?.redes || translations.en.redes || translations.es.redes;

return(

<div className="redes-fijas">

<a
href="https://www.instagram.com/vendettafitness.oficial/"
target="_blank"
rel="noreferrer"
className="btn-flotante btn-social"
>
<FaInstagram /> <span>{t.followUs}</span>
</a>

<a
href="https://www.facebook.com/vendettafitness/?locale=es_LA"
target="_blank"
rel="noreferrer"
className="btn-flotante btn-social"
>
<FaFacebook /> <span>{t.followUs}</span>
</a>

<a
href="https://www.tiktok.com/@vendettafitness_edu"
target="_blank"
rel="noreferrer"
className="btn-flotante btn-social"
>
<FaTiktok /> <span>{t.followUs}</span>
</a>

<a
href="https://wa.me/5930979243837"
target="_blank"
rel="noreferrer"
className="btn-flotante btn-contacto"
>
<FaWhatsapp /> <span>{t.contactUs}</span>
</a>

</div>

)

}

export default Redes;