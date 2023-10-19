






let menu = document.querySelector('.menu-btn')
let menulist = document.querySelector('.nav-list')
let btn = document.querySelector('.close-btn')
var detection = document.getElementById('detection')
var analyze = document.getElementById('analyze')
var details = document.getElementById('details')
let image = document.getElementById('main-img')




menu.onclick = () => {
    menulist.classList.toggle('open')
}

btn.onclick = () => {
    menulist.classList.toggle('open')
}




    
async function verifyTeeth() {

    try {


    
    

        let ids = ['Ca', 'De', 'Di', 'Gi', 'he', 'Hy', 'Ul']


        // var largest = arr[0]


        // for (var i = 0; i < arr.ids; i++) {
        //     if (arr[i] > largest) {
        //         largest = arr[i]
        //         idx = i
        //     }
        // }
        

        ids.forEach(showPredictions)

        
        function showPredictions(value, index) {
            document.getElementById(value).innerHTML=value + ': ' + '0' + '%'
            
            
        }

        
        if (analyze.value != 'Analyzing') {

            if (image.src!= '') {

            

                analyze.classList.toggle("open")

                analyze.value = 'Analyzing'
                
                detection.classList.toggle("fade")

                detection.style.color = 'white' 

                const model = await tf.loadLayersModel('static/verifyteethmodel/model.json')

        

                a = tf.browser.fromPixels(image, 3).resizeBilinear([256, 256])

                

                // const input = await tf.sub(tf.div(tf.expandDims(a), 127.5), 1)
                const input = tf.expandDims(a)

    

                let pre = model.predict(input)

                
                var n = pre.dataSync()

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

        

        

        

        

        

        const model = await tf.loadLayersModel('static/webmodel/model.json')

        

        

        
        a = tf.browser.fromPixels(image, 3).resizeBilinear([256, 256])


      
        
        


        const input = tf.sub(tf.div(tf.expandDims(a), 127.5), 1)
        // const input = tf.expandDims(a)

        
        
        

        let pre = model.predict(input)


        
        var n = pre.dataSync()

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
    var img = document.getElementById('main-img')
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

function showDetails () {
    var title = document.getElementById('details-title')
    var text = document.getElementById("description")

    
    if (detection.innerHTML == "Detection" || detection.innerHTML == "Teeth undetected") {
        title.innerHTML = 'No analyses made'
        text.innerHTML = "No detections"
    } else {
        if (detection.innerHTML.search("Gingivitis") == 0) {
            text.innerHTML = "Gingivitis is a common and mild form of gum disease (periodontal disease) that causes irritation, redness and swelling (inflammation) of your gingiva, the part of your gum around the base of your teeth. It's important to take gingivitis seriously and treat it promptly. \n \nThe most common cause of gingivitis is the accumulation of bacterial plaque between and around the teeth. Dental plaque is a biofilm that accumulates naturally on the teeth. It occurs when bacteria attach to the smooth surface of a tooth. \n \nSmoking\nAge\nVitamin Deficiencies\nDrugs\nMedications which reduce saliva."
        }
        else if (detection.innerHTML.search("Decay") == 0) {
            text.innerHTML = "Tooth decay, also known as cavities or caries, is the breakdown of teeth due to acids produced by bacteria. The cavities may be a number of different colors from yellow to black. Symptoms may include pain and difficulty with eating. \n \nhe cause of cavities is acid from bacteria dissolving the hard tissues of the teeth (enamel, dentin and cementum). The acid is produced by the bacteria when they break down food debris or sugar on the tooth surface."
        }
        else if (detection.innerHTML.search("Discoloration") == 0) {
            text.innerHTML = "Tooth discoloration is abnormal tooth color, hue or translucency. External discoloration is accumulation of stains on the tooth surface. Internal discoloration is due to absorption of pigment particles into tooth structure."
        }
        else if (detection.innerHTML.search("Calculus") == 0) {
            text.innerHTML = "Calculus or tartar is a form of hardened dental plaque mostly seen as yellow. It is caused by precipitation of minerals from saliva and gingival crevicular fluid (GCF) in plaque on the teeth. This process of precipitation kills the bacterial cells within dental plaque, but the rough and hardened surface that is formed provides an ideal surface for further plaque formation. \n \nCan only be removed by a dental professional since regular brushing and flossing won't be effective in getting rid of it."
        }
        else if (detection.innerHTML.search("Hypodontia") == 0) {
            text.innerHTML = "The most common symptom of Hypodontia is the absence of one or more teeth. Other symptoms include malformed teeth and tooth decay. If you have Hypodontia, you may also have a higher risk of gum disease and infections."
        }
        else if (detection.innerHTML.search("Mouth Ulcer") == 0) {
            text.innerHTML = "Mouth ulcers are painful and typically small lesions that develop in your mouth or at the base of your gums. See a doctor or dentist about your mouth ulcers if you develop any."
        } else {
            text.innerHTML = "Keep up or improve your dental habits."
        }
        title.innerHTML = detection.innerHTML
        
    }

    

    details.classList.toggle("open")
    
    
}


function closeDetails () {
    details.classList.toggle("open")
}