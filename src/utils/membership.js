export const deriveMembershipStatus = (member) => {
  const fallbackStatus = typeof member?.membershipStatus === 'string' ? member.membershipStatus : null;
  const membership = member?.membership;

  if (!membership) {
    return { status: fallbackStatus || 'inactive', daysRemaining: null };
  }

  if (!membership.endDate) {
    return { status: fallbackStatus || 'active', daysRemaining: null };
  }

  const endDate = new Date(membership.endDate);
  if (Number.isNaN(endDate.getTime())) {
    return { status: fallbackStatus || 'active', daysRemaining: null };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffMs = endDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffMs / msPerDay);

  if (diffMs < 0) {
    return { status: 'expired', daysRemaining: 0 };
  }

  if (daysRemaining <= 8) {
    return { status: 'expiring', daysRemaining };
  }

  return { status: 'active', daysRemaining };
};

export const summarizeMemberships = (members = []) => {
  return members.reduce(
    (acc, member) => {
      const { status } = deriveMembershipStatus(member);

      acc.total += 1;

      switch (status) {
        case 'active':
          acc.active += 1;
          break;
        case 'expired':
          acc.expired += 1;
          break;
        case 'expiring':
          acc.expiring += 1;
          break;
        case 'inactive':
          acc.inactive += 1;
          break;
        default:
          acc.inactive += 1;
          break;
      }

      return acc;
    },
    { total: 0, active: 0, expired: 0, expiring: 0, inactive: 0 }
  );
};
