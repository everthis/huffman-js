const fs = require('fs')
const path = require('path')
const os = require('os')
const { EOL } = os
const alphabetsNum = 2 ** 8

function decode() {}
function encode() {}
function readHeader() {}
function writeHeader() {}
function readBit() {}
function flushBuffer() {}
function writeBit() {}
function decodeBitStream() {}
function encodeAlphabet() {}
function buildTree() {}
function addLeaves() {}
function addNode() {}
function determineFrequency(file) {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(file, {
      encoding: 'utf8',
    })
    const m = new Map()
    let size = 0

    rs.on('data', (chunk) => {
      for (let e of chunk) {
        if (e === EOL) continue
        m.set(e, (m.get(e) || 0) + 1)
        size++
      }
    })
    rs.on('end', () => {
      resolve({
        map: m,
        originalSize: size,
        activeNum: m.size,
      })
    })
    rs.on('error', (err) => {
      reject(err.stack)
    })
  })
}

const testFile = path.join(__dirname, 'test.txt')
determineFrequency(testFile).then((e) => console.log(e))
