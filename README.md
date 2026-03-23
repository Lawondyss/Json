# JSON Formatter PWA

Tento projekt je progresivní webová aplikace (PWA) určená k formátování, validaci a filtrování JSON dat. Nabízí moderní a rychlé rozhraní postavené na **Svelte 5**, které pomáhá vývojářům efektivně pracovat s datovými strukturami.

## 🚀 Funkce

- **Svelte 5 Runes**: Využití nejnovějších technologií pro maximální výkon a reaktivitu.
- **PWA (Progressive Web App)**: Možnost instalace jako nativní aplikace na desktop i mobil, s podporou offline režimu.
- **Interaktivní stromová struktura**: Přehledné zobrazení JSON s možností rozbalování a sbalování uzlů.
- **Filtrování cestou**: Rychlé vyhledávání a filtrování dat pomocí textových cest (např. `root.items[0]`).
- **Syntax Highlighting**: Barevné rozlišení klíčů, řetězců, čísel a booleovských hodnot.
- **Copy to Clipboard**: Snadné kopírování naformátovaného výsledku nebo konkrétní cesty k datům.
- **Nativní CSS Nesting & Proměnné**: Čistý a moderní styling bez závislosti na Tailwindu.

## 🛠 Instalace a spuštění

Projekt využívá `yarn` jako správce balíčků.

1. **Naklonujte repozitář:**
    ```bash
    git clone https://github.com/Lawondyss/Json.git
    cd Json
    ```

2. **Nainstalujte závislosti:**
    ```bash
    yarn install
    ```

3. **Spuštění vývojového serveru:**
    ```bash
    yarn dev
    ```

4. **Sestavení pro produkci:**
    ```bash
    yarn build
    ```

## 🌐 Nasazení (Deployment)

Projekt je nastaven pro automatické nasazení na **GitHub Pages** pomocí GitHub Actions.

- Jakýkoliv push do větve `main` spustí workflow `.github/workflows/deploy.yml`.
- Aplikace bude dostupná na adrese vašeho GitHub profilu (např. `https://lawondyss.github.io/Json/`).

## 💻 Použití

1. **Vstup**: Vložte svůj JSON do levého panelu (v režimu split) nebo do editačního pole.
2. **Formátování**: Klikněte na tlačítko pro formátování, které zvaliduje syntaxi a vykreslí strom.
3. **Filtrování**: Použijte horní lištu pro filtrování konkrétních částí JSON nebo pro vyhledávání textu.
4. **Cesty**: Kliknutím na jakýkoliv uzel získáte jeho cestu, kterou můžete zkopírovat.

## 📜 Licence

Tento projekt je licencován pod licencí MIT.