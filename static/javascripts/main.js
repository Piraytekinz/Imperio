






let menu = document.querySelector('.menu-btn')
let menulist = document.querySelector('.nav-list')
let btn = document.querySelector('.close-btn')
var detection = document.getElementById('detection')
var analyze = document.getElementById('analyze')
var img_con = document.getElementById('img-con')
var details = document.getElementById('details')
let image = document.getElementById('main-img')
let circle_one = document.getElementById('tooth')
let circle_two = document.getElementById('ai')
let error_ = document.getElementById('error')
let error_text = document.getElementById('error-text')
var arr = null
var idx = 0
var a


let calculus = "Calculus or tartar is a form of hardened dental plaque mostly seen as yellow. It is caused by precipitation of minerals from saliva and gingival crevicular fluid (GCF) in plaque on the teeth. This process of precipitation kills the bacterial cells within dental plaque, but the rough and hardened surface that is formed provides an ideal surface for further plaque formation. <br>Can only be removed by a dental professional since regular brushing and flossing won't be effective in getting rid of it."
let decay = "Tooth decay, also known as cavities or caries, is the breakdown of teeth due to acids produced by bacteria. The cavities may be a number of different colors from yellow to black. Symptoms may include pain and difficulty with eating. <br>The cause of cavities is acid from bacteria dissolving the hard tissues of the teeth (enamel, dentin and cementum). The acid is produced by the bacteria when they break down food debris or sugar on the tooth surface."
let discoloration = "Tooth discoloration is abnormal tooth color, hue or translucency. External discoloration is accumulation of stains on the tooth surface. Internal discoloration is due to absorption of pigment particles into tooth structure. <br>Causes include: <br>Tobacco Use<br>Dental Trauma<br>Poor Oral hygiene<br>Certain food drinks and medication."
let gingivitis = "Gingivitis is a common and mild form of gum disease (periodontal disease) that causes irritation, redness and swelling (inflammation) of your gingiva, the part of your gum around the base of your teeth. It's important to take gingivitis seriously and treat it promptly. The most common cause of gingivitis is the accumulation of bacterial plaque between and around the teeth. Dental plaque is a biofilm that accumulates naturally on the teeth. It occurs when bacteria attach to the smooth surface of a tooth. <br>Causes Include: <br>Smoking<br>Age<br>Vitamin Deficiencies<br>Drugs<br>Medications which reduce saliva."
let healthy = "Keep up or improve your dental habits."
let hypodontia = "The most common symptom of Hypodontia is the absence of one or more teeth. Other symptoms include malformed teeth and tooth decay. If you have Hypodontia, you may also have a higher risk of gum disease and infections."
let ulcer = "Mouth ulcers are painful and typically small lesions that develop in your mouth or at the base of your gums. <br>See a doctor or dentist about your mouth ulcers."

keys = [calculus, decay, discoloration, gingivitis, healthy, hypodontia, ulcer]
keytitles = ['CALCULUS DETECTED', 'DECAY DETECTED', 'DISCOLORATION DETECTED', 'GINGIVITIS DETECTED', 'HEALTHY DETECTED', 'HYPODONTIA DETECTED', 'MOUTH ULCER DETECTED']

menu.onclick = () => {
    menulist.classList.toggle('open')
}

btn.onclick = () => {
    menulist.classList.toggle('open')
}




    
async function verifyTeeth() {

    try {


    
    

        let ids = ['Ca', 'De', 'Di', 'Gi', 'He', 'Hy', 'Ul']


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

                circle_one.classList.toggle('circle')
                circle_two.classList.toggle('circle')

                analyze.classList.toggle("open")

                analyze.value = 'Analyzing'
                
                detection.classList.toggle("fade")

                img_con.classList.toggle("open")

                detection.style.color = 'white' 

                const model = await tf.loadLayersModel('static/verifyteethmodel/model.json')

        

                a = await tf.browser.fromPixels(image, 3).resizeBilinear([128, 128])

                

                // const input = await tf.sub(tf.div(tf.expandDims(a), 127.5), 1)
                const input = await tf.expandDims(a)

    

                let pre = await model.predict(input)

                
                var n = await pre.dataSync()

                var list = await Array.from(n)

                
                

                if (list[0]*100 == 100) {
                    loadModel()
                } else {
                    detection.innerHTML = 'Teeth undetected'
                    detection.style.color = 'red' 

                    detection.classList.toggle('fade')
                    analyze.classList.toggle("open")
                    img_con.classList.toggle("open")

                    circle_one.classList.toggle('circle')
                    circle_two.classList.toggle('circle')

                    analyze.value = 'Analyze'
                    
                }
            
            }
        }

        
    } catch {
        if (analyze.value == 'Analyzing') {
            detection.classList.toggle('fade')
            analyze.classList.toggle("open")
            img_con.classList.toggle("open")
            circle_one.classList.toggle('circle')
            circle_two.classList.toggle('circle')
            analyze.value = 'Analyze'
        }
        error('An unknown error occured')
    }

    
}


async function loadModel() {

    try {

        

        

        

        

        

        const model = await tf.loadLayersModel('static/realwebmodel/model.json')

        

        

        
        // a = tf.browser.fromPixels(image, 3)


        a = await tf.browser.fromPixels(image, 3).resizeBilinear([256, 256])
        
        


        const input = await tf.div(tf.expandDims(a), 127.5)
        // const input = tf.expandDims(a)

        
        
        

        let pre = await model.predict(input)


        
        var n = await pre.dataSync()

        arr = await Array.from(n)
        
        

        let ids = ['Ca', 'De', 'Di', 'Gi', 'He', 'Hy', 'Ul']


        var largest = arr[0]

        idx = 0

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
        img_con.classList.toggle("open")
        circle_one.classList.toggle('circle')
        circle_two.classList.toggle('circle')
        analyze.value = 'Analyze'

        document.getElementById('save-text').value = detection.innerHTML
        
    
    } catch {

        detection.classList.toggle('fade')
        analyze.classList.toggle("open")
        img_con.classList.toggle("open")
        analyze.value = 'Analyze'
        error('An unknown error occured')
        circle_one.classList.toggle('circle')
        circle_two.classList.toggle('circle')
        
    }
    
    
}

function clickImage() {

    document.getElementById('file').click()
}



function reset() {
    var img = document.getElementById('main-img')
    img.src = ''
    detection.innerHTML = 'Detection'
    detection.style.color = 'white' 

    let ids = ['Ca', 'De', 'Di', 'Gi', 'He', 'Hy', 'Ul']


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

        let detections_made = arr
        let passed = []
        

        detections_made.forEach(function greaterThan (value, index) {
            
            if (value*100 >= 1) {
                
                passed.push((index))
            }
        })

        
        
        var display = keys[idx]

        for (var i=0; i<passed.length;i++) {
            if (passed[i] != idx) {
                newtxt = '<br>' + '<br>' + keytitles[passed[i]] + '<br>' + keys[passed[i]] + '<br>'
                display = display + '\n \n' + newtxt
            }
            
        }

        text.innerHTML = display
        title.innerHTML = detection.innerHTML
        
    }

    

    details.classList.toggle("open")
    
    
}


function closeDetails () {
    details.classList.toggle("open")
}

function error(text) {

    error_text.innerHTML = text
    error_.classList.toggle('open')
}