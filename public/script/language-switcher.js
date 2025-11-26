class LanguageSwitcher {
    constructor() {
        this.currentLang = '';
        this.init();
    }
    
    init() {
        this.createSwitcher();
        this.bindEvents();
        this.loadCurrentLanguage();
    }
    
    createSwitcher() {
        const switcher = document.getElementById('language-switcher');
        switcher.className = 'relative';
        switcher.innerHTML = `
            <button id="languageToggle" class="flex items-center gap-2 px-3 py-2 text-white transition-all duration-200 border-2 border-white rounded-full border-opacity-30 hover:border-opacity-50 hover:bg-white hover:bg-opacity-10">
                <div class="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                    <span class="text-xs font-bold text-white">${this.getCurrentLanguageCode().toUpperCase()}</span>
                </div>
                <svg class="w-4 h-4 transition-transform duration-200" viewBox="0 0 24 24" fill="white">
                    <path d="M12 15.5c-.28 0-.53-.11-.71-.29l-5-5 1.42-1.42L12 12.79l4.29-4.3 1.42 1.42-5 5c-.18.18-.43.29-.71.29z"/>
                </svg>
            </button>
            <div id="languageDropdown" class="absolute right-0 hidden w-48 mt-2 overflow-hidden bg-white  shadow-[0px_10px_20px_5px] shadow-black/25 rounded-2xl">
                <button class="language-option flex items-center w-full gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-veronica hover:text-white" data-lang="id">
                    <div class="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-600">
                        <span class="text-xs font-bold text-white">🇮🇩</span>
                    </div>
                    <span class="font-medium ">Indonesia</span>
                </button>
                <div class="border-t border-purple-100"></div>
                <button class="language-option flex items-center w-full gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-veronica hover:text-white" data-lang="en">
                    <div class="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                        <span class="text-xs font-bold text-white">🇺🇸</span>
                    </div>
                    <span class="font-medium ">English</span>
                </button>
            </div>
        `;
        
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            const toggle = document.getElementById('languageToggle');
            const dropdown = document.getElementById('languageDropdown');
            
            if (e.target.closest('#languageToggle')) {
                e.preventDefault();
                dropdown.classList.toggle('hidden');
            } else if (e.target.closest('.language-option')) {
                e.preventDefault();
                const lang = e.target.closest('.language-option').dataset.lang;
                console.log(e.target.closest('.language-option').dataset);
                this.changeLanguage(lang);
            } else {
                if (dropdown) {
                    dropdown.classList.add('hidden');
                }
            }
        });
    }
    
    async loadCurrentLanguage() {
        try {
            const response = await fetch('/api/current-language');
            const result = await response.json();
            
            if (result.success) {
                this.currentLang = result.language;
                this.updateSwitcherDisplay();
            }
        } catch (error) {
            console.error('Error loading current language:', error);
        }
    }
    
    async changeLanguage(lang) {
        if (lang === this.currentLang) return;
        
        try {
            // Tampilkan loading
            const toggle = document.getElementById('languageToggle');
            const originalContent = toggle.innerHTML;
            toggle.innerHTML = `
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm">Loading...</span>
            `;
            
            const response = await fetch('/api/change-language', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ language: lang })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentLang = lang;
                // Reload halaman untuk menerapkan bahasa baru
                window.location.reload();
            } else {
                console.error('Failed to change language:', result.message);
                toggle.innerHTML = originalContent;
            }
        } catch (error) {
            console.error('Error changing language:', error);
            // Restore original content jika terjadi error
            const toggle = document.getElementById('languageToggle');
            toggle.innerHTML = originalContent;
        }
    }
    
    updateSwitcherDisplay() {
        const toggle = document.getElementById('languageToggle');
        if (toggle) {
            toggle.innerHTML = `
                <span class="flag-icon flag-icon-${this.getCurrentFlag()}" title="${this.getCurrentLanguageName()}"></span>
                <span class="ml-2 text-sm font-medium">${this.getCurrentLanguageCode().toUpperCase()}</span>
                <svg class="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            `;
        }
    }
    
    getCurrentFlag() {
        return this.currentLang === 'en' ? 'us' : 'id';
    }
    
    getCurrentLanguageName() {
        return this.currentLang === 'en' ? 'English' : 'Bahasa Indonesia';
    }
    
    getCurrentLanguageCode() {
        return this.currentLang;
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Tunggu sebentar untuk memastikan navbar sudah dimuat
    setTimeout(() => {
        new LanguageSwitcher();
    }, 100);
});

// Export untuk penggunaan di file lain
window.LanguageSwitcher = LanguageSwitcher;
