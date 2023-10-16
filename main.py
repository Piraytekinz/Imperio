from flask import Flask, render_template, request, url_for, redirect
from werkzeug.utils import secure_filename
import requests
import os
from PIL import Image, ImageDraw, ImageFont
import pyrebase
import json
import re
import datetime

app = Flask(__name__)

app.secret_key = "AIzaSyAwNGiMC3hRPLlYinWz9aWKeAqJ3nAs1Yk"

firebaseConfig = {
  "apiKey": "AIzaSyAwNGiMC3hRPLlYinWz9aWKeAqJ3nAs1Yk",
  "authDomain": "dental-ai-d1cf2.firebaseapp.com",
  "databaseURL": "https://dental-ai-d1cf2-default-rtdb.firebaseio.com",
  "projectId": "dental-ai-d1cf2",
  "storageBucket": "dental-ai-d1cf2.appspot.com",
  "messagingSenderId": "1033056690950",
  "appId": "1:1033056690950:web:2a4317647b65504685f487",
  "measurementId": "G-YEPCZZ2TVP"
}

firebase = pyrebase.initialize_app(firebaseConfig)

auth = firebase.auth()


path = os.getcwd()

upload_folder = path+'\\'+'static\\uploads\\'
side_path = os.path.expanduser('~\\Documents')

app.config['UPLOAD_FOLDER'] = upload_folder
filename = ''
filenames = []

@app.route('/')
def build():
    
   
    
    verify_acc = os.path.exists(os.path.join(side_path, 'DentalAI', 'account.json'))
    dictionary = {
        "email": "",
        "password": "",
        "localID": "",
        "idToken": ""
    }

    if not verify_acc:
        os.makedirs(os.path.join(side_path, 'DentalAI'))
        with open(f"{side_path}\\DentalAI\\account.json", "a") as jsonfile:
            json.dump(dictionary, jsonfile)
        return render_template('signup.html')
   
    
    with open(f"{side_path}\\DentalAI\\account.json", "r") as jsonfile:
        read = json.load(jsonfile)
        if read['email'] == '':
            return render_template('login.html')

        return render_template('index.html')

@app.route('/', methods=['POST'])
def upload_image():
    file=request.files['file']

    if file:
        
        if len(os.listdir(upload_folder)) > 0:
            
            os.remove(os.path.join(path, 'static', 'uploads', os.listdir(upload_folder)[0]))
            
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    return render_template('index.html', filename=filename)


@app.route('/signin', methods=['POST'])
def signin():
    
    error = None
    email = request.form.get('email')
    password = request.form.get('password')

    if len(email) > 0:
        validator_check = re.search(r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$', email)
                
        if validator_check:
            if len(password) > 6:
                try:
                    user = auth.sign_in_with_email_and_password(email, password)

                    verify_acc = os.path.exists(os.path.join(side_path, 'DentalAI', 'account.json'))
                    

                    if not verify_acc:
                        dictionary = {
                            "email": "",
                            "password": "",
                            "localID": "",
                            "idToken": ""
                        }
                        os.makedirs(os.path.join(side_path, 'DentalAI'))
                        with open(f"{side_path}\\DentalAI\\account.json", "a") as jsonfile:
                            json.dump(dictionary, jsonfile)



                    with open(f"{side_path}\\DentalAI\\account.json", "r") as jsonfile:
                        file = json.load(jsonfile)

                    file['email'] = email
                    file['password'] = password
                    file['idToken'] = user['idToken']
                    file['localID'] = user['localId']

                    with open(f"{side_path}\\DentalAI\\account.json", "w") as jsonfile:
                        json.dump(file, jsonfile)
                    
                    return render_template('index.html')
                    
                except requests.exceptions.HTTPError as e:
                    error_json = e.args[1]
                    error = json.loads(error_json)['error']['message']
                    
                    if error == 'EMAIL_NOT_FOUND':
                        
                        error = 'Email not found'
                    
                        
                    if error == 'INVALID_PASSWORD':
                        
                        error = 'Invalid password'
                        
                    
                    if error == 'INVALID_EMAIL':
                        
                        error = 'Invalid email'
                        
                    

                    if error == "MISSING_PASSWORD":
                        
                        error = 'Missing password'

                    if error == "INVALID_LOGIN_CREDENTIALS":
                        
                        error = 'Invalid login credentials'
                except:
                    error = "Connection Error"
            else:
                
                error = 'Password must be more than 6 characters'
        else:
            error = "Invalid email"
    else:
        
        error = 'Invalid email'

    return render_template('login.html', error=error)

@app.route('/signup', methods=['POST'])
def signup():
    error = None
    
    email = request.form.get('email')
    password = request.form.get('password')

    if len(email) > 0:
        validator_check = re.search(r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$', email)
                
        if validator_check:
            if len(password) > 6:
                try:
                    user = auth.create_user_with_email_and_password(email, password)

                    verify_acc = os.path.exists(os.path.join(side_path, 'DentalAI', 'account.json'))
                    

                    if not verify_acc:
                        dictionary = {
                            "email": "",
                            "password": "",
                            "localID": "",
                            "idToken": ""
                        }
                        os.makedirs(os.path.join(side_path, 'DentalAI'))
                        with open(f"{side_path}\\DentalAI\\account.json", "a") as jsonfile:
                            json.dump(dictionary, jsonfile)


                    with open(f"{side_path}\\DentalAI\\account.json", "r") as jsonfile:
                        file = json.load(jsonfile)

                    file['email'] = email
                    file['password'] = password
                    file['idToken'] = user['idToken']
                    file['localID'] = user['localId']

                    with open(f"{side_path}\\DentalAI\\account.json", "w") as jsonfile:
                        json.dump(file, jsonfile)

                    return render_template('index.html')


                except requests.exceptions.HTTPError as e:
                    error_json = e.args[1]
                    error = json.loads(error_json)['error']
                    
                    # self.toast(str(error) + "is the error")
                    # self.toast("An unknown error occured")
                    
                    
                        
                    try:
                        
                        if error['message'] == 'EMAIL_EXISTS':
                            
                            
                            error = "Email exists"
                            
                    except:
                        
                        
                        error = "An unknown error occured"

                except:
                    error = "Connection Error"

            else:
                
                error = "Password must be more than 6 characters."
        else:
            error = "Invalid email"
    else:
        
        error = "Invalid email"
        
    return render_template('signup.html', error=error)
    

@app.route('/signout')
def signout():
    try:
        # for file in os.listdir(os.path.join(side_path, 'DentalAI')):
        os.remove(os.path.join(side_path, 'DentalAI', 'account.json'))
        os.removedirs(os.path.join(side_path, 'DentalAI'))
    except:
        pass
    return render_template('login.html')



@app.route('/save', methods=["POST"])
def save():
    
    if request.form.get('text') != "":
        if len(os.listdir(upload_folder)) > 0:
            file = os.listdir(upload_folder)[0]
            save_path = os.path.expanduser('~\\Downloads')
            
            img = Image.open(os.path.join(upload_folder, file))


            draw = ImageDraw.Draw(img)

            font = ImageFont.truetype(path+'\\'+'static'+'\\'+'Fonts\\ethnocentric rg.otf')

            text = request.form.get('text')

            draw.text((2,2), text, font=font, align='right')

            date = datetime.datetime.now()

            new_date = f"{str(date.year)}-{str(date.month)}-{str(date.day)}"

            img.save(save_path + '\\' + request.form.get('text') + ' ' + new_date + ' ' +file)
        

    return render_template('index.html')

@app.route('/signup-page')
def switch_signup():
    return render_template('signup.html')

@app.route('/signin-page')
def switch_signin():
    return render_template('login.html')

@app.route('/home')
def home_page():
    return render_template('index.html')

@app.route('/creator')
def creator_page():
    return render_template('creator.html')

@app.route('/about')
def about_page():
    return render_template('about.html')



@app.route('/display/<filename>')
def display(filename):
    
    return redirect(url_for('static', filename='uploads/' + filename), code=301)

if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0')