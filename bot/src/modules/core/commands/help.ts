import { Message, MessageEmbed } from 'discord.js';

import { CommandAttributes, TFunc } from '../../../types';
import { translationEnglish } from '../../../localization';

const methodName = 'help';

const exec = async (message: Message, t: TFunc, attr: CommandAttributes) => {
  const { server } = attr;
  const messageParts = message.content.split(' ');
  const params = messageParts.slice(1);
  const helpSection = params[0];
  const helpSectionBlackList = ['title', 'sectionList', 'notFound', 'general'];
  const helpSectionList = Object.keys(translationEnglish.help).filter(
    (section) => !helpSectionBlackList.includes(section),
  );
  type HelpSectionType = keyof typeof translationEnglish.help;

  const embed = new MessageEmbed().setTitle(t('help.title'));
  if (messageParts.length === 1) {
    embed
      .setDescription(t('help.general', { p: server?.prefix }))
      .addField(t('help.sectionList'), helpSectionList.map((section) => `\`${section}\``).join(', '));
  } else if (helpSectionList.includes(helpSection)) {
    embed.setDescription(
      t(`help.${helpSection as HelpSectionType}`, {
        p: server?.prefix,
        helpBlock: {
          stats: t('helpBlock.stats'),
        },
      }),
    );
  } else {
    embed.setDescription(t('help.notFound'));
  }

  await message.reply({ embeds: [embed] });
};

export const help = { exec, methodName };
