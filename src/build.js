/* jshint esversion: 6 */
'use strict'

const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')
const _ = require('lodash')
const async = require('async')

const parser = new xml2js.Parser()

function readOption(flag, fallback) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return fallback
  return process.argv[idx + 1] || fallback
}

function listSvgFiles(sourceDir) {
  return fs.readdirSync(sourceDir).filter(function (file) {
    return file.toLowerCase().endsWith('.svg')
  })
}

function toIconKey(rawId) {
  return _.upperFirst(rawId.replace('-', ' ')).replace(' ', '')
}

function buildEntry(svgInfo) {
  const rawId = svgInfo.svg.g[0]['$'].id
  const iconKey = toIconKey(rawId)
  const pathNode = svgInfo.svg.g[0].path[0]['$']
  const viewBox = svgInfo.svg['$'].viewBox
  const pathData = pathNode.d
  const transform = pathNode.transform
  const pathWithTransform = transform
    ? pathData + ' " transform="' + transform
    : pathData
  return (
    '\n\t' +
    iconKey +
    ': {\n\t\tsvg: <Path d="' +
    pathWithTransform +
    '"/>,\n\t\tviewBox: \'' +
    viewBox +
    '\'\n\t}'
  )
}

function parseSvg(buffer, callback) {
  parser.parseString(buffer, callback)
}

function writeOutput(targetFile, entries) {
  fs.mkdirSync(path.dirname(targetFile), { recursive: true })
  const output = fs.openSync(targetFile, 'w')
  fs.writeSync(
    output,
    'import React from \'react\'\nimport { G, Path } from \'react-native-svg\'\nexport default {'
  )
  fs.writeSync(output, entries.join(','))
  fs.writeSync(output, '\n}\n')
}

const sourceDir = readOption('--input', path.join(__dirname, 'icons'))
const targetFile = readOption(
  '--output',
  path.join(__dirname, '..', 'lib', 'svgs.js')
)

const svgFiles = listSvgFiles(sourceDir)
const entries = []

async.map(
  svgFiles,
  function (file, done) {
    fs.readFile(path.join(sourceDir, file), function (readErr, data) {
      if (readErr) {
        return done(readErr)
      }
      parseSvg(data, function (parseErr, result) {
        if (parseErr) {
          return done(parseErr)
        }
        // Expecting an SVG structure with a single <g> and <path>.
        entries.push(buildEntry(result))
        return done()
      })
    })
  },
  function (err) {
    if (err) {
      console.log('Error occured', err)
      process.exit(1)
    }
    writeOutput(targetFile, entries)
    process.exit(0)
  }
)
