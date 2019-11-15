class Network {
  layers = []
  weightsLayers = []

  constructor(opts) {
    this.layers.push(new Layer(opts.numInputs))
    for (let i = 0; i < opts.numLayers; i++) {
      this.layers.push(new Layer(opts.nodesPerLayer))
    }
    this.layers.push(new Layer(opts.numOutputs))

    for (let i = 0; i < this.layers.length - 1; i++) {
      this.weightsLayers.push(new WeightsLayer(this.layers[i].numNodes, this.layers[i + 1].numNodes))
    }
  }

  setInputValues(values) {
    this.layers[0].setValues(values)
  }

  getOutputValues() {
    return this.layers[this.layers.length - 1].getValues()
  }

  propagateData() {
    for (let l = 1; l < this.layers.length; l++) {
      const previousLayer = this.layers[l - 1]
      const nextLayer = this.layers[l]
      const inputValues = previousLayer.getValues()
      const outputValues = nextLayer.getValues() // must be writable
      const weightsLayer = this.weightsLayers[l - 1]
      for (let j = 0; j < nextLayer.numNodes; j++) {
        let sum = 0
        for (let i = 0; i < previousLayer.numNodes; i++) {
          sum += inputValues[i] * weightsLayer.getWeight(i, j)
        }
        // Apply sigma function, and store new value
        outputValues[j] = Math.max(Math.min(sum, 1), 0) // always 0 to 1
        //outputValues[j] = Math.atan(sum) / Math.PI // always -1 to 1
        //outputValues[j] = (1 + Math.atan(sum) / Math.PI) / 2 // always 0 to 1
      }
    }
  }
}

class Layer {
  numNodes = 5
  nodeValues = []

  constructor(numNodes) {
    this.numNodes = numNodes
  }

  setValues(newValues) {
    if (newValues.length !== this.numNodes) {
      throw new Error(`newValues.length (${newValues.length}) does not match this.numNodes (${this.numNodes})`)
    }
    this.nodeValues = newValues
  }

  getValues() {
    return this.nodeValues
  }
}

class WeightsLayer {
  numInputs = 3
  numOutputs = 3
  weights = []

  constructor(numInputs, numOutputs) {
    this.numInputs = numInputs
    this.numOutputs = numOutputs

    // We could pass this in as an option
    const generateRandomWeight = () => (2 * Math.random() - 1) * 3
    //const generateRandomWeight = () => (2 * Math.random() - 1)

    for (let i = 0; i < numInputs; i++) {
      for (let j = 0; j < numOutputs; j++) {
        this.weights[j * numInputs + i] = generateRandomWeight()
      }
    }
  }

  getWeight(i, j) {
    return this.weights[j * this.numInputs + i]
  }
}

function getOutputForInput(network, input) {
  network.setInputValues(input)
  network.propagateData()
  return network.getOutputValues()
}

// TODO I guess this should really be stored in the network.
//      We could put this into the input layer, we will just need to not clobber it with setInputValues()
const rnd1 = Math.random()

function drawImage(canvas, network) {
  // For faster rendering, sample fewer points
  const downsample = 4

  //const rnd2 = Math.random()
  const rnd2 = Math.sin(Date.now() / 1000 / 3)

  const ctx = canvas.getContext('2d')

  for (let x = 0; x < canvas.width; x += downsample) {
    for (let y = 0; y < canvas.height; y += downsample) {
      const input = [x / canvas.width, y / canvas.width, rnd1, rnd2]
      const result = getOutputForInput(network, input)
      // CONSIDER Might be faster to use pixel buffer
      ctx.fillStyle = `rgb(${result[0] * 255}, ${result[1] * 255}, ${result[2] * 255})`
      ctx.fillRect(x, y, downsample, downsample)
    }
  }
}

const network = new Network({
  numInputs: 4,
  numOutputs: 3,
  numLayers: 4,
  nodesPerLayer: 8,
})

const canvas = document.getElementById('canvas')

//drawImage(canvas, network)
setInterval(() => drawImage(canvas, network), 100)
