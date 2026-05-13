/**
 * Particle paden gelijk aan (of afgeleid van) `public/achtergrond-verticaal-minder-chaos.svg`.
 * ViewBox 952×1330 — zelfde als de achtergrond-raster.
 *
 * Verticale gridlijnen: op mobiel = boven → beneden; op desktop staat dezelfde SVG
 * onder rotate(270deg), dus die lijnen lopen visueel links → rechts over het lijnennet.
 */

export const ART_BG_VIEWBOX = '0 0 952 1330'

/** Open paden (geen gesloten loops) voor getPointAtLength. */
export const ART_PARTICLE_BASE_TRACKS = [
  {
    id: 'artGridV190',
    d: 'M190.4 0 L190.4 1330',
    startCx: 190.4,
    startCy: 0,
    delaySec: 0,
    durationSec: 52,
    r: 2.35,
    zone: 'chaos',
  },
  {
    id: 'artGridV381',
    d: 'M380.8 0 L380.8 1330',
    startCx: 380.8,
    startCy: 0,
    delaySec: -9,
    durationSec: 56,
    r: 2.25,
    zone: 'chaos',
  },
  {
    id: 'artGridV571',
    d: 'M571.2 0 L571.2 1330',
    startCx: 571.2,
    startCy: 0,
    delaySec: -18,
    durationSec: 54,
    r: 2.25,
    zone: 'mid',
  },
  {
    id: 'artGridV762',
    d: 'M761.6 0 L761.6 1330',
    startCx: 761.6,
    startCy: 0,
    delaySec: -27,
    durationSec: 50,
    r: 2.2,
    zone: 'structure',
  },
  {
    id: 'artCurveTwinL',
    d: 'M95.2 0 C380.2 285 285.2 570 475.2 665',
    startCx: 95.2,
    startCy: 0,
    delaySec: -4,
    durationSec: 58,
    r: 2.15,
    zone: 'chaos',
  },
  {
    id: 'artCurveTwinR',
    d: 'M856 0 C571 285 666 570 476 665',
    startCx: 856,
    startCy: 0,
    delaySec: -14,
    durationSec: 58,
    r: 2.15,
    zone: 'structure',
  },
  {
    id: 'artCurveBandL',
    d: 'M142.8 95 C332.8 47.5 237.8 380 470.55 660.25',
    startCx: 142.8,
    startCy: 95,
    delaySec: -22,
    durationSec: 60,
    r: 2.05,
    zone: 'chaos',
  },
  {
    id: 'artCurveBandR',
    d: 'M808.51 95 C618.51 47.5 713.51 380 480.76 660.25',
    startCx: 808.51,
    startCy: 95,
    delaySec: -31,
    durationSec: 60,
    r: 2.05,
    zone: 'structure',
  },
]

const MOBILE_COPIES = 2
const MOBILE_SPEED = 4.2

const DESKTOP_COPIES = 2
const DESKTOP_SPEED = 4.2

function expandTracks(base, copies, speed) {
  return base.flatMap((g, idx) => {
    const dur = Math.max(9, g.durationSec / speed)
    return Array.from({ length: copies }, (_, k) => ({
      ...g,
      id: `${g.id}__${k}`,
      durationSec: dur,
      delaySec: g.delaySec - k * dur * 0.38 - idx * 0.28,
      r: g.r * 1.12,
    }))
  })
}

export const MOBILE_ART_PARTICLE_TRACKS = expandTracks(ART_PARTICLE_BASE_TRACKS, MOBILE_COPIES, MOBILE_SPEED)

export const DESKTOP_ART_PARTICLE_TRACKS = expandTracks(ART_PARTICLE_BASE_TRACKS, DESKTOP_COPIES, DESKTOP_SPEED)
