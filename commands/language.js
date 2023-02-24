const db = require("../mongoDB");
module.exports = {
  name: "language",
  description: "It allows you to set the language of the bot.",
  permissions: "0x0000000000000020",
  options: [],
  voiceChannel: false,
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);
    try {
      const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
      let buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Türkçe")
          .setCustomId('tr')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🇹🇷'), 
        new ButtonBuilder()
          .setLabel("English")
          .setCustomId('en')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🇬🇧'),
        new ButtonBuilder()
          .setLabel("Nederlands")
          .setCustomId('nl')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🇳🇱'),
        new ButtonBuilder()
          .setLabel("العربية")
          .setCustomId('ar')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🇸🇦'),
        new ButtonBuilder()
          .setLabel("Français")
          .setCustomId('fr')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🇫🇷'),
      )

      let buttons2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setLabel("Português")
            .setCustomId('pt')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🇧🇷'),
            new ButtonBuilder()
            .setLabel("正體中文")
            .setCustomId('zh_TW')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🇨🇳'),
	     new ButtonBuilder()
            .setLabel("Italiano")
            .setCustomId('it')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🇮🇹'),
	     new ButtonBuilder()
            .setLabel("Indonesia")
            .setCustomId('id')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🇮🇩'),
        new ButtonBuilder()
            .setLabel("Español")
            .setCustomId('es')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🇪🇸'),
        )

        let buttons3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setLabel("Русский")
            .setCustomId('ru')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🇷🇺')
        )
        

      let embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle("Select a language")
        .setTimestamp()
        .setFooter({ text: `MusicMaker ❤️` })
      interaction?.reply({ embeds: [embed], components: [buttons, buttons2, buttons3] }).then(async Message => {

        const filter = i => i.user.id === interaction?.user?.id
        let col = await Message.createMessageComponentCollector({ filter, time: 30000 });

        col.on('collect', async (button) => {
          if (button.user.id !== interaction?.user?.id) return
	// Languages to select from
          let languages = [
	    {tr: "Botun dili başarıyla türkçe oldu. :flag_tr:"} ,
            {en: "Bot language successfully changed to english. :flag_gb:"},
            {nl: "De taal van de boot werd veranderd in nederlands. :flag_nl:"},
            {ar: "تم تغيير لغة البوت بنجاح إلى اللغة العربية: :flag_ps:"},
            {fr: "La langue du bot a été modifiée avec succès en français. :flag_fr:"},
            {pt: "Língua do bot definida para Português - Brasil com sucesso. :flag_br:"},
            {zh_TW: "機器人成功設為正體中文 :flag_tw:"},
            {it: "La lingua del bot è stata cambiata in italiano. :flag_it:"},
            {id: "Bahasa bot dibuat dalam bahasa indonesia. :flag_id:"},
            {es: "El idioma del bot se cambió con éxito al español. :flag_es:"},
            {ru: "Язык бота успешно изменен на русский. :flag_ru:"}
          ]
	  // Checking if language selected by a user exist
          if(languages.hasOwnProperty(button.customId)) {
	  // Changing server language
            await db?.musicbot?.updateOne({ guildID: interaction?.guild?.id }, {
              $set: {
                language: button.customId
              }
            }, { upsert: true }).catch(e => { })
	  // Replying to the user
            await interaction?.editReply({ content: languages[button.customId], embeds: [], components: [], ephemeral: true }).catch(e => { })
            await button?.deferUpdate().catch(e => { })
            await col?.stop()
          }
        })

        col.on('end', async (button, reason) => {
          if (reason === 'time') {
            buttons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel(lang.msg45)
                .setCustomId("timeend")
                .setDisabled(true))

            embed = new EmbedBuilder()
              .setColor(client.config.embedColor)
              .setTitle("Time ended, please try again.")
              .setTimestamp()
              .setFooter({ text: `MusicMaker ❤️` })

            await interaction?.editReply({ embeds: [embed], components: [buttons] }).catch(e => { })
          }
        })
      }).catch(e => { })

    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
      }
  },
}
