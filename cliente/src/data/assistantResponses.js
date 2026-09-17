const assistantResponses = {
  es: {
    ui: {
      label: "Asistente IA",
      title: "Asistente IA",
      placeholder: "Escribe tu pregunta...",
      send: "Enviar",
      close: "Cerrar asistente"
    },
    keywords: {
      location: ["ubicacion", "ubicación", "direccion", "dirección", "donde", "encuentran", "queda", "lugar", "sede", "como llegar", "¿donde están ubicados?", "sector", "zona", "como_llegar", "mapa", "localizacion", "localización", "donde queda", "donde estan", "dirección exacta", "como voy", "gps", "sucursal", "sucursales"],
      phone: ["telefono", "teléfono", "numero", "número", "contacto", "¿cual es el número?", "whatsapp", "movil", "móvil", "celular", "llamar", "llamada", "escribir", "escribenos", "llamanos", "hablar con alguien", "soporte", "ayuda", "atencion", "atención", "comunicarse", "tienen whatsapp"],
      memberships: ["membresia", "membresía", "membresias", "membresías", "plan", "precio", "costo", "suscripcion", "suscripción", "planes", "precios", "costos", "cuanto cuesta", "cuanto vale", "valor", "tarifa", "tarifas", "mensualidad", "mensual", "anual", "anualidad", "pagar", "inscripcion", "inscripción", "matricula", "matrícula", "promocion", "promoción", "descuento", "pase diario", "clase gratis"],
      schedule: ["horario", "hora", "abren", "cronograma", "cierre", "tiempo", "calendario", "apertura", "dias", "días", "horarios", "a que hora", "esta abierto", "abierto hoy", "cierran", "fin de semana", "sabado", "domingo", "feriados", "festivos", "mañana", "tarde", "noche", "horas"],
      services: ["servicio", "servicios", "ofrecen", "entrenamiento", "clases", "asistencia", "oferta", "productos", "actividades", "disciplinas", "maquinas", "máquinas", "gimnasio", "gym", "rutina", "rutinas", "entrenador", "entrenadores", "coach", "funcional", "pesas", "cardio", "que hacen"],
      password: ["contraseña", "password", "recuperar", "clave", "contrasena", "olvide", "olvidé", "cambiar", "restablecer", "no puedo entrar", "bloqueada", "cuenta", "login", "iniciar sesion", "iniciar sesión", "acceso", "ingresar", "error", "usuario", "token", "codigo", "código"]
    },
    greeting: "¡Hola! 💪 Soy tu asistente virtual de **Vendetta Fitness Industry**. Estoy aquí para ayudarte a alcanzar tus metas. ¿Qué te gustaría consultar hoy? (Ubicación, horarios, planes...)",
    location: "📍 **¡Visítanos!** Estamos ubicados en Quito, Ecuador, en el sector de la Mitad del Mundo.\n🏢 **Dirección:** Av. 13 de Junio y Av. Equinoccial (Tercer y Cuarto piso del Edificio Equinoccial Center). ¡Te esperamos!",
    phone: "📞 Puedes comunicarte directamente con nuestro equipo de atención o escribirnos por WhatsApp al **+593 98 772 9737**. ¡Estaremos gustosos de ayudarte!",
    memberships: "💵 **Nuestros Planes:**\nContamos con opciones flexibles que se adaptan a tu ritmo: Diario, Plan JABA, Mensual, Trimestral y Anual. 🏋️‍♂️\n\n¿Te gustaría que un asesor te detalle los precios de alguno en específico?",
    schedule: "🕒 **Horarios de Atención:**\n• 🗓️ **Lunes a Viernes:** 06:00 a 14:00 y de 16:00 a 22:00.\n• 🗓️ **Sábados:** 08:00 a 18:00.\n*(Nota: Cerramos temporalmente de 14:00 a 16:00 de lunes a viernes).*",
    services: "🔥 **Todo lo que te ofrecemos:**\n• 👤 Entrenamientos personalizados\n• 🦾 Máquinas modernas de última generación\n• 🤸 Clases deportivas dinámicas\n• 🍏 Asesoría fitness integral\n• 📜 Certificaciones técnicas",
    password: "🔒 **Recuperación de Cuenta:**\nNo te preocupes, puedes restablecerla fácilmente desde la pantalla de inicio de sesión haciendo clic en **'¿Olvidaste tu contraseña?'** e ingresando tu correo electrónico registrado.",
    accessibility: "♿ Activa el widget de accesibilidad para aumentar el tamaño de letra, ajustar contraste o activar lectura por voz.",
    unknown: "🤔 Lo siento, no logré entender tu consulta. Pero puedo ayudarte con:\n📍 Ubicación\n🕒 Horarios\n💵 Membresías y planes\n🔥 Servicios\n📞 Teléfono de contacto\n\n¿De cuál de estos temas te gustaría saber más?"
  },
  en: {
    ui: {
      label: "AI Assistant",
      title: "AI Assistant",
      placeholder: "Type your question...",
      send: "Send",
      close: "Close assistant"
    },
    keywords: {
      location: ["where", "location", "located", "address", "map", "city", "place", "find"],
      phone: ["phone", "number", "contact", "whatsapp", "call", "help", "support"],
      memberships: ["membership", "memberships", "plan", "plans", "price", "prices", "cost", "pay", "fee"],
      schedule: ["schedule", "hours", "open", "time", "days", "weekend", "closing"],
      services: ["service", "services", "offer", "training", "classes", "gym", "machines", "coaching"],
      password: ["password", "recover", "forgot", "account", "login", "reset"]
    },
    greeting: "Hello! 💪 I am your **Vendetta Fitness Industry** AI Assistant. I'm here to help you achieve your fitness goals. How can I help you today? (Location, hours, plans...)",
    location: "📍 **Visit us!** We are located in Quito, Ecuador, Mitad del Mundo sector.\n🏢 **Address:** Av. 13 de Junio & Av. Equinoccial (3rd & 4th floor, Equinoccial Center Building). We look forward to seeing you!",
    phone: "📞 You can contact our support team or chat on WhatsApp at **+593 98 772 9737**. We'll be happy to assist you!",
    memberships: "💵 **Our Plans:**\nWe offer flexible plans: Daily, JABA Plan, Monthly, Quarterly, and Annual. 🏋️‍♂️\n\nWould you like more details on specific pricing?",
    schedule: "🕒 **Opening Hours:**\n• 🗓️ **Monday to Friday:** 06:00 - 14:00 & 16:00 - 22:00.\n• 🗓️ **Saturdays:** 08:00 - 18:00.\n*(Note: Temporarily closed 14:00 - 16:00 Mon-Fri).*",
    services: "🔥 **What We Offer:**\n• 👤 Personalized training\n• 🦾 Modern state-of-the-art equipment\n• 🤸 Dynamic sports classes\n• 🍏 Comprehensive fitness consulting\n• 📜 Technical certifications",
    password: "🔒 **Account Recovery:**\nDon't worry! Click **'Forgot your password?'** on the login screen and enter your registered email to reset it.",
    accessibility: "♿ Enable the accessibility widget to enlarge text, adjust contrast, or activate voice reading.",
    unknown: "🤔 I didn't quite catch that. I can help you with:\n📍 Location\n🕒 Hours\n💵 Memberships & Plans\n🔥 Services\n📞 Phone Contact\n\nWhich topic would you like to know more about?"
  },
  pt: {
    ui: { label: "Assistente IA", title: "Assistente IA", placeholder: "Digite sua pergunta...", send: "Enviar", close: "Fechar assistente" },
    keywords: {
      location: ["onde", "localizacao", "endereço", "endereco", "local", "mapa"],
      phone: ["telefone", "numero", "contato", "whatsapp", "ligar"],
      memberships: ["planos", "preco", "preço", "mensalidade", "membresia", "valor"],
      schedule: ["horario", "horários", "aberto", "fechado", "dias"],
      services: ["servico", "serviços", "treino", "aulas", "academia"],
      password: ["senha", "recuperar", "esqueci", "conta"]
    },
    greeting: "Olá! 💪 Sou seu assistente virtual da **Vendetta Fitness Industry**. Como posso ajudar você hoje?",
    location: "📍 **Visite-nos!** Estamos localizados em Quito, Equador, Mitad del Mundo (Av. 13 de Junio e Av. Equinoccial).",
    phone: "📞 Entre em contato via WhatsApp no **+593 98 772 9737**.",
    memberships: "💵 **Nossos Planos:** Oferecemos planos Diário, JABA, Mensal, Trimestral e Anual. 🏋️‍♂️",
    schedule: "🕒 **Horários:** Segunda a Sexta: 06:00-14:00 e 16:00-22:00. Sábados: 08:00-18:00.",
    services: "🔥 Treinamento personalizado, equipamentos modernos, aulas dinâmicas e assessoria fitness.",
    password: "🔒 Para recuperar sua senha, clique em 'Esqueceu sua senha?' na tela de login.",
    accessibility: "♿ Use o widget de acessibilidade para ajustar o tamanho do texto e contraste.",
    unknown: "🤔 Posso ajudar você com: Localização, Horários, Planos, Serviços e Contato."
  },
  fr: {
    ui: { label: "Assistant IA", title: "Assistant IA", placeholder: "Posez votre question...", send: "Envoyer", close: "Fermer l'assistant" },
    keywords: {
      location: ["ou", "où", "adresse", "localisation", "carte", "lieu"],
      phone: ["telephone", "téléphone", "contact", "whatsapp", "numero"],
      memberships: ["prix", "tarif", "abonnement", "plan", "cout"],
      schedule: ["horaire", "heures", "ouvert", "fermé", "jours"],
      services: ["service", "services", "entrainement", "cours", "gym"],
      password: ["mot de passe", "oublié", "recuperer", "compte"]
    },
    greeting: "Bonjour! 💪 Je suis l'assistant virtuel de **Vendetta Fitness Industry**. Comment puis-je vous aider?",
    location: "📍 **Rendez-nous visite!** Situé à Quito, Équateur, secteur Mitad del Mundo (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 Contactez-nous sur WhatsApp au **+593 98 772 9737**.",
    memberships: "💵 **Nos abonnements:** Plans journalier, JABA, mensuel, trimestriel et annuel. 🏋️‍♂️",
    schedule: "🕒 **Horaires:** Lun-Ven: 06:00-14:00 & 16:00-22:00. Samedi: 08:00-18:00.",
    services: "🔥 Coaching personnalisé, équipements modernes, cours collectifs et conseils fitness.",
    password: "🔒 Cliquez sur 'Mot de passe oublié?' sur l'écran de connexion.",
    accessibility: "♿ Activez le widget d'accessibilité pour ajuster la taille du texte et le contraste.",
    unknown: "🤔 Je peux vous renseigner sur: Adresse, Horaires, Abonnements, Services et Contact."
  },
  de: {
    ui: { label: "KI-Assistent", title: "KI-Assistent", placeholder: "Stelle deine Frage...", send: "Senden", close: "Assistent schließen" },
    keywords: {
      location: ["wo", "adresse", "standort", "karte", "ort"],
      phone: ["telefon", "nummer", "kontakt", "whatsapp", "anrufen"],
      memberships: ["preise", "mitgliedschaft", "tarife", "plan", "kosten"],
      schedule: ["zeiten", "öffnungszeiten", "offen", "tage"],
      services: ["angebot", "kurse", "training", "fitness", "geräte"],
      password: ["passwort", "vergessen", "wiederherstellen", "konto"]
    },
    greeting: "Hallo! 💪 Ich bin dein KI-Assistent von **Vendetta Fitness Industry**. Wie kann ich dir helfen?",
    location: "📍 **Besuche uns!** Standortsadresse: Quito, Ecuador, Mitad del Mundo (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 Kontaktiere uns über WhatsApp unter **+593 98 772 9737**.",
    memberships: "💵 **Unsere Tarife:** Tages-, JABA-, Monats-, Quartals- und Jahresmitgliedschaften. 🏋️‍♂️",
    schedule: "🕒 **Öffnungszeiten:** Mo-Fr: 06:00-14:00 & 16:00-22:00. Sa: 08:00-18:00.",
    services: "🔥 Personal Training, moderne Geräte, Fitnesskurse und professionelle Beratung.",
    password: "🔒 Klicke auf 'Passwort vergessen?' auf der Anmeldeseite.",
    accessibility: "♿ Nutzen Sie das Barrierefreiheits-Widget für Schriftgröße und Kontrast.",
    unknown: "🤔 Ich kann dir helfen bei: Standort, Öffnungszeiten, Preisen, Angeboten und Kontakt."
  },
  it: {
    ui: { label: "Assistente IA", title: "Assistente IA", placeholder: "Scrivi la tua domanda...", send: "Invia", close: "Chiudi assistente" },
    keywords: {
      location: ["dove", "indirizzo", "posizione", "dove siamo", "mappa"],
      phone: ["telefono", "numero", "contatto", "whatsapp", "chiamare"],
      memberships: ["prezzi", "abbonamento", "piani", "costo", "tariffe"],
      schedule: ["orari", "orario", "aperto", "giorni"],
      services: ["servizi", "allenamento", "corsi", "palestra"],
      password: ["password", "recupero", "dimenticata", "account"]
    },
    greeting: "Ciao! 💪 Sono l'assistente virtuale di **Vendetta Fitness Industry**. Come posso aiutarti?",
    location: "📍 **Vieni a trovarci!** Siamo a Quito, Ecuador, settore Mitad del Mundo (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 Scrivici su WhatsApp al **+593 98 772 9737**.",
    memberships: "💵 **Piani:** Abbonamenti Giornaliero, JABA, Mensile, Trimestrale e Annuale. 🏋️‍♂️",
    schedule: "🕒 **Orari:** Lun-Ven: 06:00-14:00 e 16:00-22:00. Sabato: 08:00-18:00.",
    services: "🔥 Allenamento personalizzato, macchinari all'avanguardia, corsi dinamici.",
    password: "🔒 Clicca su 'Password dimenticata?' nella pagina di login.",
    accessibility: "♿ Usa il widget di accessibilità per cambiare testo e contrasto.",
    unknown: "🤔 Chiedimi informazioni su: Posizione, Orari, Abbonamenti, Servizi e Contatti."
  },
  ru: {
    ui: { label: "ИИ-Ассистент", title: "ИИ-Ассистент", placeholder: "Задайте ваш вопрос...", send: "Отправить", close: "Закрыть ассистент" },
    keywords: {
      location: ["где", "адрес", "нахождение", "карта", "где находится"],
      phone: ["телефон", "номер", "контакт", "ватсап", "позвонить"],
      memberships: ["цены", "абонемент", "планы", "стоимость", "цена"],
      schedule: ["часы", "график", "открыто", "дни"],
      services: ["услуги", "тренировки", "зал", "тренажеры"],
      password: ["пароль", "забыл", "восстановить", "аккаунт"]
    },
    greeting: "Здравствуйте! 💪 Я ИИ-ассистент **Vendetta Fitness Industry**. Чем могу помочь?",
    location: "📍 **Адрес:** Кито, Эквадор, сектор Mitad del Mundo (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 WhatsApp для связи: **+593 98 772 9737**.",
    memberships: "💵 **Абонементы:** Дневной, JABA, Месячный, Трехмесячный и Годовой. 🏋️‍♂️",
    schedule: "🕒 **График:** Пн-Пт: 06:00-14:00 и 16:00-22:00. Сб: 08:00-18:00.",
    services: "🔥 Персональный тренинг, современные тренажеры, групповые занятия.",
    password: "🔒 Нажмите 'Забыли пароль?' на странице входа.",
    accessibility: "♿ Используйте виджет доступности для настройки контраста и текста.",
    unknown: "🤔 Могу рассказать про: Адрес, График работы, Цены, Услуги и Контакты."
  },
  ja: {
    ui: { label: "AIアシスタント", title: "AIアシスタント", placeholder: "質問を入力してください...", send: "送信", close: "アシスタントを閉じる" },
    keywords: {
      location: ["場所", "住所", "アクセス", "どこ"],
      phone: ["電話", "番号", "連絡", "whatsapp"],
      memberships: ["料金", "プラン", "会費", "価格"],
      schedule: ["営業時間", "時間", "定休日"],
      services: ["サービス", "トレーニング", "マシン"],
      password: ["パスワード", "再設定", "忘れた"]
    },
    greeting: "こんにちは！💪 **Vendetta Fitness Industry** のAIアシスタントです。ご質問をどうぞ！",
    location: "📍 **所在地:** エクアドル・キト、赤道記念碑エリア (Av. 13 de Junio & Av. Equinoccial)。",
    phone: "📞 WhatsAppでお問い合わせ: **+593 98 772 9737**。",
    memberships: "💵 **プラン:** ビジター、JABA、月額、3ヶ月、年額プランをご用意。🏋️‍♂️",
    schedule: "🕒 **営業時間:** 月〜金: 06:00-14:00 & 16:00-22:00。土曜: 08:00-18:00。",
    services: "🔥 パーソナルトレーニング、最新マシン、グループクラス。",
    password: "🔒 ログイン画面の「パスワードをお忘れですか？」より再設定できます。",
    accessibility: "♿ アクセシビリティ調整は画面のボタンから可能です。",
    unknown: "🤔 場所、営業時間、料金プラン、サービス内容、連絡先についてお答えできます。"
  },
  ko: {
    ui: { label: "AI 어시스턴트", title: "AI 어시스턴트", placeholder: "질문을 입력하세요...", send: "전송", close: "어시스턴트 닫기" },
    keywords: {
      location: ["위치", "주소", "어디"],
      phone: ["전화", "번호", "연락처"],
      memberships: ["가격", "요금", "회원권", "플랜"],
      schedule: ["시간", "운영시간", "휴무"],
      services: ["서비스", "트레이닝", "운동"],
      password: ["비밀번호", "찾기", "재설정"]
    },
    greeting: "안녕하세요! 💪 **Vendetta Fitness Industry** AI 어시스턴트입니다. 무엇을 도와드릴까요?",
    location: "📍 **위치:** 키토, 에콰도르 (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 WhatsApp 문의: **+593 98 772 9737**.",
    memberships: "💵 **회원권:** 일일권, JABA, 월간, 3개월, 연간 플랜 제공. 🏋️‍♂️",
    schedule: "🕒 **운영시간:** 월-금: 06:00-14:00 & 16:00-22:00. 토: 08:00-18:00.",
    services: "🔥 개인 트레이닝, 최첨단 기구, 그룹 클래스.",
    password: "🔒 로그인 화면의 '비밀번호를 잊으셨나요?'를 클릭하세요.",
    accessibility: "♿ 접근성 위젯을 통해 글자 크기 및 대비를 조절할 수 있습니다.",
    unknown: "🤔 위치, 운영시간, 회원권, 서비스, 연락처에 대해 문의해 주세요."
  },
  zh: {
    ui: { label: "AI 助手", title: "AI 助手", placeholder: "请输入您的问题...", send: "发送", close: "关闭助手" },
    keywords: {
      location: ["地址", "位置", "在哪"],
      phone: ["电话", "联系", "号码", "whatsapp"],
      memberships: ["价格", "会员", "套餐", "费用"],
      schedule: ["营业时间", "时间", "几点"],
      services: ["服务", "训练", "健身", "课程"],
      password: ["密码", "找回", "重置"]
    },
    greeting: "您好！💪 我是 **Vendetta Fitness Industry** 的 AI 助手。请问有什么可以帮您？",
    location: "📍 **地址:** 厄瓜多尔基多 Mitad del Mundo 区 (Av. 13 de Junio & Av. Equinoccial)。",
    phone: "📞 WhatsApp 联系电话: **+593 98 772 9737**。",
    memberships: "💵 **会员套餐:** 单日卡、JABA卡、月卡、季卡和年卡。🏋️‍♂️",
    schedule: "🕒 **营业时间:** 周一至周五: 06:00-14:00 & 16:00-22:00。周六: 08:00-18:00。",
    services: "🔥 私人教练指导、顶级健身器材、动态团体课程。",
    password: "🔒 请在登录页面点击“忘记密码？”进行重置。",
    accessibility: "♿ 可使用无障碍小工具调整字体与对比度。",
    unknown: "🤔 您可以询问：位置地址、营业时间、会员价格、服务项目与联系方式。"
  },
  ar: {
    ui: { label: "مساعد الذكاء الاصطناعي", title: "مساعد الذكاء الاصطناعي", placeholder: "اكتب سؤالك هنا...", send: "إرسال", close: "إغلاق المساعد" },
    keywords: {
      location: ["اين", "أين", "موقع", "عنوان"],
      phone: ["هاتف", "رقم", "تواصل", "واتساب"],
      memberships: ["سعر", "أسعار", "اشتراك", "عضوية"],
      schedule: ["أوقات", "ساعات", "مواعيد", "مفتوح"],
      services: ["خدمات", "تدريب", "تمارين"],
      password: ["كلمة السر", "استعادة", "نسيت"]
    },
    greeting: "مرحباً! 💪 أنا مساعدك الافتراضي في **Vendetta Fitness Industry**. كيف يمكنني مساعدتك اليوم؟",
    location: "📍 **الموقع:** كيتو، إكوادور (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 تواصل معنا عبر واتساب: **+593 98 772 9737**.",
    memberships: "💵 **الاشتراكات:** يومي، JABA، شهري، ثلاثي الأشهر، وسنوي. 🏋️‍♂️",
    schedule: "🕒 **المواعيد:** الاثنين - الجمعة: 06:00-14:00 و 16:00-22:00. السبت: 08:00-18:00.",
    services: "🔥 تدريب شخصي، أجهزة حديثة، وحصص رياضية متنوعة.",
    password: "🔒 انقر على 'نسيت كلمة السر؟' في صفحة تسجيل الدخول.",
    accessibility: "♿ يمكنك استخدام أداة إمكانية الوصول لتعديل الخط والتباين.",
    unknown: "🤔 يمكنني مساعدتك في: العنوان، المواعيد، الاشتراكات، الخدمات، ورقم التواصل."
  },
  hi: {
    ui: { label: "एआई सहायक", title: "एआई सहायक", placeholder: "अपना प्रश्न लिखें...", send: "भेजें", close: "सहायक बंद करें" },
    keywords: {
      location: ["कहाँ", "पता", "स्थान"],
      phone: ["फोन", "नंबर", "संपर्क"],
      memberships: ["कीमत", "प्लान", "सदस्यता"],
      schedule: ["समय", "समय-सारणी", "खुला"],
      services: ["सेवाएं", "ट्रेनिंग", "जिम"],
      password: ["पासवर्ड", "भूल गया", "रीसेट"]
    },
    greeting: "नमस्ते! 💪 मैं **Vendetta Fitness Industry** का एआई सहायक हूँ। मैं आपकी क्या मदद कर सकता हूँ?",
    location: "📍 **पता:** किटो, इक्वाडोर (Av. 13 de Junio & Av. Equinoccial)।",
    phone: "📞 WhatsApp संपर्क: **+593 98 772 9737**।",
    memberships: "💵 **सदस्यता प्लान:** दैनिक, JABA, मासिक, त्रैमासिक और वार्षिक। 🏋️‍♂️",
    schedule: "🕒 **समय:** सोम-शुक्र: 06:00-14:00 और 16:00-22:00। शनिवार: 08:00-18:00।",
    services: "🔥 पर्सनल ट्रेनिंग, आधुनिक उपकरण और स्पोर्ट्स क्लासेस।",
    password: "🔒 लॉगिन स्क्रीन पर 'पासवर्ड भूल गए?' पर क्लिक करें।",
    accessibility: "♿ एक्सेसिबिलिटी विजेट से फ़ॉन्ट आकार और कंट्रास्ट बदलें।",
    unknown: "🤔 आप पूछ सकते हैं: पता, समय, सदस्यता प्लान, सेवाएं और संपर्क नंबर।"
  },
  nl: {
    ui: { label: "AI Assistent", title: "AI Assistent", placeholder: "Typ je vraag...", send: "Verzenden", close: "Assistent sluiten" },
    keywords: { location: ["waar", "adres", "locatie"], phone: ["telefoon", "nummer", "contact"], memberships: ["prijzen", "lidmaatschap", "tarieven"], schedule: ["tijden", "openingstijden"], services: ["diensten", "training"], password: ["wachtwoord", "vergeten"] },
    greeting: "Hallo! 💪 Ik ben je **Vendetta Fitness Industry** AI-assistent. Hoe kan ik je helpen?",
    location: "📍 **Adres:** Quito, Ecuador, Mitad del Mundo (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 WhatsApp: **+593 98 772 9737**.",
    memberships: "💵 **Abonnementen:** Dagkaart, JABA, Maandelijks, Driemaandelijks en Jaarlijks.",
    schedule: "🕒 **Openingstijden:** Ma-Vr: 06:00-14:00 & 16:00-22:00. Za: 08:00-18:00.",
    services: "🔥 Personal training, moderne apparatuur en groepslessen.",
    password: "🔒 Klik op 'Wachtwoord vergeten?' op de inlogpagina.",
    accessibility: "♿ Gebruik de toegankelijkheidswidget voor grotere tekst en contrast.",
    unknown: "🤔 Vraag mij over: Locatie, Openingstijden, Prijzen, Diensten en Contact."
  },
  sv: {
    ui: { label: "AI-Assistent", title: "AI-Assistent", placeholder: "Skriv din fråga...", send: "Skicka", close: "Stäng assistent" },
    keywords: { location: ["var", "adress", "plats"], phone: ["telefon", "nummer", "kontakt"], memberships: ["priser", "medlemskap", "planer"], schedule: ["tider", "öppettider"], services: ["tjänster", "träning"], password: ["lösenord", "glömt"] },
    greeting: "Hej! 💪 Jag är din **Vendetta Fitness Industry** AI-assistent. Vad kan jag hjälpa dig med?",
    location: "📍 **Plats:** Quito, Ecuador (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 Kontakta oss via WhatsApp: **+593 98 772 9737**.",
    memberships: "💵 **Medlemskap:** Dagskort, JABA, Månad, Kvartal och Årskort.",
    schedule: "🕒 **Öppettider:** Mån-Fre: 06:00-14:00 & 16:00-22:00. Lör: 08:00-18:00.",
    services: "🔥 Personlig träning, moderna maskiner och gruppass.",
    password: "🔒 Klicka på 'Glömt lösenord?' på inloggningssidan.",
    accessibility: "♿ Använd tillgänglighetsverktyget för tekststorlek och kontrast.",
    unknown: "🤔 Fråga mig om: Plats, Öppettider, Priser, Tjänster och Kontakt."
  },
  no: {
    ui: { label: "AI-Assistent", title: "AI-Assistent", placeholder: "Skriv spørsmålet ditt...", send: "Send", close: "Lukk assistent" },
    keywords: { location: ["hvor", "adresse", "sted"], phone: ["telefon", "nummer", "kontakt"], memberships: ["priser", "medlemskap"], schedule: ["åpningstider", "tid"], services: ["tjenester", "trening"], password: ["passord", "glemt"] },
    greeting: "Hei! 💪 Jeg er din AI-assistent hos **Vendetta Fitness Industry**. Hva kan jeg hjelpe deg med?",
    location: "📍 **Adresse:** Quito, Ecuador (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 WhatsApp: **+593 98 772 9737**.",
    memberships: "💵 **Medlemskap:** Dagskort, JABA, Månedlig, Kvartalsvis og Årlig.",
    schedule: "🕒 **Åpningstider:** Man-Fre: 06:00-14:00 & 16:00-22:00. Lør: 08:00-18:00.",
    services: "🔥 Personlig trening, moderne apparater og gruppetimer.",
    password: "🔒 Klikk på 'Glemt passord?' på innloggingssiden.",
    accessibility: "♿ Bruk tilgjengelighetsverktøyet for tekststørrelse og kontrast.",
    unknown: "🤔 Spør meg om: Adresse, Åpningstider, Priser, Tjenester og Kontakt."
  },
  da: {
    ui: { label: "AI-Assistent", title: "AI-Assistent", placeholder: "Skriv dit spørgsmål...", send: "Send", close: "Luk assistent" },
    keywords: { location: ["hvor", "adresse", "placering"], phone: ["telefon", "nummer", "kontakt"], memberships: ["priser", "medlemskab"], schedule: ["åbningstider", "tid"], services: ["tjenester", "træning"], password: ["adgangskode", "glemt"] },
    greeting: "Hej! 💪 Jeg er din **Vendetta Fitness Industry** AI-assistent. Hvordan kan jeg hjælpe?",
    location: "📍 **Adresse:** Quito, Ecuador (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 WhatsApp: **+593 98 772 9737**.",
    memberships: "💵 **Medlemskaber:** Dagspas, JABA, Månedlig, Kvartalsvis og Årlig.",
    schedule: "🕒 **Åbningstider:** Man-Fre: 06:00-14:00 & 16:00-22:00. Lør: 08:00-18:00.",
    services: "🔥 Personlig træning, moderne maskiner og holdtræning.",
    password: "🔒 Klik på 'Glemt adgangskode?' på loginside.",
    accessibility: "♿ Brug tilgængelighedsknappen for tekststørrelse og kontrast.",
    unknown: "🤔 Spørg mig om: Adresse, Åbningstider, Priser, Tjenester og Kontakt."
  },
  fi: {
    ui: { label: "AI-Avustaja", title: "AI-Avustaja", placeholder: "Kirjoita kysymyksesi...", send: "Lähetä", close: "Sulje avustaja" },
    keywords: { location: ["missä", "osoite", "sijainti"], phone: ["puhelin", "numero", "yhteystiedot"], memberships: ["hinnat", "jäsenyys"], schedule: ["aukioloajat", "aika"], services: ["palvelut", "treeni"], password: ["salasana", "unohditko"] },
    greeting: "Hei! 💪 Olen **Vendetta Fitness Industry** AI-avustajasi. Kuinka voin auttaa?",
    location: "📍 **Osoite:** Quito, Ecuador (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 WhatsApp: **+593 98 772 9737**.",
    memberships: "💵 **Jäsenyydet:** Päivälippu, JABA, Kuukausi, 3kk ja Vuosikortti.",
    schedule: "🕒 **Aukioloajat:** Ma-Pe: 06:00-14:00 & 16:00-22:00. La: 08:00-18:00.",
    services: "🔥 Personallinen valmennus, modernit laitteet ja ryhmätunnit.",
    password: "🔒 Napsauta 'Unohtuiko salasana?' kirjautumissivulla.",
    accessibility: "♿ Käytä saavutettavuustyökalua tekstin koon ja kontrastin säätämiseen.",
    unknown: "🤔 Voit kysyä minulta: Osoite, Aukioloajat, Hinnat, Palvelut ja Yhteystiedot."
  },
  tr: {
    ui: { label: "Yapay Zeka Asistanı", title: "Yapay Zeka Asistanı", placeholder: "Sorunuzu yazın...", send: "Gönder", close: "Asistanı kapat" },
    keywords: { location: ["nerede", "adres", "konum"], phone: ["telefon", "numara", "iletişim"], memberships: ["fiyatlar", "üyelik", "plan"], schedule: ["saatler", "açık"], services: ["hizmetler", "antrenman"], password: ["şifre", "unuttum"] },
    greeting: "Merhaba! 💪 Ben **Vendetta Fitness Industry** Yapay Zeka Asistanınızım. Nasıl yardımcı olabilirim?",
    location: "📍 **Adres:** Quito, Ekvador, Mitad del Mundo (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 WhatsApp İletişim: **+593 98 772 9737**.",
    memberships: "💵 **Üyelikler:** Günlük, JABA, Aylık, Üç Aylık ve Yıllık.",
    schedule: "🕒 **Çalışma Saatleri:** Pzt-Cum: 06:00-14:00 & 16:00-22:00. Cmt: 08:00-18:00.",
    services: "🔥 Özel antrenörlük, modern makineler ve grup dersleri.",
    password: "🔒 Giriş ekranında 'Şifrenizi mi unuttunuz?' seçeneğine tıklayın.",
    accessibility: "♿ Yazı boyutunu ve kontrastı ayarlamak için erişilebilirlik aracını kullanın.",
    unknown: "🤔 Bana şunları sorabilirsiniz: Adres, Saatler, Üyelikler, Hizmetler ve İletişim."
  },
  pl: {
    ui: { label: "Asystent SI", title: "Asystent SI", placeholder: "Wpisz swoje pytanie...", send: "Wyślij", close: "Zamknij asystenta" },
    keywords: { location: ["gdzie", "adres", "lokalizacja"], phone: ["telefon", "numer", "kontakt"], memberships: ["cennik", "karnety", "plany"], schedule: ["godziny", "otwarte"], services: ["usługi", "trening"], password: ["hasło", "zapomniałem"] },
    greeting: "Cześć! 💪 Jestem Wirtualnym Asystentem **Vendetta Fitness Industry**. W czym mogę pomóc?",
    location: "📍 **Adres:** Quito, Ekwador (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 WhatsApp: **+593 98 772 9737**.",
    memberships: "💵 **Karnety:** Dniowy, JABA, Miesięczny, Kwartalny i Roczny.",
    schedule: "🕒 **Godziny:** Pon-Pt: 06:00-14:00 i 16:00-22:00. Sob: 08:00-18:00.",
    services: "🔥 Trening personalny, nowoczesny sprzęt, zajęcia grupowe.",
    password: "🔒 Kliknij 'Nie pamiętasz hasła?' na ekranie logowania.",
    accessibility: "♿ Użyj widgetu dostępności, aby zmienić rozmiar tekstu i kontrast.",
    unknown: "🤔 Zapytaj mnie o: Lokalizację, Godziny, Cennik, Usługi i Kontakt."
  },
  id: {
    ui: { label: "Asisten AI", title: "Asisten AI", placeholder: "Ketik pertanyaan Anda...", send: "Kirim", close: "Tutup asisten" },
    keywords: { location: ["dimana", "alamat", "lokasi"], phone: ["telepon", "nomor", "kontak"], memberships: ["harga", "keanggotaan", "paket"], schedule: ["jam", "jadwal", "buka"], services: ["layanan", "latihan"], password: ["kata sandi", "lupa"] },
    greeting: "Halo! 💪 Saya asisten AI **Vendetta Fitness Industry**. Ada yang bisa saya bantu?",
    location: "📍 **Lokasi:** Quito, Ekuador (Av. 13 de Junio & Av. Equinoccial).",
    phone: "📞 WhatsApp: **+593 98 772 9737**.",
    memberships: "💵 **Keanggotaan:** Harian, JABA, Bulanan, Triwulanan, dan Tahunan.",
    schedule: "🕒 **Jam Buka:** Sen-Jum: 06:00-14:00 & 16:00-22:00. Sabtu: 08:00-18:00.",
    services: "🔥 Pelatihan pribadi, peralatan modern, dan kelas olahraga.",
    password: "🔒 Klik 'Lupa kata sandi?' pada layar masuk.",
    accessibility: "♿ Gunakan widget aksesibilitas untuk menyesuaikan ukuran teks dan kontras.",
    unknown: "🤔 Anda dapat bertanya tentang: Lokasi, Jam Buka, Harga, Layanan, dan Kontak."
  }
};

export default assistantResponses;