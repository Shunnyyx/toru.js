module.exports = function channelType(channel, id) {
  if (!id) {
    // Devuelve el tipo del canal actual si no se proporciona ID
    return channel.type || 'Unknown';
  }

  // Aquí asumimos que estamos pasando un ID de canal válido y buscamos el tipo del canal
  const channelMap = new Map(); // Mapa para almacenar los tipos de canales
  channelMap.set(channel.id, channel.type);

  // Puedes agregar más IDs si es necesario
  // Ejemplo: channelMap.set('1286012334044614676', 'text'); 

  return channelMap.get(id) || 'Unknown ID';
};
