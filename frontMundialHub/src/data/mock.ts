// Mundial 2026 Hub — mock data (no backend)

export type Team = {
  code: string; // ISO-ish code
  name: string;
  flag: string; // emoji
  group: string;
};

export type MatchStatus = "scheduled" | "live" | "finished";

export type MatchEvent = {
  minute: number;
  type: "goal" | "yellow" | "red" | "sub" | "var";
  team: string; // team code
  player: string;
};

export type Match = {
  id: string;
  date: string; // ISO
  city: string;
  stadium: string;
  stage: string;
  home: Team;
  away: Team;
  homeScore?: number;
  awayScore?: number;
  minute?: number;
  status: MatchStatus;
  important?: boolean;
  events?: MatchEvent[];
};

export const TEAMS: Team[] = [
  { code: "MEX", name: "México", flag: "🇲🇽", group: "A" },
  { code: "USA", name: "Estados Unidos", flag: "🇺🇸", group: "B" },
  { code: "CAN", name: "Canadá", flag: "🇨🇦", group: "C" },
  { code: "ARG", name: "Argentina", flag: "🇦🇷", group: "D" },
  { code: "BRA", name: "Brasil", flag: "🇧🇷", group: "E" },
  { code: "FRA", name: "Francia", flag: "🇫🇷", group: "F" },
  { code: "ESP", name: "España", flag: "🇪🇸", group: "G" },
  { code: "GER", name: "Alemania", flag: "🇩🇪", group: "H" },
  { code: "ENG", name: "Inglaterra", flag: "🇬🇧", group: "B" },
  { code: "POR", name: "Portugal", flag: "🇵🇹", group: "F" },
  { code: "NED", name: "Países Bajos", flag: "🇳🇱", group: "G" },
  { code: "URU", name: "Uruguay", flag: "🇺🇾", group: "D" },
  { code: "COL", name: "Colombia", flag: "🇨🇴", group: "E" },
  { code: "JPN", name: "Japón", flag: "🇯🇵", group: "H" },
  { code: "MAR", name: "Marruecos", flag: "🇲🇦", group: "C" },
  { code: "CRO", name: "Croacia", flag: "🇭🇷", group: "A" },
];

export const CITIES = [
  { name: "Ciudad de México", country: "MEX", stadium: "Estadio Azteca" },
  { name: "Guadalajara", country: "MEX", stadium: "Estadio Akron" },
  { name: "Monterrey", country: "MEX", stadium: "Estadio BBVA" },
  { name: "Los Ángeles", country: "USA", stadium: "SoFi Stadium" },
  { name: "Nueva York", country: "USA", stadium: "MetLife Stadium" },
  { name: "Miami", country: "USA", stadium: "Hard Rock Stadium" },
  { name: "Dallas", country: "USA", stadium: "AT&T Stadium" },
  { name: "Toronto", country: "CAN", stadium: "BMO Field" },
  { name: "Vancouver", country: "CAN", stadium: "BC Place" },
];

const t = (code: string) => TEAMS.find((x) => x.code === code)!;

const today = new Date();
const day = (offset: number, h: number, m = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const MATCHES: Match[] = [
  {
    id: "m1",
    date: day(0, 14, 0),
    city: "Ciudad de México",
    stadium: "Estadio Azteca",
    stage: "Fase de grupos · J1",
    home: t("MEX"),
    away: t("CRO"),
    homeScore: 2,
    awayScore: 1,
    minute: 67,
    status: "live",
    important: true,
    events: [
      { minute: 12, type: "goal", team: "MEX", player: "S. Giménez" },
      { minute: 28, type: "yellow", team: "CRO", player: "L. Modrić" },
      { minute: 41, type: "goal", team: "CRO", player: "A. Kramarić" },
      { minute: 58, type: "goal", team: "MEX", player: "H. Lozano" },
    ],
  },
  {
    id: "m2",
    date: day(0, 17, 0),
    city: "Los Ángeles",
    stadium: "SoFi Stadium",
    stage: "Fase de grupos · J1",
    home: t("USA"),
    away: t("ENG"),
    minute: 0,
    status: "scheduled",
    important: true,
  },
  {
    id: "m3",
    date: day(0, 20, 30),
    city: "Toronto",
    stadium: "BMO Field",
    stage: "Fase de grupos · J1",
    home: t("CAN"),
    away: t("MAR"),
    status: "scheduled",
  },
  {
    id: "m4",
    date: day(-1, 19, 0),
    city: "Nueva York",
    stadium: "MetLife Stadium",
    stage: "Fase de grupos · J1",
    home: t("ARG"),
    away: t("URU"),
    homeScore: 3,
    awayScore: 0,
    status: "finished",
    important: true,
  },
  {
    id: "m5",
    date: day(-1, 16, 0),
    city: "Miami",
    stadium: "Hard Rock Stadium",
    stage: "Fase de grupos · J1",
    home: t("BRA"),
    away: t("COL"),
    homeScore: 1,
    awayScore: 1,
    status: "finished",
  },
  {
    id: "m6",
    date: day(1, 13, 0),
    city: "Dallas",
    stadium: "AT&T Stadium",
    stage: "Fase de grupos · J2",
    home: t("FRA"),
    away: t("GER"),
    status: "scheduled",
    important: true,
  },
  {
    id: "m7",
    date: day(1, 16, 0),
    city: "Guadalajara",
    stadium: "Estadio Akron",
    stage: "Fase de grupos · J2",
    home: t("ESP"),
    away: t("NED"),
    status: "scheduled",
  },
  {
    id: "m8",
    date: day(2, 19, 0),
    city: "Monterrey",
    stadium: "Estadio BBVA",
    stage: "Fase de grupos · J2",
    home: t("POR"),
    away: t("JPN"),
    status: "scheduled",
  },
  {
    id: "m9",
    date: day(3, 18, 0),
    city: "Vancouver",
    stadium: "BC Place",
    stage: "Fase de grupos · J2",
    home: t("MEX"),
    away: t("USA"),
    status: "scheduled",
    important: true,
  },
];

export type Notification = {
  id: string;
  type: "goal" | "info" | "alert" | "important";
  title: string;
  body: string;
  time: string;
  read?: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "goal", title: "¡GOOOL de México!", body: "Lozano (58') pone el 2-1 ante Croacia.", time: "hace 2 min" },
  { id: "n2", type: "important", title: "Inicia el partido estelar", body: "USA vs Inglaterra arranca a las 17:00 en SoFi Stadium.", time: "hace 18 min" },
  { id: "n3", type: "alert", title: "Cambio de horario", body: "Francia vs Alemania se adelanta 30 minutos.", time: "hace 1 h" },
  { id: "n4", type: "info", title: "Nueva polla disponible", body: "Únete a 'Octavos 2026' antes del cierre.", time: "hace 3 h", read: true },
  { id: "n5", type: "info", title: "Lámina nueva", body: "Recibiste 3 stickers en tu álbum.", time: "ayer", read: true },
];

export type Pool = {
  id: string;
  name: string;
  members: number;
  prize: string;
  myRank: number;
  myPoints: number;
  topPoints: number;
};

export const POOLS: Pool[] = [
  { id: "p1", name: "Amigos del Azteca", members: 24, prize: "Cena ganador", myRank: 3, myPoints: 87, topPoints: 102 },
  { id: "p2", name: "Oficina FC", members: 48, prize: "$5,000 MXN", myRank: 12, myPoints: 64, topPoints: 118 },
  { id: "p3", name: "Familia Mundialista", members: 9, prize: "Trofeo casero", myRank: 1, myPoints: 95, topPoints: 95 },
];

export const RANKING = [
  { name: "Carla M.", points: 102, avatar: "CM" },
  { name: "Diego R.", points: 96, avatar: "DR" },
  { name: "Tú", points: 87, avatar: "TÚ", isMe: true },
  { name: "Luis P.", points: 81, avatar: "LP" },
  { name: "Ana S.", points: 74, avatar: "AS" },
  { name: "Mario V.", points: 69, avatar: "MV" },
  { name: "Paula G.", points: 60, avatar: "PG" },
];

export type Sticker = {
  id: string;
  team: string;
  number: number;
  player: string;
  owned: number; // 0 = missing, 1 = ok, >1 = repeated
  shiny?: boolean;
};

const players: Record<string, string[]> = {
  MEX: ["S. Giménez", "H. Lozano", "E. Álvarez", "G. Ochoa", "C. Rodríguez"],
  ARG: ["L. Messi", "J. Álvarez", "E. Martínez", "R. De Paul", "C. Romero"],
  BRA: ["Vinicius Jr", "Rodrygo", "Casemiro", "Alisson", "Marquinhos"],
  FRA: ["K. Mbappé", "A. Griezmann", "T. Hernández", "A. Tchouaméni", "M. Maignan"],
  ESP: ["Lamine Yamal", "Pedri", "Rodri", "U. Simón", "Á. Morata"],
  ENG: ["H. Kane", "J. Bellingham", "B. Saka", "D. Rice", "J. Pickford"],
};

export const STICKERS: Sticker[] = Object.entries(players).flatMap(([code, list]) =>
  list.map((player, i) => ({
    id: `${code}-${i}`,
    team: code,
    number: i + 1,
    player,
    owned: [1, 0, 2, 1, 3][i % 5],
    shiny: i === 0,
  }))
);
