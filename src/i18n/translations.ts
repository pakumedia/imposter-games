export type Language = 'de' | 'en' | 'fr' | 'it' | 'pt' | 'es';

export const translations = {
  de: {
    // Profile Screen
    profile: 'Profil',
    account: 'Account',
    guest: 'Gast',
    tapToLogin: 'Tippe um dich anzumelden',
    settings: 'Einstellungen',
    language: 'Sprache',
    notifications: 'Benachrichtigungen',
    soundVibration: 'Sound & Vibration',
    appearance: 'Erscheinungsbild',
    system: 'System',
    more: 'Mehr',
    privacy: 'Datenschutz',
    helpSupport: 'Hilfe & Support',
    logout: 'Abmelden',
    
    // Language Dialog
    selectLanguage: 'Sprache wählen',
    german: 'Deutsch',
    english: 'Englisch',
    french: 'Französisch',
    italian: 'Italienisch',
    portuguese: 'Portugiesisch',
    spanish: 'Spanisch',
    
    // Home Screen
    pickGame: 'Wähle ein Spiel',
    playGame: 'Spielen',
    
    // General
    cancel: 'Abbrechen',
    save: 'Speichern',
    done: 'Fertig',
  },
  en: {
    // Profile Screen
    profile: 'Profile',
    account: 'Account',
    guest: 'Guest',
    tapToLogin: 'Tap to sign in',
    settings: 'Settings',
    language: 'Language',
    notifications: 'Notifications',
    soundVibration: 'Sound & Vibration',
    appearance: 'Appearance',
    system: 'System',
    more: 'More',
    privacy: 'Privacy',
    helpSupport: 'Help & Support',
    logout: 'Log out',
    
    // Language Dialog
    selectLanguage: 'Select Language',
    german: 'German',
    english: 'English',
    french: 'French',
    italian: 'Italian',
    portuguese: 'Portuguese',
    spanish: 'Spanish',
    
    // Home Screen
    pickGame: 'Pick Game',
    playGame: 'Play Game',
    
    // General
    cancel: 'Cancel',
    save: 'Save',
    done: 'Done',
  },
  fr: {
    // Profile Screen
    profile: 'Profil',
    account: 'Compte',
    guest: 'Invité',
    tapToLogin: 'Appuyez pour vous connecter',
    settings: 'Paramètres',
    language: 'Langue',
    notifications: 'Notifications',
    soundVibration: 'Son & Vibration',
    appearance: 'Apparence',
    system: 'Système',
    more: 'Plus',
    privacy: 'Confidentialité',
    helpSupport: 'Aide & Support',
    logout: 'Déconnexion',
    
    // Language Dialog
    selectLanguage: 'Choisir la langue',
    german: 'Allemand',
    english: 'Anglais',
    french: 'Français',
    italian: 'Italien',
    portuguese: 'Portugais',
    spanish: 'Espagnol',
    
    // Home Screen
    pickGame: 'Choisir un jeu',
    playGame: 'Jouer',
    
    // General
    cancel: 'Annuler',
    save: 'Enregistrer',
    done: 'Terminé',
  },
  it: {
    // Profile Screen
    profile: 'Profilo',
    account: 'Account',
    guest: 'Ospite',
    tapToLogin: 'Tocca per accedere',
    settings: 'Impostazioni',
    language: 'Lingua',
    notifications: 'Notifiche',
    soundVibration: 'Suono & Vibrazione',
    appearance: 'Aspetto',
    system: 'Sistema',
    more: 'Altro',
    privacy: 'Privacy',
    helpSupport: 'Aiuto & Supporto',
    logout: 'Esci',
    
    // Language Dialog
    selectLanguage: 'Seleziona lingua',
    german: 'Tedesco',
    english: 'Inglese',
    french: 'Francese',
    italian: 'Italiano',
    portuguese: 'Portoghese',
    spanish: 'Spagnolo',
    
    // Home Screen
    pickGame: 'Scegli un gioco',
    playGame: 'Gioca',
    
    // General
    cancel: 'Annulla',
    save: 'Salva',
    done: 'Fatto',
  },
  pt: {
    // Profile Screen
    profile: 'Perfil',
    account: 'Conta',
    guest: 'Convidado',
    tapToLogin: 'Toque para entrar',
    settings: 'Configurações',
    language: 'Idioma',
    notifications: 'Notificações',
    soundVibration: 'Som & Vibração',
    appearance: 'Aparência',
    system: 'Sistema',
    more: 'Mais',
    privacy: 'Privacidade',
    helpSupport: 'Ajuda & Suporte',
    logout: 'Sair',
    
    // Language Dialog
    selectLanguage: 'Selecionar idioma',
    german: 'Alemão',
    english: 'Inglês',
    french: 'Francês',
    italian: 'Italiano',
    portuguese: 'Português',
    spanish: 'Espanhol',
    
    // Home Screen
    pickGame: 'Escolher jogo',
    playGame: 'Jogar',
    
    // General
    cancel: 'Cancelar',
    save: 'Salvar',
    done: 'Concluído',
  },
  es: {
    // Profile Screen
    profile: 'Perfil',
    account: 'Cuenta',
    guest: 'Invitado',
    tapToLogin: 'Toca para iniciar sesión',
    settings: 'Configuración',
    language: 'Idioma',
    notifications: 'Notificaciones',
    soundVibration: 'Sonido & Vibración',
    appearance: 'Apariencia',
    system: 'Sistema',
    more: 'Más',
    privacy: 'Privacidad',
    helpSupport: 'Ayuda & Soporte',
    logout: 'Cerrar sesión',
    
    // Language Dialog
    selectLanguage: 'Seleccionar idioma',
    german: 'Alemán',
    english: 'Inglés',
    french: 'Francés',
    italian: 'Italiano',
    portuguese: 'Portugués',
    spanish: 'Español',
    
    // Home Screen
    pickGame: 'Elegir juego',
    playGame: 'Jugar',
    
    // General
    cancel: 'Cancelar',
    save: 'Guardar',
    done: 'Listo',
  },
} as const;

export type TranslationKey = keyof typeof translations.de;
