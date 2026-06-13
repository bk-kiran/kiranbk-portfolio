'use client';

import { useState, useEffect, useMemo, useRef } from 'react';

const APP_EXIT_EVENT = 'portfolio:app-exit';

const WORDS = [
  'about','above','abuse','actor','acute','admit','adopt','adult','after','again',
  'agent','agree','ahead','alarm','album','alert','alike','alien','alive','alley',
  'allow','alone','along','alter','angel','anger','angle','ankle','apart','apple',
  'apply','arena','argue','arise','armor','aroma','array','arrow','aside','atlas',
  'attic','audio','audit','avoid','aware','awful','bacon','badge','basic','basin',
  'batch','beach','beard','beast','below','bench','berry','birth','black','blade',
  'blame','blank','blast','blaze','bleed','blend','bless','blind','blink','block',
  'blood','bloom','board','boost','booth','bound','brave','break','breed','bride',
  'brief','bring','broad','broke','brook','brown','brush','build','built','burst',
  'buyer','cabin','cable','candy','cargo','carry','catch','cause','chain','chair',
  'chaos','charm','chase','cheap','check','chess','chest','choke','chord','chunk',
  'civic','civil','claim','clash','clasp','class','clean','clear','click','cliff',
  'climb','cling','clock','clone','cloud','coach','coast','coral','count','court',
  'cover','crack','craft','crane','crash','crazy','cream','crime','crisp','cross',
  'crowd','crown','crude','cruel','crush','curve','daily','dance','decay','delay',
  'delta','demon','dense','depot','depth','diary','dirty','dodge','doubt','dough',
  'draft','drain','drama','drawn','dread','dream','dress','dried','drift','drink',
  'drive','drove','drown','dwarf','dwell','eagle','early','earth','eight','elite',
  'ember','empty','enjoy','enter','equal','error','essay','event','every','exact',
  'exist','extra','fable','faith','fancy','fatal','feast','field','fight','final',
  'first','fixed','flame','flare','flash','fleet','flesh','flock','flood','floor',
  'focal','force','forge','forth','found','frame','frank','fraud','fresh','front',
  'fruit','funky','ghost','giant','given','glass','globe','gloom','glory','gloss',
  'glove','grace','grade','grain','grand','grant','grape','grasp','grass','grave',
  'great','green','greet','grief','grind','groan','gross','group','grove','grown',
  'guess','guest','guild','gusto','habit','harsh','haunt','haven','heart','heavy',
  'hedge','hence','hinge','holly','honey','honor','horse','hotel','house','human',
  'humor','ideal','image','imply','index','input','irony','issue','juice','juicy',
  'karma','knife','knock','known','label','large','laser','laugh','layer','learn',
  'lease','leave','legal','lemon','level','light','limit','local','lodge','logic',
  'loose','lover','lower','lucky','lunch','lunar','lyric','magic','major','maker',
  'manor','maple','march','match','mayor','media','mercy','merit','metal','metro',
  'might','minor','minus','model','money','month','moral','motel','motor','motto',
  'mouse','mouth','movie','music','naive','nerve','night','noble','noise','north',
  'noted','novel','nudge','nurse','ocean','offer','olive','omega','onset','opera',
  'orbit','order','other','ought','outer','ozone','paint','panic','pasta','patch',
  'pause','peace','pearl','penny','phase','phone','photo','piano','piece','pilot',
  'pinch','pixel','place','plain','plane','plant','plate','plaza','plead','pluck',
  'point','polar','pouch','power','press','price','pride','prime','print','prior',
  'prize','probe','prone','proof','prose','proud','proxy','pulse','punch','query',
  'quick','quiet','quota','quote','radar','radio','raise','rally','ranch','range',
  'rapid','ratio','reach','react','realm','rebel','refer','reign','relax','relay',
  'relic','remix','rider','ridge','rifle','right','rigid','risky','rivet','robot',
  'rocky','rouge','round','route','royal','rugby','ruler','rural','safer','saint',
  'salad','sales','sauce','scale','scare','scene','scent','scope','score','scout',
  'screw','seize','sense','setup','seven','share','shark','sharp','shelf','shell',
  'shift','shirt','short','shout','shove','shrug','sight','silly','since','sixth',
  'sized','skill','skull','slash','slave','slice','slide','slope','slump','small',
  'smart','smile','smoke','solar','solid','solve','south','space','spare','spark',
  'speak','spell','spend','spicy','spine','spite','split','spoon','sport','squad',
  'squid','stack','staff','stage','stain','stake','stale','start','state','steam',
  'steel','steep','sting','stock','stone','store','storm','story','stove','strap',
  'straw','stray','strip','study','style','surge','sweep','sweet','swift','swing',
  'swirl','sword','table','taste','teach','teeth','tense','theft','there','thick',
  'thing','think','third','three','throw','thumb','tiger','tight','timer','title',
  'today','token','torch','touch','total','toxic','trace','track','trade','trail',
  'train','trait','trash','trend','trial','trick','tried','troll','trunk','truth',
  'tweak','twice','twist','ultra','under','union','until','upper','valid','value',
  'valve','vapor','vault','video','vigor','viral','visit','vital','vivid','vocal',
  'voice','voter','water','waive','wedge','weigh','weird','while','whole','whose',
  'wider','windy','witch','world','worry','worse','worst','worth','would','yacht',
  'yield','young','youth','zebra','zesty',
];

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (((hash << 5) + hash) + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getTodayWord(): string {
  const seed = new Date().toISOString().split('T')[0];
  return WORDS[djb2(seed) % WORDS.length];
}

function getDayNumber(): number {
  return Math.floor((Date.now() - new Date('2025-01-01').getTime()) / 86400000) + 1;
}

type CellState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

function evaluateGuess(guess: string, answer: string): CellState[] {
  const result: CellState[] = Array(5).fill('absent');
  const ans = answer.split('');
  const g = guess.split('');
  for (let i = 0; i < 5; i++) {
    if (g[i] === ans[i]) { result[i] = 'correct'; ans[i] = '\0'; g[i] = '\0'; }
  }
  for (let i = 0; i < 5; i++) {
    if (g[i] === '\0') continue;
    const j = ans.indexOf(g[i]);
    if (j !== -1) { result[i] = 'present'; ans[j] = '\0'; }
  }
  return result;
}

const BG: Record<CellState, string> = {
  correct: '#538d4e', present: '#b59f3b', absent: '#3a3a3c',
  empty: 'transparent', tbd: 'transparent',
};
const BORDER: Record<CellState, string> = {
  correct: '#538d4e', present: '#b59f3b', absent: '#3a3a3c',
  empty: 'rgba(255,255,255,0.2)', tbd: 'rgba(255,255,255,0.6)',
};

function Tile({ letter, state }: { letter: string; state: CellState }) {
  return (
    <div style={{
      width: 44, height: 44, display: 'flex', alignItems: 'center',
      justifyContent: 'center', border: `2px solid ${BORDER[state]}`,
      background: BG[state], color: state === 'empty' || state === 'tbd' ? '#fff' : '#fff',
      fontWeight: 700, fontSize: 18, textTransform: 'uppercase', borderRadius: 2,
      transition: 'background 0.3s',
    }}>
      {letter}
    </div>
  );
}

const KEYBOARD_ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['↵','z','x','c','v','b','n','m','⌫'],
];

interface GameState {
  guesses: string[];
  currentInput: string;
  gameOver: boolean;
  gameWon: boolean;
}

function loadState(key: string): GameState {
  if (typeof window === 'undefined') return { guesses: [], currentInput: '', gameOver: false, gameWon: false };
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as GameState;
  } catch { /* ignore */ }
  return { guesses: [], currentInput: '', gameOver: false, gameWon: false };
}

export default function Wordle() {
  const word = useMemo(() => getTodayWord(), []);
  const dayNum = useMemo(() => getDayNumber(), []);
  const storageKey = useMemo(() => `wordle-${new Date().toISOString().split('T')[0]}`, []);

  const [state, setState] = useState<GameState>(() => loadState(storageKey));
  const [copied, setCopied] = useState(false);
  const activeRef = useRef(true);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state, storageKey]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!activeRef.current) return;

      if (e.key === 'Escape') {
        activeRef.current = false;
        window.dispatchEvent(new CustomEvent(APP_EXIT_EVENT));
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        setState(prev => prev.gameOver ? prev : { ...prev, currentInput: prev.currentInput.slice(0, -1) });
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        setState(prev => {
          if (prev.gameOver || prev.currentInput.length !== 5) return prev;
          const guess = prev.currentInput.toLowerCase();
          const newGuesses = [...prev.guesses, guess];
          const won = guess === word;
          const over = won || newGuesses.length === 6;
          return { ...prev, guesses: newGuesses, currentInput: '', gameOver: over, gameWon: won };
        });
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        setState(prev => {
          if (prev.gameOver || prev.currentInput.length >= 5) return prev;
          return { ...prev, currentInput: prev.currentInput + e.key.toLowerCase() };
        });
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [word]);

  // Build letter states for keyboard coloring
  const letterStates: Record<string, CellState> = {};
  for (const guess of state.guesses) {
    const ev = evaluateGuess(guess, word);
    guess.split('').forEach((letter, i) => {
      const cur = letterStates[letter];
      const next = ev[i];
      if (cur === 'correct') return;
      if (cur === 'present' && next !== 'correct') return;
      letterStates[letter] = next;
    });
  }

  // Build board rows
  const rows = Array.from({ length: 6 }, (_, i) => {
    if (i < state.guesses.length) {
      const g = state.guesses[i];
      return { letters: g.split(''), states: evaluateGuess(g, word) };
    }
    if (i === state.guesses.length && !state.gameOver) {
      const letters = state.currentInput.padEnd(5, ' ').split('');
      const states: CellState[] = letters.map((_, j) => j < state.currentInput.length ? 'tbd' : 'empty');
      return { letters: state.currentInput.padEnd(5, '').split(''), states };
    }
    return { letters: ['', '', '', '', ''], states: ['empty', 'empty', 'empty', 'empty', 'empty'] as CellState[] };
  });

  function keyBg(key: string): string {
    const s = letterStates[key];
    return s ? BG[s] : '#818384';
  }

  function shareResult() {
    const emoji = state.guesses.map(g =>
      evaluateGuess(g, word).map(s => s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛').join('')
    ).join('\n');
    const text = `kiran.sh · day ${dayNum} ${state.guesses.length}/6\n\n${emoji}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => { /* ignore */ });
  }

  return (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
      {/* Game column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ color: 'var(--color-text-dim)', fontSize: 12 }}>
          WORDLE · day {dayNum}
        </div>

        {/* Board */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {rows.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 4 }}>
              {row.letters.map((letter, ci) => (
                <Tile key={ci} letter={letter} state={row.states[ci]} />
              ))}
            </div>
          ))}
        </div>

        {/* Status */}
        {state.gameOver && (
          <div style={{ fontSize: 12 }}>
            {state.gameWon
              ? <div style={{ color: 'var(--color-green)' }}>solved in {state.guesses.length}/6</div>
              : <div style={{ color: 'var(--color-red)' }}>the word was: {word.toUpperCase()}</div>
            }
            <button
              onClick={shareResult}
              style={{
                marginTop: 6, color: copied ? 'var(--color-green)' : 'var(--color-yellow)',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 12, padding: 0,
              }}
            >
              {copied ? '✓ copied to clipboard' : '↗ share result'}
            </button>
            <div style={{ marginTop: 4, color: 'var(--color-text-dim)', fontSize: 11 }}>
              Esc to exit
            </div>
          </div>
        )}

        {/* Keyboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 4, justifyContent: ri === 1 ? 'center' : 'flex-start' }}>
              {row.map(key => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === '↵') {
                      const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
                      document.dispatchEvent(ev);
                    } else if (key === '⌫') {
                      const ev = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true });
                      document.dispatchEvent(ev);
                    } else {
                      const ev = new KeyboardEvent('keydown', { key, bubbles: true });
                      document.dispatchEvent(ev);
                    }
                  }}
                  style={{
                    background: keyBg(key), color: '#fff', border: 'none', borderRadius: 3,
                    padding: key === '↵' || key === '⌫' ? '7px 8px' : '7px 0',
                    width: key === '↵' || key === '⌫' ? 44 : 30,
                    fontFamily: 'inherit', fontSize: 11, cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Info panel */}
      <div style={{
        borderLeft: '1px solid var(--color-border)', paddingLeft: 24,
        color: 'var(--color-text-dim)', maxWidth: 240, fontSize: 11, lineHeight: 1.8,
      }}>
        <div style={{ color: 'var(--color-cyan)', fontWeight: 600, marginBottom: 8 }}>
          how this works
        </div>
        <div>Seeded daily word from a {WORDS.length}-word curated list.</div>
        <div style={{ marginTop: 6 }}>
          djb2 hash of today&apos;s date picks the word — same for every visitor. No API, no server.
        </div>
        <div style={{ marginTop: 8 }}>State persisted to localStorage. Refresh to continue your current game.</div>
        <div style={{ marginTop: 12, color: 'var(--color-text-dim)' }}>
          <div>⌨ Type letters to guess</div>
          <div>↵ Enter to submit</div>
          <div>⌫ Backspace to delete</div>
          <div>Esc to exit</div>
        </div>
      </div>
    </div>
  );
}
