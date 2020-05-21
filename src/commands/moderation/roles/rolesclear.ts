import { Command } from 'discord-akairo';
import { Message, GuildMember, Permissions, Role } from 'discord.js';
import logger from '../../../utils/logger';

export default class RolesClearCommand extends Command {
    public constructor() {
        super('roles-clear', {
            category: 'moderation',
            userPermissions: Permissions.FLAGS.MANAGE_ROLES,
            args: [
                {
                    id: 'member',
                    type: 'member',
                },
            ],
        });
    }

    // TODO: Add role clear logging
    public async exec(msg: Message, { member }: { member: GuildMember }) {
        if (!member) {
            return msg.util?.send('Please specify user to remove role from.');
        }

        // TODO: Create helper function for this.
        if (
            member.roles.highest.position > msg.member.roles.highest.position &&
            msg.author.id !== msg.guild.ownerID
        ) {
            return msg.util.send(
                'This member has a higher or equal role to you. You are unable to update their roles.'
            );
        }

        try {
            let roles = member.roles.cache.filter(
                (role) => role.name !== '@everyone'
            );

            for (const r of roles) {
                let role = r[1];
                await member.roles.remove(role);

                logger.debug(
                    `Removed role @${role.name} (${role.id}) from ${member.user.tag} (${member.user.id}) in ${member.guild.name} (${member.guild.id})`
                );
            }
        } catch (err) {
            logger.error(
                `Error clearing roles from ${member.user.tag} (${member.user.id}) in ${member.guild.name} (${member.guild.id}). Error: `,
                err
            );

            return msg.util?.send('Error clearing roles.');
        }

        return msg.util?.send(`Cleared roles from ${member.user}!`);
    }
}