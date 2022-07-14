const NUMTILES = 10
const ALLTILES = [0,1,2,3,5,6,7,8,9]
const DIM = 5
const MAXDEPTH = 3
const width = 400
const height = 400
let sprites = []
let grid = []
let neighborLookup = {
  0 : {
    up : [9],
    down : [9,1,6,8],
    left : [0,2,3,4,6],
    right: [0,1,2,4,5,8]
  },
  1 : {
    up : [2,3,4,5,7],
    down : [9],
    left : [0,2,3,4,6],
    right: [0,1,2,4,5,8]
  },
  2 : {
    up : [9],
    down : [1,4,6,7,8],
    left : [0,2,3,4,6],
    right: [0,1,2,4,5,8]
  },
  3 : {
    up : [9],
    down : [1,4,6,7,8],
    left : [9],
    right: [0,1,2,4,5,8]
  },
  4 : {
    up : [2,3,4,7],
    down : [1,4,6,7,8],
    left : [0,1,2,3,4,6],
    right: [0,1,2,4,5,8]
  },
  5:{
    up : [9],
    down : [1,4,6,7,8],
    left : [0,1,2,3,4,6],
    right: [9]
  },
  6:{
    up : [2,3,4,5,7],
    down : [9],
    left : [9],
    right: [0,1,2,4,5,8]
  },
  7:{
    up : [2,3,4,5,7],
    down : [1,4,6,7,8],
    left : [9],
    right: [9]
  },
  8:{
    up : [2,3,4,5,7],
    down : [1,4,6,7,8],
    left : [90,1,2,3,4,6],
    right: [9]
  },
  9 : {
    up : [0,1,6,8],
    down : [0,2,3,5],
    left : [5,7,8],
    right: [3,6,7]
  }
}

function setup() {
  createCanvas(width, height);
  frameRate(60)
  setBoard()

}

 /** This function loads resources that will be used later. */
 function preload() {
  for(let i = 0; i < NUMTILES;i++){
    sprites[i] = loadImage('pathway/'+i+'.png')
  }
}


function draw() {
  background(220);
  const w = width / DIM
  const h = height / DIM

    let min = findMinAndCollapse()
    if(min != null){
      propagate(min,true,MAXDEPTH)
    }
    for(let i = 0; i < DIM; i++){
      for(let j = 0; j < DIM; j++){
        let cell = grid[j+i*DIM]
        if(cell.collapsed)
          image(sprites[cell.states[0]],i*w,j*h,w,h)
      }
    }

    for(const cell of grid){
      cell.propagate = false
    }
  }

function findMinAndCollapse(){
  let min = null

  for(const element of grid){
    if(!element.collapsed){
      if(min == null || element.states.length < min.states.length)
        min = element
    }
  }

  if(min != null){
    let choice = min.states[Math.floor(Math.random() * min.states.length)]
    
    min.states = [choice]
    min.collapsed = true
  }

  return min
}

function propagate(cell,isStart,depth){
  if(depth <= 0)
    return

  if( (cell.propagated || cell.collapsed) && !isStart)
    return
  
  let i = cell.position[0]
  let j = cell.position[1]

  grid[j+i*DIM].propagated = true
  //UP
  if (j - 1 >= 0){
    reduceState(grid[(j-1)+i*DIM])
    propagate(grid[(j-1)+i*DIM],false,depth-1)
  }
  //DOWN
    if (j + 1 < DIM){
      reduceState(grid[(j+1)+i*DIM])
      propagate(grid[(j+1)+i*DIM],false,depth-1)
    }
    //LEFT
  if (i - 1 >= 0){
    reduceState(grid[j+(i-1)*DIM])
    propagate(grid[j+(i-1)*DIM],false,depth-1)
  }
  //RIGHT
    if (i + 1 < DIM){
      reduceState(grid[j+(i+1)*DIM])
      propagate(grid[j+(i+1)*DIM],false,depth-1)
    }
}


function reduceState(cell){
  let up = ALLTILES
  let down = ALLTILES
  let left = ALLTILES
  let right = ALLTILES

  let i = cell.position[0]
  let j = cell.position[1]
  // Get up neighbors if applicable
  if(j-1 >= 0){
    up = []
    for(const state of grid[(j-1)+i*DIM].states){
      let x = state
      let lookup = neighborLookup[x]
      for(const neighbor of lookup["down"]){
        up.push(neighbor)
      }
    }
  }
  if(j+1 < DIM){
    down = []
    for(const state of grid[(j+1)+i*DIM].states){
      let x = state
      let lookup = neighborLookup[x]
      for(const neighbor of lookup["up"]){
        down.push(neighbor)
      }
    }
  }

  if(i-1 >= 0){
    left = []
    for(const state of grid[j+(i-1)*DIM].states){
      let x = state
      let lookup = neighborLookup[x]
      for(const neighbor of lookup["right"]){
        left.push(neighbor)
      }
    }
  }

  if(i+1 < DIM){
    right = []
    for(const state of grid[j+(i+1)*DIM].states){
      let x = state
      let lookup = neighborLookup[x]
      for(const neighbor of lookup["left"]){
        right.push(neighbor)
      }
    }
  }

  const filteredArray = ((up.filter(value => down.includes(value))).filter(value => right.includes(value))).filter(value => left.includes(value));
  if(filteredArray.length > 0)
    cell.states = filteredArray
  else{
    return setBoard()
  }
  return
 
 // print(filteredArray)


}

function setBoard(){
  for(let i = 0; i < DIM*DIM; i++){
    grid[i] = {
      collapsed : false,
      states : [0,1,2,3,9],
      propagated : false
    }
  }

  for(let i = 0; i < DIM; i++){
    for(let j = 0; j < DIM; j++){
      let cell = grid[j+i*DIM]
      cell["position"] = [i,j]
    }
  }
  return
}
