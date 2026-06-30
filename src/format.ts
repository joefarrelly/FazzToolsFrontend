export function capitalize(str: string): string {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}

export function formatGold(copper: number): string {
  return `${Math.floor(copper / 10000).toLocaleString()}g`;
}

export function formatPlayedTime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}d ${hours}h`;
}
