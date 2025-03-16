from flask import Flask, render_template, request
import requests
import pyrebase
import json
import re
import random
import smtplib
import json

app = Flask(__name__)


with open('./static/javascripts/key.json') as f:
    info = json.load(f)

firebaseConfig = info

firebase = pyrebase.initialize_app(firebaseConfig)

auth = firebase.auth()



global code


emails = []
passwords = []
has_signed = ["False"]


@app.route('/')
def build():

    return render_template('index.html')





    


@app.route('/signin', methods=['POST'])
def signin():
    try:
        error = None
        email = request.form.get('email')
        password = request.form.get('password')
        


        if len(email) > 0:
            validator_check = re.search(r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$', email)
                    
            if validator_check:
                if len(password) > 6:
                    try:
                        user = auth.sign_in_with_email_and_password(email, password)

                        # verify_acc = os.path.exists(os.path.join(side_path, 'DentalAI', 'account.json'))
                        

                        # if not verify_acc:
                        #     dictionary = {
                        #         "email": "",
                        #         "password": "",
                        #         "localID": "",
                        #         "idToken": ""
                        #     }
                        #     os.makedirs(os.path.join(side_path, 'DentalAI'))
                            
                        #     with open(os.path.join(side_path, 'DentalAI', 'account.json'), "a") as jsonfile:
                        #         json.dump(dictionary, jsonfile)



                        # with open(os.path.join(side_path, 'DentalAI', 'account.json'), "r") as jsonfile:
                        #     file = json.load(jsonfile)

                        # file['email'] = email
                        # file['password'] = password
                        # file['idToken'] = user['idToken']
                        # file['localID'] = user['localId']

                        # with open(os.path.join(side_path, 'DentalAI', 'account.json'), "w") as jsonfile:
                        #     json.dump(file, jsonfile)
                        # home_page()
                        has_signed.clear()
                        has_signed.append("True")
                        return render_template('home.html')
                    
                        
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
    except:
        error = 'An error occured try again'

    return render_template('login.html', error=error)





@app.route('/signup', methods=['POST'])
def signup():
    try:
    
        error = None

    
        
        

        email = request.form.get('email')
        password = request.form.get('password')

        emails.clear()
        passwords.clear()
        emails.append(email)
        passwords.append(password)

        if len(email) > 0:
            validator_check = re.search(r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$', email)
                    
            if validator_check:
                if len(password) > 6:

                    try:

                        send_code()

                        return render_template('verify.html', email=email, tries=0)
                    except:
                        error = "Connection error"

                else:
                    
                    error = "Password must be more than 6 characters."
            else:
                error = "Invalid email"
        else:
            
            error = "Invalid email"
    except:
        error = 'An error occured try again'
        
    return render_template('signup.html', error=error)





@app.route('/verify', methods=["POST"])
def verify():
    try:

        error = None
        input_code = request.form.get("code")
        ok = int(request.form.get("tries"))

    
        

        
        
        
        
        ok += 1

        
        if ok < 6:
            if int(input_code) == int(code):
                try:
                    
                    user = auth.create_user_with_email_and_password(emails[0], passwords[0])

                    # verify_acc = os.path.exists(os.path.join(side_path, 'DentalAI', 'account.json'))
                    

                    # if not verify_acc:
                    #     dictionary = {
                    #         "email": "",
                    #         "password": "",
                    #         "localID": "",
                    #         "idToken": ""
                    #     }
                    #     os.makedirs(os.path.join(side_path, 'DentalAI'))
                    #     with open(os.path.join(side_path, 'DentalAI', 'account.json'), "a") as jsonfile:
                    #         json.dump(dictionary, jsonfile)


                    # with open(os.path.join(side_path, 'DentalAI', 'account.json'), "r") as jsonfile:
                    #     file = json.load(jsonfile)

                    # file['email'] = email
                    # file['password'] = password
                    # file['idToken'] = user['idToken']
                    # file['localID'] = user['localId']

                    # with open(os.path.join(side_path, 'DentalAI', 'account.json'), "w") as jsonfile:
                    #     json.dump(file, jsonfile)
                    has_signed.clear()
                    has_signed.append("True")

                    return render_template('home.html')


                except requests.exceptions.HTTPError as e:
                    error_json = e.args[1]
                    error = json.loads(error_json)['error']
                    
                    
                    
                    
                        
                    try:
                        
                        if error['message'] == 'EMAIL_EXISTS':
                            
                            
                            error = "Email exists"
                            
                    except:
                        
                        
                        error = "An unknown error occured"

                except:
                    error = "Connection Error"

            else:
                error = 'Invalid code'
                
        else:
            error = 'Too many attempts. Click resend to get a new code'
    except:
        error = 'An error occured try again'

    return render_template('verify.html', error=error, tries=ok, email=emails[0])


def send_code():

    global code
    
    code = random.randint(100000,999999)



    
    message = f"From: Imperio \nTo: {emails[0]} \nSubject: Your login code for Imperio is...{code}. \n\nYour code is {code}. \n \nYou can ignore this email if you weren't authenticating an account."

    
    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login("hometernetmanager@gmail.com", "lhgajriuhglozfyd")
    server.sendmail("Hometernet", emails[0], message)
    server.quit()

    



@app.route('/resend', methods=["POST"])
def resend():
    error = None
    try:
        send_code()
    except:
        error = "Failed to resend code"

    return render_template("verify.html", tries=0, error=error)



    

@app.route('/signout')
def signout():
    has_signed.clear()
    has_signed.append("False")
    return render_template('login.html')


@app.route('/passwordreset', methods=["POST"])
def passwordreset():
    error = None
    try:
        mail = request.form.get('email')

        auth.send_password_reset_email(mail)
    except requests.exceptions.HTTPError as e:
        error_json = e.args[1]
        error = json.loads(error_json)['error']['message']
        
        if error == 'EMAIL_NOT_FOUND':
            error = 'Email not found'
    except:
        error = "Failed to send password reset link"
    return render_template('login.html', error=error)



@app.route('/save', methods=["POST"])
def save():
    
    if request.form.get('text') != "":
        pass
        # if len(os.listdir(upload_folder)) > 0:
        #     file = os.listdir(upload_folder)[0]
        #     save_path = os.path.expanduser('~\Downloads')
            
        #     img = Image.open(os.path.join(upload_folder, file))


        #     draw = ImageDraw.Draw(img)
            
        #     font = ImageFont.truetype(os.path.join(path,'static','Fonts','ethnocentric rg.otf'))

        #     text = request.form.get('text')

        #     draw.text((2,2), text, font=font, align='right')

        #     date = datetime.datetime.now()

        #     new_date = f"{str(date.year)}-{str(date.month)}-{str(date.day)}"

            

        #     img.save(os.path.join(save_path, f"{request.form.get('text')} {new_date} {file}"))
        

    return render_template('home.html')

@app.route('/signup-page')
def switch_signup():
    return render_template('signup.html')

@app.route('/signin-page')
def switch_signin():
    return render_template('login.html')

@app.route('/home')
def home_page():
    
    return render_template('home.html')

@app.route('/creator')
def creator_page():
    return render_template('creator.html')

@app.route('/about')
def about_page():
    return render_template('about.html')


    

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)  
    # app.run(debug=True)
