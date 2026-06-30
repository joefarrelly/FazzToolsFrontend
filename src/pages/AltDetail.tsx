import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CollapsePanel from 'components/CollapsePanel';
import PageLayout from 'components/PageLayout';
import ProfessionTable from 'components/ProfessionTable';
import LoadingSpinner from 'components/LoadingSpinner';
import { classColor } from 'classColors';
import { capitalize } from 'format';
import { cookies } from 'cookies';
import { config } from 'Constants';
import type {
  AchievementEntry,
  MythicPlusDungeonEntry,
  MythicPlusEntry,
  ReputationEntry,
  TierData,
} from 'types';

const GEAR_SLOTS = [
  'Head',
  'Neck',
  'Shoulder',
  'Back',
  'Chest',
  'Tabard',
  'Shirt',
  'Wrist',
  'Hands',
  'Belt',
  'Legs',
  'Feet',
  'Ring 1',
  'Ring 2',
  'Trinket 1',
  'Trinket 2',
  'Weapon 1',
  'Weapon 2',
];

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function Section({ title, subtitle, children }: SectionProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded transition-colors flex items-center justify-between"
      >
        <span className="text-sm font-semibold text-zinc-200">{title}</span>
        <div className="flex items-center gap-3">
          {subtitle && <span className="text-xs text-zinc-400">{subtitle}</span>}
          <span className="text-zinc-500 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      <CollapsePanel open={open}>
        <div className="mt-2 pl-1">{children}</div>
      </CollapsePanel>
    </div>
  );
}

interface ClassHeader {
  altName: string;
  realmSlug: string;
  className: string;
  profession1: string;
  profession2: string;
}

function AltDetail() {
  const { alt, realm } = useParams<{ alt: string; realm: string }>();
  const [header, setHeader] = useState<ClassHeader | null>(null);
  const [gear, setGear] = useState<[string, number][]>([]);
  const [prof1Data, setProf1Data] = useState<TierData[]>([]);
  const [prof2Data, setProf2Data] = useState<TierData[]>([]);
  const [mythicSummary, setMythicSummary] = useState<MythicPlusEntry | null>(null);
  const [mythicDungeons, setMythicDungeons] = useState<MythicPlusDungeonEntry[]>([]);
  const [achievements, setAchievements] = useState<AchievementEntry[]>([]);
  const [reputations, setReputations] = useState<ReputationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!alt || !realm) return;
    const altName = alt;
    const realmSlug = realm;
    async function getData() {
      try {
        const user = cookies.get('userid');

        const professionsRes = await axios.get(
          config.url.API_URL + '/api/profile/altprofessions/',
          {
            params: {
              user,
              fields: [
                '.alt_name',
                '.alt_realm_slug',
                '.get_alt_class_display',
                'get_profession_1_display',
                'get_profession_2_display',
              ],
            },
          }
        );
        const rows = professionsRes.data as [string, string, string, string, string][];
        const match = rows.find(
          ([name, slug]) => name.toLowerCase() === altName.toLowerCase() && slug === realmSlug
        );
        const prof1Name = match?.[3] ?? 'Missing';
        const prof2Name = match?.[4] ?? 'Missing';
        setHeader({
          altName: match?.[0] ?? capitalize(altName),
          realmSlug: realmSlug,
          className: match?.[2] ?? '',
          profession1: prof1Name,
          profession2: prof2Name,
        });

        const params = { user, alt: altName, realm: realmSlug };
        const [gearRes, prof1Res, prof2Res, mythicRes, dungeonsRes, achievementsRes, repsRes] =
          await Promise.all([
            axios.get(config.url.API_URL + '/api/profile/altequipments/', {
              params: { page: 'single', alt: altName, realm: realmSlug },
            }),
            prof1Name === 'Missing'
              ? Promise.resolve({ data: [] })
              : axios.get(config.url.API_URL + '/api/profile/altprofessiondatas/', {
                  params: { alt: altName, realm: realmSlug, profession: prof1Name },
                }),
            prof2Name === 'Missing'
              ? Promise.resolve({ data: [] })
              : axios.get(config.url.API_URL + '/api/profile/altprofessiondatas/', {
                  params: { alt: altName, realm: realmSlug, profession: prof2Name },
                }),
            axios.get(config.url.API_URL + '/api/profile/altmythicplus/', { params }),
            axios.get(config.url.API_URL + '/api/profile/altmythicplusdungeons/', { params }),
            axios.get(config.url.API_URL + '/api/profile/altachievements/', { params }),
            axios.get(config.url.API_URL + '/api/profile/altreputations/', { params }),
          ]);

        setGear(gearRes.data as [string, number][]);
        setProf1Data(prof1Res.data as TierData[]);
        setProf2Data(prof2Res.data as TierData[]);
        setMythicSummary((mythicRes.data as MythicPlusEntry[])[0] ?? null);
        setMythicDungeons(dungeonsRes.data as MythicPlusDungeonEntry[]);
        setAchievements(achievementsRes.data as AchievementEntry[]);
        setReputations(repsRes.data as ReputationEntry[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [alt, realm]);

  if (!alt || !realm) return null;

  const color = header ? (classColor(header.className) ?? '#e4e4e7') : '#e4e4e7';
  const title = header ? `${header.altName} — ${capitalize(realm)}` : capitalize(alt);
  const achievementPoints = achievements.reduce((s, a) => s + a.achievement_points, 0);

  return (
    <PageLayout title={title}>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && header && (
        <div className="max-w-3xl">
          <p className="text-sm mb-4" style={{ color }}>
            {header.className}
          </p>

          <Section title="Gear">
            <table className="border-collapse text-sm w-full max-w-md">
              <tbody>
                {gear.map((item, index) => (
                  <tr key={index} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="bg-zinc-900 px-4 py-2 border border-zinc-700 text-zinc-400 text-sm">
                      {GEAR_SLOTS[index]}
                    </td>
                    <td className="bg-zinc-900 px-4 py-2 border border-zinc-700 text-zinc-200 text-sm">
                      {item[0]}
                    </td>
                    <td className="bg-zinc-900 px-4 py-2 border border-zinc-700 text-zinc-200 text-sm text-center">
                      {item[1]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {header.profession1 !== 'Missing' && (
            <Section title={header.profession1}>
              <ProfessionTable tiers={prof1Data} />
            </Section>
          )}
          {header.profession2 !== 'Missing' && (
            <Section title={header.profession2}>
              <ProfessionTable tiers={prof2Data} />
            </Section>
          )}

          <Section
            title="Mythic+"
            subtitle={mythicSummary ? `${mythicSummary.mythic_rating.toFixed(1)} rating` : '—'}
          >
            {mythicDungeons.length === 0 ? (
              <p className="text-zinc-500 text-xs px-2 py-1">No dungeon runs recorded.</p>
            ) : (
              [...mythicDungeons]
                .sort((a, b) => b.score - a.score)
                .map((d) => (
                  <div
                    key={d.dungeon}
                    className="bg-zinc-800/50 border border-zinc-700/50 rounded px-3 py-2 mb-1 flex items-center justify-between"
                  >
                    <span className="text-sm text-zinc-200">{d.dungeon_name}</span>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <span className="text-xs text-zinc-500">{d.score.toFixed(1)}</span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded border ${
                          d.is_completed_within_time
                            ? 'bg-green-500/20 text-green-300 border-green-500/40'
                            : 'bg-zinc-600/40 text-zinc-400 border-zinc-600/60'
                        }`}
                      >
                        +{d.keystone_level}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </Section>

          <Section title="Achievements" subtitle={`${achievementPoints.toLocaleString()} pts`}>
            {achievements.length === 0 ? (
              <p className="text-zinc-500 text-xs px-2 py-1">No achievements recorded.</p>
            ) : (
              achievements.map((a) => (
                <div
                  key={a.achievement}
                  className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700/50 rounded px-3 py-2 mb-1"
                >
                  <span className="text-sm text-zinc-200">{a.achievement_name}</span>
                  <span className="text-xs text-amber-400/80 font-medium ml-4 shrink-0">
                    {a.achievement_points} pts
                  </span>
                </div>
              ))
            )}
          </Section>

          <Section title="Reputations">
            {reputations.length === 0 ? (
              <p className="text-zinc-500 text-xs px-2 py-1">No reputation data recorded.</p>
            ) : (
              [...reputations]
                .sort((a, b) => b.standing_value - a.standing_value)
                .map((r) => (
                  <div
                    key={r.faction}
                    className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700/50 rounded px-3 py-2 mb-1"
                  >
                    <span className="text-sm text-zinc-200">{r.faction_name}</span>
                    <span className="text-xs text-zinc-400 ml-4 shrink-0">
                      {r.standing_value.toLocaleString()}
                    </span>
                  </div>
                ))
            )}
          </Section>
        </div>
      )}
    </PageLayout>
  );
}

export default AltDetail;
