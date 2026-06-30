const CLASS_COLORS: Record<string, string> = {
  Warrior: '#C79C6E',
  Paladin: '#F58CBA',
  Hunter: '#ABD473',
  Rogue: '#FFF569',
  Priest: '#FFFFFF',
  Shaman: '#0070DD',
  Mage: '#69CCF0',
  Warlock: '#9482C9',
  Monk: '#00FF96',
  Druid: '#FF7D0A',
  DemonHunter: '#A330C9',
  DeathKnight: '#C41F3B',
  Evoker: '#33937F',
};

export function classColor(name: string): string | null {
  return CLASS_COLORS[name.replace(/\s/g, '')] ?? null;
}
