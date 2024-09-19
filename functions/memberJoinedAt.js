module.exports = function memberJoinedAt(member) {
    return member.joinedAt ? member.joinedAt.toISOString() : 'No join date available';
  };
  