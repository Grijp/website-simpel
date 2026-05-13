import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')
const src = path.join(publicDir, 'logo.svg')
const out = path.join(publicDir, 'logo-desktop-chaos-structure.svg')

let s = fs.readFileSync(src, 'utf8')

const newDefs = `<defs>
  <linearGradient id="ldsChaos" x1="0" y1="0" x2="165" y2="350" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#f0abfc"/>
    <stop offset="0.55" stop-color="#c084fc"/>
    <stop offset="1" stop-color="#6d28d9"/>
  </linearGradient>
  <linearGradient id="ldsStructure" x1="165" y1="0" x2="330" y2="350" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#7dd3fc"/>
    <stop offset="0.45" stop-color="#38bdf8"/>
    <stop offset="1" stop-color="#06b6d4"/>
  </linearGradient>
</defs>`

s = s.replace(/<defs>[\s\S]*?<\/defs>/, newDefs)

const marker = '<g id="linkerhelft_1">'
const i = s.indexOf(marker)
if (i < 0) throw new Error('linkerhelft group not found')

const beforeLinker = s.slice(0, i)
const fromLinker = s.slice(i)

const beforeFixed = beforeLinker.replace(/fill="currentColor"/g, 'fill="url(#ldsStructure)"')
const fromFixed = fromLinker.replace(/fill="currentColor"/g, 'fill="url(#ldsChaos)"')

fs.writeFileSync(out, beforeFixed + fromFixed)
console.log('wrote', out)
