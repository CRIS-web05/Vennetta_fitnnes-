import translations from "../translations";
import "../styles/footer.css";

function Footer({ selectedLanguage }){

const locale = selectedLanguage?.code || "es";
const t = translations[locale]?.footer || translations.en.footer || translations.es.footer;
const year = new Date().getFullYear();

return(

<footer className="footer">

<p>
© {year} VENDETTA FITNESS. {t.rightsReserved}
</p>

</footer>

)

}

export default Footer;