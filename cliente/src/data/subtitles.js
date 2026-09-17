const subtitlesData = {
  hero: {
    es: "VENDETTA FITNESS • Te va a doler pero te va a gustar • Entrena con los mejores profesionales.",
    en: "VENDETTA FITNESS • It will hurt, but you will love it • Train with top professionals.",
    pt: "VENDETTA FITNESS • Vai doer, mas você vai adorar • Treine com os melhores profissionais.",
    fr: "VENDETTA FITNESS • Ça va faire mal mais vous allez adorer • Entraînez-vous avec les meilleurs.",
    de: "VENDETTA FITNESS • Es wird wehtun, aber du wirst es lieben • Trainiere mit den Besten.",
  },
  powerlifting: {
    es: "Atleta de Alto Rendimiento Luis Caiza ejecutando levantamiento con 235 kg en sobrecarga progresiva.",
    en: "High Performance Athlete Luis Caiza executing a 235 kg powerlift with progressive overload.",
    pt: "Atleta de Alto Rendimento Luis Caiza executando levantamento com 235 kg em sobrecarga progressiva.",
    fr: "L'athlète de haut niveau Luis Caiza réalise un soulevé de 235 kg en surcharge progressive.",
    de: "Leistungssportler Luis Caiza führt ein 235 kg Kniebeugen/Kreuzheben mit progressiver Überlastung aus.",
  },
  soccer: {
    es: "Equipo de fútbol profesional optimizando velocidad y rendimiento en las instalaciones de Vendetta Fitness.",
    en: "Professional soccer team optimizing speed and performance at Vendetta Fitness facilities.",
    pt: "Equipe de futebol profissional otimizando velocidade e desempenho nas instalações da Vendetta Fitness.",
    fr: "Équipe de football professionnelle optimisant sa vitesse et sa performance chez Vendetta Fitness.",
    de: "Profifußballteam zur Geschwindigkeits- und Leistungsoptimierung bei Vendetta Fitness.",
  },
  martial: {
    es: "Sensei David Cucuyo Espinoza formando la nueva generación de campeones en artes marciales.",
    en: "Sensei David Cucuyo Espinoza shaping the next generation of martial arts champions.",
    pt: "Sensei David Cucuyo Espinoza formando a nova geração de campeões em artes marciais.",
    fr: "Sensei David Cucuyo Espinoza forme la nouvelle génération de champions d'arts martiaux.",
    de: "Sensei David Cucuyo Espinoza bildet die nächste Generation von Kampfsport-Champions aus.",
  },
  recovery: {
    es: "Entrenamiento de recuperación post-lesión y trabajo explosivo para atletas de alto rendimiento.",
    en: "Post-injury recovery training and explosive agility drills for high-performance athletes.",
    pt: "Treino de recuperação pós-lesão e agilidade explosiva para atletas de alto rendimento.",
    fr: "Entraînement de récupération post-blessure et exercices d'agilité explosive pour athlètes.",
    de: "Rehabilitationstraining nach Verletzungen und explosives Agilitätstraining für Leistungssportler.",
  },
  inauguration: {
    es: "Inauguración oficial de Vendetta Fitness • 6 de junio de 2025 • Transformando vidas desde el día uno.",
    en: "Official inauguration of Vendetta Fitness • June 6, 2025 • Transforming lives since day one.",
    pt: "Inauguração oficial do Vendetta Fitness • 6 de junho de 2025 • Transformando vidas desde o primeiro dia.",
    fr: "Inauguration officielle de Vendetta Fitness • 6 juin 2025 • Transformer des vies depuis le premier jour.",
    de: "Offizielle Eröffnung von Vendetta Fitness • 6. Juni 2025 • Leben verändern vom ersten Tag an.",
  },
  festividad: {
    es: "Comunidad y familia Vendetta Fitness celebrando logros, constancia y superación conjunta.",
    en: "Vendetta Fitness community celebrating shared achievements, discipline, and personal growth.",
    pt: "Comunidade Vendetta Fitness celebrando conquistas, disciplina e superação conjunta.",
    fr: "Communauté Vendetta Fitness célébrant la réussite collective et le dépassement de soi.",
    de: "Vendetta Fitness Community feiert gemeinsame Erfolge, Disziplin und persönliches Wachstum.",
  }
};

export const getSubtitlesForVideo = (videoKey, locale = 'es') => {
  const lang = typeof locale === 'string' ? locale : (locale?.code || 'es');
  const entry = subtitlesData[videoKey] || subtitlesData.hero;
  return entry[lang] || entry.en || entry.es;
};

export default subtitlesData;
