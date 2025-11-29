export interface BlogPost {
    slug: string
    title: string
    excerpt: string
    content: string
    author: {
        name: string
        role: string
        avatar: string
    }
    publishedAt: string
    category: string
    readTime: string
    image: string
    featured?: boolean
}

export const blogPosts: BlogPost[] = [
    {
        slug: "zmena-zakona-2026-co-potrebujete-vediet",
        title: "Zmena zákona § 85n od roku 2026: Čo potrebujete vedieť?",
        excerpt:
            "Od januára 2026 nadobúda účinnosť nový zákon, ktorý vyžaduje elektronické vedenie knihy jázd. Zistite, ako sa to dotkne vášho podnikania a ako sa pripraviť.",
        category: "Legislatíva",
        readTime: "5 min čítania",
        publishedAt: "15. Marec 2024",
        author: {
            name: "Mgr. Peter Novák",
            role: "Daňový poradca",
            avatar: "/blog/professional-male-consultant.jpg",
        },
        image: "/blog/legal-documents-law-books.jpg",
        featured: true,
        content: `
Nový zákon o elektronickom vedení knihy jázd prináša významné zmeny pre všetkých podnikateľov používajúcich vozidlá na firemné účely.

## Čo sa mení?

Od 1. januára 2026 bude povinné viesť knihu jázd v elektronickej forme s fotografickým záznamom stavu tachometra. Táto zmena má za cieľ zabezpečiť väčšiu transparentnosť a presnosť pri uplatňovaní daňových odpočtov.

## Kľúčové požiadavky

1. **Fotodokumentácia tachometra** - každá jazda musí obsahovať fotografiu
2. **Okamžité zaznamenávanie** - zápisy musia byť robené v reálnom čase
3. **Bezpečné úložisko** - dáta musia byť archivované minimálne 10 rokov
4. **Ochrana pred manipuláciou** - systém musí zabraňovať spätnej úprave záznamov

## Prečo je táto zmena potrebná?

Finančná správa dlhodobo evidovala nezrovnalosti pri uplatňovaní cestovných náhrad a odpočtoch DPH. Nový zákon má za cieľ:
- Zvýšiť transparentnosť
- Zjednodušiť kontroly
- Zabrániť daňovým únikom
- Modernizovať administratívu

## Ako sa pripraviť?

Najjednoduchším riešením je zaviesť špeciálnu aplikáciu ako Kniha jázd, ktorá spĺňa všetky požiadavky nového zákona. Pripravte sa včas a vyhnite sa pokutám!
    `,
    },
    {
        slug: "ako-usetrit-na-dph-s-knihou-jazd",
        title: "Ako ušetriť na DPH s elektronickou knihou jázd",
        excerpt: "Správne vedenie knihy jázd vám môže ušetriť tisíce eur ročne na DPH. Ukážeme vám ako na to.",
        category: "Finančné tipy",
        readTime: "7 min čítania",
        publishedAt: "10. Marec 2024",
        author: {
            name: "Ing. Jana Kováčová",
            role: "Účtovníčka",
            avatar: "/blog/professional-female-accountant.png",
        },
        image: "/blog/calculator-money-savings.jpg",
        featured: true,
        content: `
Vedenie knihy jázd nie je len administratívnou povinnosťou, ale aj príležitosťou na významné úspory.

## Koľko môžete ušetriť?

Pri správnom vedení knihy jázd a uplatňovaní DPH môžete ročne ušetriť:
- **Pri 10 000 km ročne**: približne 400-600 EUR
- **Pri 20 000 km ročne**: približne 800-1200 EUR
- **Pri 30 000 km ročne**: približne 1200-1800 EUR

## Čo môžete odpočítať?

- Pohonné hmoty (benzín, nafta, elektrina)
- Údržba a opravy vozidla
- Poistenie vozidla
- Diaľničné známky a mýto
- Parkovanie počas služobných ciest

## Dôležité pravidlá

Pre správny odpočet DPH je kľúčové:
1. **Presná evidencia** - každá služobná cesta musí byť zaznamenaná
2. **Fotodokumentácia** - podľa nového zákona povinná od 2026
3. **Okamžité zápisy** - nie spätne na konci mesiaca
4. **Kompletné údaje** - trasa, účel, kilometráž

## Odporúčanie

Používajte aplikáciu, ktorá automaticky počíta DPH a generuje reporty priamo pre vašu účtovníčku. Ušetríte čas a peniaze!
    `,
    },
    {
        slug: "5-tipov-pre-efektivne-vedenie-knihy-jazd",
        title: "5 tipov pre efektívne vedenie knihy jázd",
        excerpt: "Naučte sa, ako viesť knihu jázd rýchlo, jednoducho a bez chýb. Praktické tipy od odborníkov.",
        category: "Návody",
        readTime: "4 min čítania",
        publishedAt: "5. Marec 2024",
        author: {
            name: "Martin Horváth",
            role: "Produktový manažér",
            avatar: "/blog/professional-male-manager.jpg",
        },
        image: "/blog/smartphone-app-driving.jpg",
        content: `
Efektívne vedenie knihy jázd vám ušetrí čas a nervy. Prinášame overené tipy.

## 1. Zapisujte hneď

Najčastejšou chybou je odkladanie záznamov na neskôr. Využite mobil a zapíšte jazdu ihneď po príchode.

## 2. Používajte šablóny

Pre pravidelné trasy (domov-práca, klient XY) si vytvorte šablóny. Ušetríte až 70% času.

## 3. Fotka tachometra

Od roku 2026 povinnosť, ale už dnes dobrá prax. Máte nezvratný dôkaz o realite jazdy.

## 4. Synchronizácia s účtovníctvom

Vyberte si riešenie, ktoré umožňuje priamy export do účtovného softvéru. Koniec ručného prepisovania!

## 5. Automatické pripomienky

Nastavte si notifikácie, ktoré vám pripomenú zapísanie jazdy. Nezabudnete ani jeden výjazd.

## Záver

S modernou aplikáciou trvá zápis jazdy len 15 sekúnd. To je 180-násobok rýchlejšie ako papierová kniha!
    `,
    },
    {
        slug: "preco-gps-nie-je-spravne-riesenie",
        title: "Prečo GPS tracking nie je správne riešenie pre denník jázd",
        excerpt:
            "GPS tracking sa môže javiť ako jednoduché riešenie, ale prináša vážne rizika pre súkromie a GDPR. Zistite prečo.",
        category: "Legislatíva",
        readTime: "6 min čítania",
        publishedAt: "1. Marec 2024",
        author: {
            name: "JUDr. Eva Nemcová",
            role: "Právnička GDPR",
            avatar: "/blog/professional-female-lawyer.png",
        },
        image: "/blog/gps-tracking-privacy.jpg",
        content: `
GPS tracking sa môže javiť ako jednoduchá cesta k automatickému vedeniu knihy jázd, ale realita je zložitejšia.

## Právne riziká

GPS tracking prináša závažné problémy:
- **GDPR porušenia** - neustále sledovanie polohy zamestnancov
- **Právo na súkromie** - zamestnávateľ nemá právo vedieť, kde ste 24/7
- **Súhlas zamestnancov** - potrebný explicitný súhlas, ktorý možno kedykoľvek odvolať

## Prečo fotka tachometra?

Náš prístup s fotografiou tachometra je:
- **GDPR friendly** - nezaznamenáva polohu
- **Dostatočný** - spĺňa požiadavky zákona
- **Rešpektujúci** - chráni súkromie

## Názor odborníkov

Úrad na ochranu osobných údajov opakovane upozorňuje, že GPS tracking zamestnancov bez závažného dôvodu je problematický.

## Naše odporúčanie

Používajte riešenie, ktoré je:
1. Zákonné a GDPR compliant
2. Rešpektujúce súkromie
3. Dostatočné pre daňové účely
4. Prijaté finančnou správou

Fotka tachometra spĺňa všetky tieto kritériá!
    `,
    },
    {
        slug: "kompletny-navod-na-odpocet-dph",
        title: "Kompletný návod na odpočet DPH z nákladov na auto",
        excerpt: "Detailný sprievodca odpočtom DPH z prevádzkových nákladov vozidla. Všetko, čo potrebujete vedieť.",
        category: "Finančné tipy",
        readTime: "10 min čítania",
        publishedAt: "25. Február 2024",
        author: {
            name: "Ing. Peter Novák",
            role: "Daňový poradca",
            avatar: "/blog/male-tax-consultant.png",
        },
        image: "/blog/vat-tax-document.jpg",
        content: `
Odpočet DPH z nákladov na auto je jednou z najväčších úspor pre podnikateľov. Ukážeme vám presný postup.

## Kto môže odpočítať DPH?

DPH môžu odpočítať platitelia DPH, ktorí:
- Používajú auto pre podnikateľské účely
- Majú správne vedené doklady
- Dokážu preukázať služobný charakter jazdy

## Čo možno odpočítať?

### 1. Pohonné hmoty
- Benzín, nafta - plná sazba DPH 20%
- Elektrina pre elektromobily
- CNG, LPG

### 2. Údržba a opravy
- Servisy a prehliadky
- Výmena pneumatík
- Opravy po nehode (ak slúžilo služobnej jazde)

### 3. Ďalšie náklady
- Poistenie vozidla
- Diaľničná známka
- Parkovanie
- Mýto

## Výpočet pomerného odpočtu

Ak používate auto aj súkromne, musíte vypočítať pomerný odpočet:

**Vzorec:**
\`\`\`
(DPH na služobné cesty / Celkové DPH na všetky cesty) x Celkové náklady na auto
\`\`\`
    `,
    },
]

export function getBlogPosts(): BlogPost[] {
    return blogPosts
}

export function getFeaturedPosts(): BlogPost[] {
    return blogPosts.filter((post) => post.featured)
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((post) => post.slug === slug)
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
    if (category === "Všetky") return blogPosts
    return blogPosts.filter((post) => post.category === category)
}

export function getAllCategories(): string[] {
    const categories = blogPosts.map((post) => post.category)
    return ["Všetky", ...Array.from(new Set(categories))]
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
    const currentPost = getBlogPostBySlug(currentSlug)
    if (!currentPost) return []

    // Get posts from the same category, excluding the current post
    const relatedPosts = blogPosts
        .filter((post) => post.slug !== currentSlug && post.category === currentPost.category)
        .slice(0, limit)

    // If we don't have enough related posts from the same category, add some from other categories
    if (relatedPosts.length < limit) {
        const additionalPosts = blogPosts
            .filter((post) => post.slug !== currentSlug && post.category !== currentPost.category)
            .slice(0, limit - relatedPosts.length)

        return [...relatedPosts, ...additionalPosts]
    }

    return relatedPosts
}
