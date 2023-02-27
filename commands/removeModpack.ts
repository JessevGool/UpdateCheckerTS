import { MessageEmbed, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";
import { DatabaseHandler } from "../objects/DatabaseHandler";
import { UpdateChecker } from "../objects/UpdateChecker";

export default {
    category: 'Utility',
    description: 'remove modpack from checklist',
    slash: 'both',                      // Can be 'both', true, false
    testOnly: false,
    hidden: true,
    permissions: ["MANAGE_MESSAGES"],

    callback: async ({ client, interaction }) => {
      return "not yet implemented";
    }

} as ICommand