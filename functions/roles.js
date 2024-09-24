module.exports = (guild, member, userId) => {
    const targetMember = guild.members.cache.get(userId);
    if (!targetMember) return 'Usuario no encontrado';
    const roles = targetMember.roles.cache.map(role => role.name).join(', ');
    return roles || 'Sin roles';
};
