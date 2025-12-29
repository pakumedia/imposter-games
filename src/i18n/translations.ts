export type Language = 'de' | 'en';

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
    
    // Home Screen
    pickGame: 'Pick Game',
    playGame: 'Play Game',
    
    // General
    cancel: 'Cancel',
    save: 'Save',
    done: 'Done',
  },
} as const;

export type TranslationKey = keyof typeof translations.de;
