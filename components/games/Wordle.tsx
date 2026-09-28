'use client';

import { useEffect, useState } from 'react';

const LEN = 5;
const MAX = 6;

const WORDS = [
  'ABOUT','ABOVE','ABUSE','ACTOR','ACUTE','ADMIT','ADOPT','ADULT','AFTER','AGAIN',
  'AGENT','AGREE','AHEAD','ALARM','ALBUM','ALERT','ALIKE','ALIVE','ALLEY','ALLOW',
  'ALONE','ALONG','ALTER','ANGEL','ANGER','ANGLE','ANGRY','ANKLE','APART','APPLE',
  'APPLY','ARENA','ARGUE','ARISE','ARMOR','AROMA','AROSE','ARROW','ASSET','ATLAS',
  'ATTIC','AUDIO','AUDIT','AVOID','AWAKE','AWARD','AWARE','AWFUL','BADLY','BAKER',
  'BASIC','BASIS','BATCH','BEACH','BEGAN','BEGIN','BEING','BELOW','BENCH','BERRY',
  'BIRTH','BLACK','BLADE','BLAME','BLANK','BLAST','BLAZE','BLEED','BLEND','BLESS',
  'BLIND','BLOCK','BLOOD','BLOOM','BLOWN','BOARD','BONUS','BOOST','BOOTH','BOUND',
  'BRACE','BRAIN','BRAND','BRAVE','BREAK','BREED','BRICK','BRIDE','BRIEF','BRING',
  'BROAD','BROWN','BRUSH','BUILD','BUILT','BUNCH','BURST','CABIN','CABLE','CANDY',
  'CARGO','CARRY','CATCH','CAUSE','CHAIN','CHAIR','CHAOS','CHARM','CHART','CHASE',
  'CHEAP','CHECK','CHEER','CHESS','CHEST','CHIEF','CHILD','CHORD','CIVIC','CIVIL',
  'CLAIM','CLASS','CLEAN','CLEAR','CLERK','CLICK','CLIFF','CLIMB','CLOCK','CLONE',
  'CLOSE','CLOUD','CLOWN','COACH','COAST','COLOR','COMIC','CORAL','COUNT','COURT',
  'COVER','CRACK','CRAFT','CRASH','CRAZY','CREAM','CREEK','CRIME','CROSS','CROWD',
  'CROWN','CRUEL','CRUSH','CURVE','CYCLE','DAILY','DANCE','DATUM','DECAY','DELAY',
  'DENSE','DEPTH','DEVIL','DIGIT','DISCO','DIZZY','DODGE','DOUBT','DRAFT','DRAIN',
  'DRAMA','DREAM','DRESS','DRIFT','DRINK','DRIVE','DRONE','DROVE','DROWN','DYING',
  'EAGER','EARLY','EARTH','EIGHT','ELITE','EMPTY','ENEMY','ENTER','EQUAL','ERROR',
  'ESSAY','EVENT','EVERY','EXACT','EXIST','EXTRA','FABLE','FAITH','FALSE','FANCY',
  'FATAL','FEAST','FENCE','FEVER','FIBER','FIELD','FIFTH','FIFTY','FIGHT','FINAL',
  'FIRST','FIXED','FLAME','FLASH','FLESH','FLOOD','FLOOR','FLOUR','FLUID','FLUTE',
  'FOCUS','FORCE','FORGE','FORTH','FORUM','FOUND','FRAME','FRAUD','FRESH','FRONT',
  'FROST','FRUIT','FUNNY','FUZZY','GHOST','GIANT','GIVEN','GLASS','GLOBE','GLORY',
  'GLOVE','GRACE','GRADE','GRAIN','GRAND','GRANT','GRAPH','GRASP','GRASS','GRAVE',
  'GREAT','GREED','GREEN','GREET','GRIEF','GRIND','GROUP','GROVE','GUARD','GUESS',
  'GUEST','GUIDE','GUILD','GUILT','HANDY','HAPPY','HARSH','HAVEN','HEART','HEAVY',
  'HENCE','HINGE','HOBBY','HONEY','HONOR','HORSE','HOTEL','HOUSE','HUMAN','HUMOR',
  'HURRY','IDEAL','IMAGE','INDEX','INNER','INPUT','INTRO','ISSUE','JOKER','JOLLY',
  'JUDGE','JUICE','JUICY','JUMBO','KNIFE','KNOCK','KNOWN','LABEL','LANCE','LARGE',
  'LASER','LATER','LAUGH','LAYER','LEARN','LEASE','LEAST','LEAVE','LEGAL','LEMON',
  'LEVEL','LIGHT','LIMIT','LOCAL','LODGE','LOGIC','LOOSE','LOVER','LOWER','LUCKY',
  'LUNAR','MAGIC','MANOR','MAPLE','MARCH','MEDIA','MERCY','MERGE','METAL','MIGHT',
  'MODEL','MONEY','MONTH','MORAL','MOTOR','MOUNT','MOUSE','MOUTH','MOVIE','MUSIC',
  'NERVE','NIGHT','NOBLE','NOISE','NORTH','NOTCH','NOVEL','NURSE','OCCUR','OCEAN',
  'OFTEN','ORDER','OTHER','OUTER','OWNER','OZONE','PAINT','PANEL','PANIC','PAPER',
  'PARTY','PASTA','PATCH','PAUSE','PEACE','PEARL','PHASE','PHONE','PHOTO','PIANO',
  'PIECE','PILOT','PLACE','PLAIN','PLANE','PLANT','PLATE','PLAZA','POINT','POLAR',
  'POWER','PRESS','PRICE','PRIDE','PRIME','PRINT','PRIOR','PRIZE','PROBE','PROOF',
  'PROUD','PROVE','PULSE','PUNCH','PUPIL','PURSE','QUEEN','QUEST','QUICK','QUIET',
  'QUOTA','QUOTE','RADAR','RADIO','RAISE','RALLY','RANCH','RANGE','RAPID','REACT',
  'READY','REALM','REBEL','REIGN','RELAX','RIDER','RIDGE','RIFLE','RIGHT','RIGID',
  'RISKY','RIVAL','RIVER','ROBOT','ROCKY','ROUGH','ROUND','ROUTE','ROYAL','RULER',
  'RURAL','SALAD','SAUCE','SCALE','SCENE','SCORE','SCOUT','SEIZE','SENSE','SERVE',
  'SEVEN','SHADE','SHAKE','SHALL','SHAME','SHAPE','SHARE','SHARK','SHARP','SHEET',
  'SHELF','SHELL','SHIFT','SHINE','SHIRT','SHOCK','SHORE','SHORT','SHOUT','SIGHT',
  'SINCE','SIXTY','SKILL','SKULL','SLATE','SLEEP','SLICE','SLOPE','SMILE','SMOKE',
  'SNAKE','SOLAR','SOLID','SOLVE','SOUTH','SPACE','SPARE','SPARK','SPEAR','SPEED',
  'SPEND','SPICE','SPINE','SPLIT','SPORT','SPRAY','SQUAD','STACK','STAFF','STAGE',
  'STAKE','STAMP','STAND','STARE','START','STATE','STEAM','STEEL','STICK','STILL',
  'STOCK','STONE','STORE','STORM','STORY','STRAP','STRAW','STUCK','STUDY','STUFF',
  'STYLE','SUGAR','SUITE','SUNNY','SUPER','SURGE','SWORD','TABLE','TEETH','THERE',
  'THICK','THING','THINK','THORN','THOSE','THREE','THREW','THROW','TIGER','TIGHT',
  'TIRED','TITLE','TODAY','TOKEN','TOPIC','TOTAL','TOUCH','TOUGH','TOWEL','TOWER',
  'TOXIC','TRACE','TRACK','TRADE','TRAIL','TRAIN','TRAIT','TREND','TRIAL','TRIBE',
  'TRICK','TRIED','TRUCK','TRULY','TRUNK','TRUST','TRUTH','TULIP','TWIST','ULTRA',
  'UNDER','UNION','UNTIL','UPPER','UPSET','URBAN','USAGE','USUAL','VALID','VALUE',
  'VAPOR','VAULT','VERSE','VIGOR','VIRAL','VIRUS','VISIT','VITAL','VOCAL','VOICE',
  'WAGON','WASTE','WATCH','WATER','WEARY','WEAVE','WEIRD','WHALE','WHEAT','WHEEL',
  'WHITE','WHOLE','WITCH','WOMAN','WOMEN','WORLD','WORRY','WORSE','WORTH','WOULD',
  'WRITE','WROTE','YACHT','YIELD','YOUNG','YOURS','YOUTH','ZEBRA',
];

const pick = () => WORDS[Math.floor(Math.random() * WORDS.length)];

type Clue = 'correct' | 'present' | 'absent';
type GamePhase = 'playing' | 'won' | 'lost';

function grade(guess: string, answer: string): Clue[] {
  const out: Clue[] = Array(LEN).fill('absent');
  const pool = answer.split('') as (string | null)[];
  for (let i = 0; i < LEN; i++) {
    if (guess[i] === answer[i]) { out[i] = 'correct'; pool[i] = null; }
  }
  for (let i = 0; i < LEN; i++) {
    if (out[i] === 'correct') continue;
    const j = pool.indexOf(guess[i]);
    if (j !== -1) { out[i] = 'present'; pool[j] = null; }
  }
  return out;
}

const CS = 48, GAP = 5;
interface Props { onExit: () => void }

export default function Wordle({ onExit: _ }: Props) {
  const [answer,  setAnswer]  = useState(pick);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [clues,   setClues]   = useState<Clue[][]>([]);
  const [current, setCurrent] = useState('');
  const [phase,   setPhase]   = useState<GamePhase>('playing');
  const [shake,   setShake]   = useState(false);
  const [msg,     setMsg]     = useState('');

  function flash(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(''), 1600);
  }

  function restart() {
    setAnswer(pick());
    setGuesses([]);
    setClues([]);
    setCurrent('');
    setPhase('playing');
    setMsg('');
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'playing') {
        if (e.key === 'Enter') restart();
        return;
      }
      if (e.key === 'Backspace') { setCurrent(c => c.slice(0, -1)); return; }
      if (e.key === 'Enter') {
        if (current.length < LEN) {
          setShake(true); setTimeout(() => setShake(false), 380);
          flash('not enough letters'); return;
        }
        const g = grade(current, answer);
        const ng = [...guesses, current];
        const nc = [...clues, g];
        setGuesses(ng); setClues(nc); setCurrent('');
        if (current === answer) setPhase('won');
        else if (ng.length >= MAX) setPhase('lost');
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key) && current.length < LEN)
        setCurrent(c => (c + e.key.toUpperCase()).slice(0, LEN));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, current, guesses, clues, answer]);

  const cellStyle = (clue: Clue | 'empty' | 'active'): React.CSSProperties => ({
    width: CS, height: CS, borderRadius: 4,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'monospace', fontSize: 20, fontWeight: 700,
    transition: 'background 0.15s',
    ...(clue === 'correct' ? { background: '#4ade80', color: '#0a0a0a', border: '2px solid transparent' }
      : clue === 'present' ? { background: '#fbbf24', color: '#0a0a0a', border: '2px solid transparent' }
      : clue === 'absent'  ? { background: '#1e1e1e', color: 'rgba(255,255,255,0.4)', border: '2px solid transparent' }
      : clue === 'active'  ? { background: '#141414', color: 'rgba(255,255,255,0.85)', border: '2px solid rgba(255,255,255,0.35)' }
      :                       { background: '#0f0f0f', color: 'transparent', border: '2px solid rgba(255,255,255,0.08)' }),
  });

  const gridW = LEN * CS + (LEN - 1) * GAP;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0 12px', gap: 10, background: '#0a0a0a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: gridW, fontFamily: 'monospace', fontSize: 12 }}>
        <span style={{ color: '#4ade80' }}>wo4dle</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>{MAX - guesses.length} guesses left</span>
      </div>

      {msg && (
        <div style={{ background: 'rgba(255,255,255,0.88)', color: '#0a0a0a', fontFamily: 'monospace', fontSize: 12, padding: '3px 12px', borderRadius: 4 }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
        {Array.from({ length: MAX }, (_, row) => {
          const done   = row < guesses.length;
          const active = row === guesses.length && phase === 'playing';
          const word   = done ? guesses[row] : active ? current.padEnd(LEN) : ' '.repeat(LEN);
          const rowClues = done ? clues[row] : null;
          return (
            <div key={row} style={{ display: 'flex', gap: GAP, animation: active && shake ? 'w4shake 0.38s' : 'none' }}>
              {Array.from({ length: LEN }, (_, col) => {
                const ch   = word[col];
                const clue: Clue | 'empty' | 'active' = rowClues
                  ? rowClues[col]
                  : active && ch.trim() ? 'active' : 'empty';
                return <div key={col} style={cellStyle(clue)}>{ch?.trim() || ''}</div>;
              })}
            </div>
          );
        })}
      </div>

      {phase === 'won' && (
        <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
          <div style={{ color: '#4ade80', fontSize: 13 }}>got it in {guesses.length}!</div>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 3 }}>enter to play again</div>
        </div>
      )}
      {phase === 'lost' && (
        <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
          <div style={{ color: '#f87171', fontSize: 13 }}>
            the word was <span style={{ color: '#fff' }}>{answer}</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 3 }}>enter to play again</div>
        </div>
      )}

      <span style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace', fontSize: 11 }}>esc — back to terminal</span>

      <style>{`
        @keyframes w4shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-7px); }
          40%     { transform: translateX(7px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
