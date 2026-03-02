const http = require('http');
const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

// --- 1. BASE DE DONNÉES MÉTA INTÉGRÉE ---
const META_STUFFS = {
    "Cra": {
        "PvM - Multi Do Crit": { 
            link: "https://www.dofusbook.net/fr/equipement/14958422-multi-do-crit/objets", 
            stats: "11/6/6 - 200+ Do Crit", 
            desc: "Le build ultime pour clean tous les donjons du jeu. Gros dégâts multi-éléments." 
        },
        "PvP - Terre/Air": { 
            link: "https://www.dofusbook.net/fr/equipement/15234102-terre-air-pvp/objets", 
            stats: "12/6/6 - Gros dégâts/Retrait", 
            desc: "Très fort pour harceler à distance en 3v3 avec un bon retrait PM." 
        }
    },
    "Iop": {
        "PvM - Terre Bourrin": { 
            link: "https://www.dofusbook.net/fr/equipement/14852301-iop-terre-pvm/objets", 
            stats: "12/6/3 - 1500 Force", 
            desc: "Optimisé pour maximiser les dégâts de la Colère et du Bond." 
        },
        "PvP - Feu Tumulte": { 
            link: "https://www.dofusbook.net/fr/equipement/15100234-iop-feu-pvp/objets", 
            stats: "12/6/6 - Full Intel", 
            desc: "Excellent pour le clean de zone et les combos de masse en combat de guilde." 
        }
    },
    "Ouginak": {
        "PvP - Eau (Proie)": { 
            link: "https://www.dofusbook.net/fr/equipement/15340912-ougi-eau-pvp/objets", 
            stats: "11/6/6 - Tank/Dégâts", 
            desc: "Le mode le plus solide pour coller au corps à corps et régénérer sa vie." 
        }
    },
    "Steamer": {
        "PvP - Multi Do Crit": { 
            link: "https://www.dofus