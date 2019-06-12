#!/usr/bin/env node
const lessonName = process.argv[2]

if (!lessonName) {
  throw new Error("No lesson name specified")
}

const fs = require("fs-extra")

const dirs = fs.readdirSync("./lessons")

const numDirs = dirs.filter(dir => !isNaN(+dir[0]))
const sortedDirs = numDirs.sort((aDir, bDir) => {
  const a = +aDir.split("-")[0]
  const b = +bDir.split("-")[0]

  return a < b ? 1 : a > b ? -1 : 0
})

const sourceDir = sortedDirs[0]

fs.removeSync(`./lessons/${sourceDir}/.cache`)
fs.removeSync(`./lessons/${sourceDir}/dist`)

const currentNum = +sourceDir.split("-")[0]
const nextNum = currentNum + 1
const nextNumString =
  nextNum.toString().length === 1 ? `0${nextNum}` : `${nextNum}`

const newDir = `${nextNumString}-${lessonName}`

fs.copySync(`./lessons/${sourceDir}`, `./lessons/${newDir}`)

const editJsonFile = require("edit-json-file")
const packageJson = editJsonFile(`./lessons/${newDir}/package.json`)

packageJson.set("name", lessonName)
packageJson.save()
