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
function encodeAlphabet() {
  let nodeIdx = leafIdx[character + 1], stackTop = 0
  while(nodeIdx < nodesNum) {
    stack[stackTop++] = nodeIdx % 2
    nodeIdx = parentIdx[Math.floor((nodeIdx + 1) / 2)]
  }
  while(--stackTop > -1) writeBit(fout, stack[stackTop])
}
function buildTree() {
  let a, b, idx
  while(freeIdx < nodesNum) {
    a = freeIdx++
    b = freeIdx++
    idx = addNode( b >> 1, nodes[a].weight + nodes[b].weight )
    parentIdx[b >> 1] = idx
  }
}
function addLeaves() {
  for(let i = 0, freq = 0; i < alphabetsNum; i++) {
    freq = frequency[i]
    if(freq > 0) addNode(-(i + 1), freq)
  }
}
function addNode(idx, weight) {
  let i = num_nodes++
  while(i > 0 && nodes[i].weight > weight) {
    if(nodes[i].idx < 0) {
      ++leafIdx[-nodes[i].idx]
    } else {
      ++parentIdx[nodes[i].idx]
    }
    --i
  }
  ++i
  nodes[i].idx = idx
  nodes[i].weight = weight
  if(idx < 0) leafIdx[-idx] = i
  else parentIdx[idx] = i
  return i
}
function determineFrequency(file) {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(file, {
      encoding: 'utf8',
    })
    const m = new Map()
    let size = 0
    rs.on('data', (chunk) => {
      for (let e of chunk) {
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
