module.exports = (guild, member, userId) => {
    const targetMember = guild.members.cache.get(userId);
    if (!targetMember) return 'Usuario no encontrado';
    return targetMember.user.displayAvatarURL({ format: 'png', dynamic: true });
};
