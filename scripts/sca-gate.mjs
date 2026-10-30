#!/usr/bin/env node
/**
 * Software Composition Analysis gate (BSN-007-05).
 *
 * Runs osv-scanner over the lockfile and fails when anything at or above the
 * severity threshold is left unexplained. Exceptions are not expressed here:
 * they live in osv-scanner.toml, where each one has to carry a reason, so a
 * silenced finding is always a documented decision rather than a flag someone
 * added to a command line.
 *
 * Usage:  node scripts/sca-gate.mjs [--threshold 7.0] [--json] [--input report.json]
 *
 * With --input the scan is not run here; the file is read instead. CI uses that
 * so the scanner can run in its own image and this step only judges the result.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const DEFAULT_THRESHOLD = 7.0
const LOCKFILE = 'package-lock.json'
const CONFIG = 'osv-scanner.toml'

function parseArgs(argv) {
  const args = { threshold: Number(process.env.SCA_THRESHOLD ?? DEFAULT_THRESHOLD), json: false }

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--threshold') args.threshold = Number(argv[++i])
    else if (argv[i] === '--json') args.json = true
    else if (argv[i] === '--input') args.input = argv[++i]
  }

  if (!Number.isFinite(args.threshold)) {
    console.error('sca-gate: threshold must be a number')
    process.exit(2)
  }

  return args
}

function runScanner() {
  const scan = spawnSync(
    'osv-scanner',
    [
      'scan',
      'source',
      `--lockfile=${LOCKFILE}`,
      ...(existsSync(CONFIG) ? [`--config=${CONFIG}`] : []),
      '--format=json',
    ],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
  )

  if (scan.error?.code === 'ENOENT') {
    console.error('sca-gate: osv-scanner is not installed or not on PATH')
    console.error('          see https://google.github.io/osv-scanner/installation/')
    process.exit(2)
  }

  // osv-scanner exits 1 when it finds vulnerabilities, which is not a failure
  // of the scan itself. Anything else is.
  if (scan.status !== 0 && scan.status !== 1) {
    console.error(`sca-gate: osv-scanner exited ${scan.status}`)
    console.error(scan.stderr?.trim())
    process.exit(2)
  }

  try {
    return JSON.parse(scan.stdout)
  } catch {
    console.error('sca-gate: could not parse osv-scanner output as JSON')
    console.error(scan.stderr?.trim())
    process.exit(2)
  }
}

function collectFindings(report) {
  const findings = []

  for (const result of report.results ?? []) {
    for (const entry of result.packages ?? []) {
      const ids = new Set()
      let severity = 0

      for (const group of entry.groups ?? []) {
        const value = Number(group.max_severity)
        if (Number.isFinite(value)) severity = Math.max(severity, value)
        for (const id of group.ids ?? []) ids.add(id)
      }

      findings.push({
        name: entry.package.name,
        version: entry.package.version,
        severity,
        ids: [...ids],
      })
    }
  }

  return findings.sort((a, b) => b.severity - a.severity)
}

function readReport(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    console.error(`sca-gate: could not read ${path}: ${error.message}`)
    process.exit(2)
  }
}

const args = parseArgs(process.argv.slice(2))
const findings = collectFindings(args.input ? readReport(args.input) : runScanner())
const blocking = findings.filter((f) => f.severity >= args.threshold)
const below = findings.filter((f) => f.severity < args.threshold)

if (args.json) {
  console.log(JSON.stringify({ threshold: args.threshold, blocking, below }, null, 2))
} else {
  for (const f of blocking) {
    console.log(`  BLOCKING  ${String(f.severity).padEnd(5)} ${f.name}@${f.version}  ${f.ids.join(', ')}`)
  }
  console.log(
    `\nsca-gate: ${blocking.length} finding(s) at or above CVSS ${args.threshold}, ` +
      `${below.length} below it.`
  )
}

if (blocking.length > 0) {
  console.error(
    '\nEach of these must be fixed by upgrading, or recorded in osv-scanner.toml with a\n' +
      'reason explaining why it cannot reach this application. Exceptions are reviewed\n' +
      'like any other change.'
  )
  process.exit(1)
}
