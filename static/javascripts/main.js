



$(document).ready(function () {
    $("#file").on("change", showFile)
    
})


let menu = document.querySelector('.menu-btn')
let menulist = document.querySelector('.nav-list')
let btn = document.querySelector('.close-btn')
var detection = document.getElementById('detection')
var analyze = document.getElementById('analyze')


menu.onclick = () => {
    menulist.classList.toggle('open')
}

btn.onclick = () => {
    menulist.classList.toggle('open')
}


function showFile(e) {
    
    document.getElementById('submit-img').click()
    // var binaryData = []
    // binaryData.push(e.target.value)
    
    // var image= document.getElementById('img')
    
    

    // 

    // var par = new Blob(binaryData, {type: "image/jpg"})

    // var url = URL.createObjectURL(new Blob(binaryData, {type: "image/jpg"}))

    // var file = new FileReader()

    // 

}

    
async function verifyTeeth() {

    try {
        let image = document.getElementById('image')

        
        

        if (image.src!= '') {

            

            analyze.classList.toggle("open")

            analyze.value = 'Analyzing'
            
            detection.classList.toggle("fade")

            detection.style.color = 'white' 

            const model = await tf.loadLayersModel('static/verify teeth model/model.json')

            

            a = await tf.browser.fromPixels(image, 3).resizeBilinear([256, 256])

            // const input = await tf.sub(tf.div(tf.expandDims(a), 127.5), 1)
            const input = await tf.expandDims(a)

            let pre = await model.predict(input)
            
            var n = await pre.dataSync()

            var arr = Array.from(n)

            

            if (arr[0]*100 == 100) {
                loadModel()
            } else {
                detection.innerHTML = 'Teeth undetected'
                detection.style.color = 'red' 

                detection.classList.toggle('fade')
                analyze.classList.toggle("open")

                analyze.value = 'Analyze'
                
            }
        
        }
    } catch {
        detection.classList.toggle('fade')
        analyze.classList.toggle("open")

        analyze.value = 'Analyze'
        alert('An unknown error occured')
    }

    
}


async function loadModel() {

    try {

        let image = document.getElementById('image')

        

        

        

        

        const model = await tf.loadLayersModel('static/web model/model.json')

        

        

        
        a = await tf.browser.fromPixels(image, 3).resizeBilinear([256, 256])



        
        


        const input = await tf.sub(tf.div(tf.expandDims(a), 127.5), 1)
        // const input = tf.expandDims(a)

        

        

        let pre = await model.predict(input)
        
        var n = await pre.dataSync()

        var arr = Array.from(n)

        let ids = ['Ca', 'De', 'Di', 'Gi', 'he', 'Hy', 'Ul']


        var largest = arr[0]
        var idx = 0

        for (var i = 0; i < arr.length; i++) {
            if (arr[i] > largest) {
                largest = arr[i]
                idx = i
            }
        }
        

        ids.forEach(showPredictions)

        
        function showPredictions(value, index) {
            if (arr[index]*100 > 1) {
                document.getElementById(value).innerHTML=value+': '+Math.floor(arr[index]*100)+'%'
            }
            
        }
        

        
        if (idx == 0) {
            
            detection.innerHTML = 'Calculus Detected ' + Math.floor(arr[0]*100)+'%'
        } else if (idx == 1) {
            
            detection.innerHTML = 'Decay Detected ' + Math.floor(arr[1]*100)+'%'
        } else if (idx == 2) {
            
            detection.innerHTML = 'Discoloration Detected ' + Math.floor(arr[2]*100)+'%'
        } else if (idx == 3) {
            
            detection.innerHTML = 'Gingivitis Detected ' + Math.floor(arr[3]*100)+'%'
        } else if (idx == 4) {
            
            detection.innerHTML = 'Healthy ' + Math.floor(arr[4]*100)+'%'
        } else if (idx == 5) {
            
            detection.innerHTML = 'Hypodontia Detected ' + Math.floor(arr[5]*100)+'%'
        } else {
            
            detection.innerHTML = 'Mouth Ulcer Detected ' + Math.floor(arr[6]*100)+'%'
        }

        
        detection.classList.toggle('fade')
        analyze.classList.toggle("open")

        analyze.value = 'Analyze'

        document.getElementById('save-text').value = detection.innerHTML
        
    
    } catch {

        detection.classList.toggle('fade')
        analyze.classList.toggle("open")

        analyze.value = 'Analyze'
        alert('An unknown error occured')
        
    }
    
    
}

function clickImage() {
    openButton()
    document.getElementById('file').click()
}



function reset() {
    refreshButton()
    var img = document.getElementById('image')
    img.src = ''
    
}


async function saveButton() {
    var btn = document.getElementById('save-btn')
    btn.classList.toggle("open")


    
}


async function openButton() {
    var btn = document.getElementById('open-image')
    btn.classList.toggle("open")


    
}


async function refreshButton() {
    var btn = document.getElementById('refresh')
    btn.classList.toggle("open")
    
}


function signOutAnim() {
    var btn = document.getElementById('sign-out')
    btn.classList.toggle("open")
    
}
function aboutAnim() {
    var btn = document.getElementById('about')
    btn.classList.toggle("open")
    
}
function creatorAnim() {
    var btn = document.getElementById('creator')
    btn.classList.toggle("open")
    
}
