#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const VERSION_PATTERN = /^\d{2}\.\d{2}\.\d{2}\.\d{3}$/
const APP_VERSION_PATTERN = /^const APP_VERSION = "([^"]+)";$/m
const rootDir = process.cwd()

const files = {
	packageJson: path.join(rootDir, 'package.json'),
	packageLock: path.join(rootDir, 'package-lock.json'),
	serviceWorker: path.join(rootDir, 'public/service-worker.js'),
}

const command = process.argv[2]
const version = process.argv[3]

function assertVersion(value) {
	if (!VERSION_PATTERN.test(value)) {
		throw new Error(`Invalid version "${value}". Expected YY.MM.DD.BUILD`)
	}
}

function detectIndent(raw) {
	return raw.includes('\n\t') ? '\t' : '  '
}

async function readJson(filePath) {
	const raw = await readFile(filePath, 'utf8')
	return { raw, json: JSON.parse(raw) }
}

async function writeJson(filePath, raw, json) {
	const indent = detectIndent(raw)
	await writeFile(filePath, `${JSON.stringify(json, null, indent)}\n`)
}

async function syncVersion(nextVersion) {
	assertVersion(nextVersion)

	const packageJson = await readJson(files.packageJson)
	packageJson.json.version = nextVersion
	await writeJson(files.packageJson, packageJson.raw, packageJson.json)

	const packageLock = await readJson(files.packageLock)
	packageLock.json.version = nextVersion
	if (packageLock.json.packages?.['']) {
		packageLock.json.packages[''].version = nextVersion
	}
	await writeJson(files.packageLock, packageLock.raw, packageLock.json)

	const serviceWorker = await readFile(files.serviceWorker, 'utf8')
	if (!APP_VERSION_PATTERN.test(serviceWorker)) {
		throw new Error('service-worker.js does not define APP_VERSION')
	}

	await writeFile(
		files.serviceWorker,
		serviceWorker.replace(APP_VERSION_PATTERN, `const APP_VERSION = "${nextVersion}";`)
	)

	console.log(nextVersion)
}

async function verifyVersion() {
	const packageJson = await readJson(files.packageJson)
	const packageLock = await readJson(files.packageLock)
	const serviceWorker = await readFile(files.serviceWorker, 'utf8')
	const serviceWorkerMatch = serviceWorker.match(APP_VERSION_PATTERN)

	if (!serviceWorkerMatch) {
		throw new Error('service-worker.js does not define APP_VERSION')
	}

	const packageVersion = packageJson.json.version
	const lockVersion = packageLock.json.packages?.['']?.version ?? packageLock.json.version
	const serviceWorkerVersion = serviceWorkerMatch[1]

	assertVersion(packageVersion)

	if (packageLock.json.version !== packageVersion) {
		throw new Error(
			`package-lock.json version (${packageLock.json.version}) does not match package.json (${packageVersion})`
		)
	}

	if (lockVersion !== packageVersion) {
		throw new Error(
			`package-lock.json root package version (${lockVersion}) does not match package.json (${packageVersion})`
		)
	}

	if (serviceWorkerVersion !== packageVersion) {
		throw new Error(
			`service-worker.js version (${serviceWorkerVersion}) does not match package.json (${packageVersion})`
		)
	}

	console.log(`Verified version ${packageVersion}`)
}

async function main() {
	if (command === 'sync') {
		if (!version) {
			throw new Error('Missing version argument. Usage: npm run sync-version -- <version>')
		}
		await syncVersion(version)
		return
	}

	if (command === 'verify') {
		await verifyVersion()
		return
	}

	throw new Error('Unknown command. Use "sync" or "verify"')
}

main().catch((error) => {
	console.error(error.message)
	process.exitCode = 1
})
