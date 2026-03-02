const http = require('http');
const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

// --- 1. TA BASE DE DONNÉES DE TEST (Ajoute tes vrais liens ici) ---
const META_STUFFS = {
    "Cra": {
        "PvP - Terre (Punitive)": { link: "https://www.dofusbook.net/fr/equipement/exemple1", stats: "12/6/6 - 1300 Force", desc: "Le classique pour OS en tour de charge." },
        "PvM - Multi (Do Crit)": { link: "https://www.dofusbook.net/fr/equipement/exemple2", stats: "11/6/6 - 200 Do Crit", desc: "Le meilleur build pour clean les donjons 200." }
    },
    "Iop": {
        "PvP - Feu (Tumulte)": { link: "https://www.dofusbook.net/fr/equipement/exemple3", stats: "12/6/6 - 1250 Intel", desc: "Énormes dégâts de zone en Rixe." },
        "PvM - Terre (Colère)": { link: "https://www.dofusbook.net/fr/equipement/exemple4", stats: "12/6/3 - 1500 Force", desc: "Pour taper des records sur le Poutch." }
    },
    "Xelor": {
        "PvP - Eau (Retrait PA)": { link: "https://www.dofusbook.net/fr/equipement/exemple5", stats: "11/6/6 - 160 Ret PA", desc: "Pour rendre l'adversaire totalement immobile." }
    }
};

// --- 2. SERVEUR RENDER (Anti-Sommeil) ---
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("Bot Meta-Stuff Phase Test - Online");
});
server.listen(process.env.PORT || 3000, '0.0.0.0');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', () => {
    console.log(`✅ Bot Meta-Stuff lancé sur : ${client.user.tag}`);
});

// --- 3. COMMANDE PRINCIPALE !STUFF ---
client.on('messageCreate', async (m) => {
    if (m.author.bot || m.content !== '!stuff') return;

    const classes = Object.keys(META_STUFFS);
    
    const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('select_classe')
            .setPlaceholder('🛡️ Choisis une classe pour le test...')
            .addOptions(classes.map(c => ({ label: c, value: c })))
    );

    await m.reply({ 
        content: "👋 **Bienvenue dans le répertoire Meta de la Guilde !**\nSélectionne une classe pour voir les builds optimisés :", 
        components: [row] 
    });
});

// --- 4. LOGIQUE DES MENUS ---
client.on('interactionCreate', async (i) => {
    if (!i.isStringSelectMenu()) return;

    // Étape : Choix de l'élément / mode
    if (i.customId === 'select_classe') {
        const classe = i.values[0];
        const builds = Object.keys(META_STUFFS[classe]);
        
        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`res_${classe}`)
                .setPlaceholder(`✨ Quel mode pour ton ${classe} ?`)
                .addOptions(builds.map(b => ({ label: b, value: b })))
        );

        await i.update({ 
            content: `✅ Classe sélectionnée : **${classe}**\n👉 Quel build veux-tu consulter ?`, 
            components: [row] 
        });
    }

    // Étape : Affichage Final de l'Embed
    if (i.customId.startsWith('res_')) {
        const classe = i.customId.split('_')[1];
        const buildName = i.values[0];
        const data = META_STUFFS[classe][buildName];

        const embed = new EmbedBuilder()
            .setTitle(`🔥 OPTI : ${classe.toUpperCase()} - ${buildName.toUpperCase()}`)
            .setURL(data.link)
            .setColor('#e67e22')
            .addFields(
                { name: "📊 Caractéristiques", value: `\`${data.stats}\``, inline: false },
                { name: "📝 Description", value: data.desc, inline: false },
                { name: "🔗 Lien Dofusbook", value: `[Clique ici pour ouvrir le stuff](${data.link})` }
            )
            .setFooter({ text: "Test V1.0 - Guilde Meta" })
            .setTimestamp();

        // On enlève les menus et on affiche l'embed
        await i.update({ content: "✅ **Voici le build sélectionné :**", embeds: [embed], components: [] });
    }
});

client.login(process.env.TOKEN);