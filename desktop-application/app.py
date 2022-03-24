from tkinter import *
import sqlite3
import matplotlib.pyplot as plt
import textwrap
import numpy as np
import random


connection = sqlite3.connect('Quiz.db')
cursor = connection.cursor()

class interactiveButton:
    def __init__(self, text, command, xpos, ypos, fontsize):
        self.buttonText = text
        self.buttonCommand = command
        self.xPositionB = xpos
        self.yPositionB = ypos
        self.fontSize = fontsize
    
    def createButton(self):
        
        self.applicationButton = Button(text = self.buttonText, command = self.buttonCommand, font=("Impact", self.fontSize))
        self.applicationButton.place(x = self.xPositionB, y = self.yPositionB)
    
class imageLabel:
    def __init__(self, filename, xalter, yalter, zoom, shrink, xpos, ypos):
        self.imageFile = filename
        self.xAlter = xalter
        self.yAlter = yalter
        self.imageZoom = zoom
        self.imageShrink = shrink
        self.xPositionI = xpos
        self.yPositionI = ypos

        
    def placeImage(self):

        if self.imageZoom:
            self.applicationImage = PhotoImage(file = self.imageFile)
            self.applicationImageL = self.applicationImage.zoom(self.xAlter, self.yAlter)
            
            self.imageLabel = Label(root, image = self.applicationImageL)
            self.imageLabel.place(x= self.xPositionI, y= self. yPositionI)
    
        elif self.imageShrink:
            self.applicationImage = PhotoImage(file = self.imageFile)
            self.applicationImageL = self.applicationImage.subsample(self.xAlter, self.yAlter)
            
            self.imageLabel = Label(root, image = self.applicationImageL)
            self.imageLabel.place(x= self.xPositionI, y= self. yPositionI)
        else:
            self.applicationImage = PhotoImage(file = self.imageFile)
            self.imageLabel = Label(root, image = self.applicationImage)
            self.imageLabel.place(x= self.xPositionI, y= self. yPositionI)
            
class textLabel:
    def __init__(self, text, xpos, ypos, colour, size):
        self.textString = text
        self.xPositionT = xpos
        self.yPositionT = ypos
        self.textColour = colour
        self.textSize = size

        self.textLabel = Label
    
    def placeText(self):
        self.textLabel = Label(text= self.textString, font=("Impact", self.textSize), fg= self.textColour)
        self.textLabel.place(x = self.xPositionT, y = self.yPositionT)

    def wrapText(self):
        self.textWrap = textwrap.fill(self.textString, width = 250)
        
        self.wrapLabel = Label(text = "Question: {}".format(self.textWrap), font=("Impact", self.textSize), fg = self.textColour, relief =  GROOVE)
        self.wrapLabel.place(x= self.xPositionT, y= self.yPositionT)


#Inheritenec, sub class of text label
class statusLabel(textLabel):
    def __init__(self, text, xpos, ypos, colour, size):
        

        super().__init__(text, xpos, ypos, colour, size)
    
    def setStatus(self):

        self.statusWrap = textwrap.fill(self.textString, width = 50)
        
        self.statusLabel = Label(text = "{}".format(self.statusWrap), font=("Impact", self.textSize), fg = self.textColour, relief =  GROOVE)
        self.statusLabel.place(x= self.xPositionT, y= self.yPositionT)

    def close(self):
        self.statusLabel.destroy()





class MainApplication:
    def __init__(self, master):

        self.master = master
        

        
    def createScreen(self):
        self.master.geometry("1350x800+50+50")
        self.master.title("Matrix Mayhem")
        self.loginWidgets()


    def loginWidgets(self):

    
        self.loginBackground = imageLabel("Space-Background1.gif", 1, 1, False, True, -400, 0)
        self.loginBackground.placeImage()

        
        usernameLabel = textLabel("USERNAME", 635, 300, 'black', 35)
        usernameLabel.placeText()
        
        self.usernameEntry = Entry(font=("Impact", 25))
        self.usernameEntry.place(x=565, y=360)

        passwordLabel = textLabel("PASSWORD", 630, 450, 'black', 35)
        passwordLabel.placeText()
       
        self.passwordEntry = Entry(font=("Impact", 25))
        self.passwordEntry.place(x=565, y = 510)

        

        registerButton = interactiveButton("Register", self.registerFunction, 750, 700, 35)
        registerButton.createButton()

        loginButton = interactiveButton("Login", self.loginFunction, 500, 700, 35)
        loginButton.createButton()

        teacherButton = interactiveButton("Teacher Module", self.teacherModule, 570, 630, 35)
        teacherButton.createButton()








        self.applicationLogo = PhotoImage(file ="applogo.gif")
        self.applicationlogoSmall = self.applicationLogo.subsample(2,2)
        

        self.logoLabel= Label(self.master, image = self.applicationlogoSmall)
        self.logoLabel.place(x=315, y=0)



        


    
        
    
    def registerFunction(self):
        
        registerUser = self.usernameEntry.get()
        registerPass = self.passwordEntry.get()
    
        if len(registerUser) >= 4 and len(registerPass) >= 8:
            locateUser = (""" SELECT * FROM userDetails WHERE username = ?""")
            cursor.execute(locateUser, [(registerUser)])
            registerResults = cursor.fetchall()
            if registerResults:

                
                try:
                    self.statusLabel.close() 
                except AttributeError:
                    pass
                self.statusLabel = statusLabel("Username is taken. Please select another.", 405, 580, 'red', 35)
                self.statusLabel.setStatus()
                
                
            else:
                insertData = """ INSERT INTO userDetails(Username, Password)
                VALUES(?, ?)"""
                cursor.execute(insertData, [(registerUser), (registerPass)])
                connection.commit()


                try:
                    self.statusLabel.close() 
                except AttributeError:
                    pass
                self.statusLabel = statusLabel("Your account has been successfully registered.", 370, 580, 'green', 35)
                self.statusLabel.setStatus()
                
        else:
            try:
                self.statusLabel.close() 
            except AttributeError:
                pass
            self.statusLabel = statusLabel("Username needs to be greater then 4, and password greater then 8 characters.", 335, 580, 'red', 35)
            self.statusLabel.setStatus()

    def loginFunction(self):
        
        loginUser = self.usernameEntry.get()
        loginPass = self.passwordEntry.get()

        locateUser = (""" SELECT * FROM userDetails WHERE username = ? AND password = ?""")
        cursor.execute(locateUser, [(loginUser), (loginPass)])
        loginResults = cursor.fetchall()

        if loginResults:
            self.prequizCountdown()

        else: 
            try:
                self.statusLabel.close() 
            except AttributeError:
                pass
            self.statusLabel = statusLabel("Error, account does not exist.", 490, 580, 'red', 35)
            self.statusLabel.setStatus()

    def prequizCountdown(self):

        self.countBackground = imageLabel("Space-Background3.gif", 1, 1, False, True, -400, 0)
        self.countBackground.placeImage()

        self.timerThree()

        self.master.after(1000, self.timerTwo)

        self.master.after(2000, self.timerOne)

        self.master.after(3000, self.launchQuiz)

            
    def launchQuiz(self):

        quizUser = self.usernameEntry.get() 
        userIdentity = """SELECT * FROM userDetails WHERE Username = (?)"""
        UserIDQTuple = cursor.execute(userIdentity, [(quizUser)])
       
        for entry_tuple in UserIDQTuple:
            self.UserIDQ = entry_tuple[0]

     

        self.quizBackground = imageLabel("Space-Background2.gif", 1, 1, False, True, -400, 0)
        self.quizBackground.placeImage()

        self.quizDifficulty = 0

        self.quizScore = 0

        self.lives = 3

        self.countdownTime = 30
        self.countdownLabel = Label(relief = GROOVE, font = ("Impact", 25))
        self.countdownLabel.place(x=1235, y=760)


        self.countdownClock()
        self.generateQuestion()

    def timerThree(self):


        timerLabel = textLabel("3", 625, 300, 'black', 100)
        timerLabel.placeText()
    
    def timerTwo(self):


        timerLabel = textLabel("2", 625, 300, 'black', 100)
        timerLabel.placeText()
    
    def timerOne(self):


        timerLabel = textLabel("1 ", 625, 300, 'black', 100)
        timerLabel.placeText()


    def teacherModule(self):
        self.teacherBackground = imageLabel("Space-Background5.gif", 1, 1, False, True, -400, 0)
        self.teacherBackground.placeImage()

        questionText = textLabel("Add a question", 400, 150, 'black', 100)
        questionText.placeText()

        addButton = interactiveButton("Addition", self.createAddition, 100, 600, 50)
        addButton.createButton()

        multButton = interactiveButton("Multiplication", self.createMultiplication, 500, 600, 50)
        multButton.createButton()

        detButton = interactiveButton("Determinant", self.createDeterminant, 950,600, 50)
        detButton.createButton()

        backButton = interactiveButton("Back to Main Menu", self.loginWidgets, 445, 700, 50)
        backButton.createButton()

    
    def createAddition(self):
        self.teacherBackground = imageLabel("Space-Background5.gif", 1, 1, False, True, -400, 0)
        self.teacherBackground.placeImage()
        
        self.addEntry1 = Entry(font = ("Impact", 25))
        self.addEntry1.place(x=700, y=200, width = 50, height = 50) #c1 #r1

        self.addEntry2 = Entry(font = ("Impact", 25))
        self.addEntry2.place(x=765, y=200, width = 50, height = 50)

        self.addEntry3 = Entry(font = ("Impact", 25))
        self.addEntry3.place(x=830, y=200, width = 50, height = 50)

        self.addEntry4 = Entry(font = ("Impact", 25))
        self.addEntry4.place(x=700, y=265, width = 50, height = 50) #c1 #r2

        self.addEntry5 = Entry(font = ("Impact", 25))
        self.addEntry5.place(x=765, y=265, width = 50, height = 50)


        self.addEntry6 = Entry(font = ("Impact", 25))
        self.addEntry6.place(x=830, y=265, width = 50, height = 50)

        self.addEntry7 = Entry(font = ("Impact", 25))
        self.addEntry7.place(x=700, y=330, width = 50, height = 50) #c1 #r3

        
        self.addEntry8 = Entry(font = ("Impact", 25))
        self.addEntry8.place(x=765, y=330, width = 50, height = 50)

        self.addEntry9 = Entry(font = ("Impact", 25))
        self.addEntry9.place(x=830, y=330, width = 50, height = 50)

        self.sumEntry1 = Entry(font = ("Impact", 25))
        self.sumEntry1.place(x=400, y=200, width = 50, height = 50) #c1 #r1

        self.sumEntry2 = Entry(font = ("Impact", 25))
        self.sumEntry2.place(x=465, y=200, width = 50, height = 50)

        self.sumEntry3 = Entry(font = ("Impact", 25))
        self.sumEntry3.place(x=530, y=200, width = 50, height = 50)

        self.sumEntry4 = Entry(font = ("Impact", 25))
        self.sumEntry4.place(x=400, y=265, width = 50, height = 50) #c1 #r2

        self.sumEntry5 = Entry(font = ("Impact", 25))
        self.sumEntry5.place(x=465, y=265, width = 50, height = 50)


        self.sumEntry6 = Entry(font = ("Impact", 25))
        self.sumEntry6.place(x=530, y=265, width = 50, height = 50)

        self.sumEntry7 = Entry(font = ("Impact", 25))
        self.sumEntry7.place(x=400, y=330, width = 50, height = 50) #c1 #r3

        
        self.sumEntry8 = Entry(font = ("Impact", 25))
        self.sumEntry8.place(x= 465, y=330, width = 50, height = 50)

        self.sumEntry9 = Entry(font = ("Impact", 25))
        self.sumEntry9.place(x=530, y=330, width = 50, height = 50)

        plusLabel  = Label(text = "+", relief = GROOVE, font=("Impact", 50))
        plusLabel.place(x=625, y=250)

        self.m2Add = [self.addEntry1, self.addEntry2, self.addEntry3, self.addEntry4, self.addEntry5, self.addEntry6, self.addEntry7, self.addEntry8, self.addEntry9]

        self.m1Add = [self.sumEntry1, self.sumEntry2, self.sumEntry3, self.sumEntry4, self.sumEntry5, self.sumEntry6, self.sumEntry7, self.sumEntry8, self.sumEntry9]

        submitButton = interactiveButton("Create Question", self.addAdd, 500, 605, 50)
        submitButton.createButton()

        backButton = interactiveButton("Back to Teacher Module", self.teacherModule, 440, 700, 50)
        backButton.createButton()

    def errorScreen(self):
        self.teacherBackground = imageLabel("Space-Background5.gif", 1, 1, False, True, -400, 0)
        self.teacherBackground.placeImage()
        questionText = textLabel("Error, please enter an integer.", 250, 150, 'red', 75)
        questionText.placeText()
        teacherButton = interactiveButton("Back to Teacher Module", self.teacherModule, 450, 500, 50)
        teacherButton.createButton()
        


    def addAdd(self):
        m1String = ''
        m2String = ''
        
        count = 1
        for i in self.m1Add:
            s = i.get()
            try:
                check = int(s)
            except ValueError:
                self.errorScreen()
                return

            
            m1String = m1String + s
            
            if count % 3 == 0:
                m1String = m1String + ';'
            elif count !=9:
                m1String = m1String +','
            count +=1
        m1String = m1String[:len(m1String)-1]

        

        count = 1
        for i in self.m2Add:
            s = i.get()
            try:
                check = int(s)
            except ValueError:
                self.errorScreen()
                return

            
            m2String = m2String + s
            
            if count % 3 == 0:
                m2String = m2String + ';'
            elif count !=9:
                m2String = m2String +','
            count +=1
        m2String = m2String[:len(m2String)-1]

        insertAdd = ("INSERT INTO additionQuestions(Matrix1,Matrix2) VALUES(?,?);")
        cursor.execute(insertAdd, [(m1String),(m2String)])
        connection.commit()

        self.createAddition()

    def createMultiplication(self):
        self.teacherBackground = imageLabel("Space-Background5.gif", 1, 1, False, True, -400, 0)
        self.teacherBackground.placeImage()
        
        self.addEntry1 = Entry(font = ("Impact", 25))
        self.addEntry1.place(x=700, y=200, width = 50, height = 50) #c1 #r1

        self.addEntry4 = Entry(font = ("Impact", 25))
        self.addEntry4.place(x=700, y=265, width = 50, height = 50) #c1 #r2

        self.addEntry7 = Entry(font = ("Impact", 25))
        self.addEntry7.place(x=700, y=330, width = 50, height = 50) #c1 #r3

        self.sumEntry1 = Entry(font = ("Impact", 25))
        self.sumEntry1.place(x=400, y=200, width = 50, height = 50) #c1 #r1

        self.sumEntry2 = Entry(font = ("Impact", 25))
        self.sumEntry2.place(x=465, y=200, width = 50, height = 50)

        self.sumEntry3 = Entry(font = ("Impact", 25))
        self.sumEntry3.place(x=530, y=200, width = 50, height = 50)

        self.sumEntry4 = Entry(font = ("Impact", 25))
        self.sumEntry4.place(x=400, y=265, width = 50, height = 50) #c1 #r2

        self.sumEntry5 = Entry(font = ("Impact", 25))
        self.sumEntry5.place(x=465, y=265, width = 50, height = 50)


        self.sumEntry6 = Entry(font = ("Impact", 25))
        self.sumEntry6.place(x=530, y=265, width = 50, height = 50)

        self.sumEntry7 = Entry(font = ("Impact", 25))
        self.sumEntry7.place(x=400, y=330, width = 50, height = 50) #c1 #r3

        
        self.sumEntry8 = Entry(font = ("Impact", 25))
        self.sumEntry8.place(x= 465, y=330, width = 50, height = 50)

        self.sumEntry9 = Entry(font = ("Impact", 25))
        self.sumEntry9.place(x=530, y=330, width = 50, height = 50)

        plusLabel  = Label(text = "x", relief = GROOVE, font=("Impact", 50))
        plusLabel.place(x=625, y=250)

        self.m2Mult = [self.addEntry1, self.addEntry4, self.addEntry7]

        self.m1Mult = [self.sumEntry1, self.sumEntry2, self.sumEntry3, self.sumEntry4, self.sumEntry5, self.sumEntry6, self.sumEntry7, self.sumEntry8, self.sumEntry9]

        submitButton = interactiveButton("Create Question", self.addMult, 500, 605, 50)
        submitButton.createButton()

        backButton = interactiveButton("Back to Teacher Module", self.teacherModule, 440, 700, 50)
        backButton.createButton()

    def addMult(self):
        m1String = ''
        m2String = ''
        count = 1
        for i in self.m1Mult:
            s = i.get()
            try:
                check = int(s)
            except ValueError:
                self.errorScreen()
                return

            
            m1String = m1String + s
            
            if count % 3 == 0:
                m1String = m1String + ';'
            elif count !=9:
                m1String = m1String +','
            count +=1
        m1String = m1String[:len(m1String)-1]

        

        count = 1
        for i in self.m2Mult:
            s = i.get()
            try:
                check = int(s)
            except ValueError:
                self.errorScreen()
                return

            
            m2String = m2String + s
            
            if count != 3:
                m2String = m2String + ';'
            else:
                pass
            count +=1
        m2String = m2String
 

        insertMult = ("INSERT INTO multiplicationQuestions(Matrix,Vector) VALUES(?,?);")
        cursor.execute(insertMult, [(m1String),(m2String)])
        connection.commit()

        self.createMultiplication()



    def createDeterminant(self):
        self.teacherBackground = imageLabel("Space-Background5.gif", 1, 1, False, True, -400, 0)
        self.teacherBackground.placeImage()

        self.addEntry1 = Entry(font = ("Impact", 25))
        self.addEntry1.place(x=600, y=200, width = 50, height = 50) #c1 #r1

        self.addEntry2 = Entry(font = ("Impact", 25))
        self.addEntry2.place(x=665, y=200, width = 50, height = 50)

        self.addEntry3 = Entry(font = ("Impact", 25))
        self.addEntry3.place(x=730, y=200, width = 50, height = 50)

        self.addEntry4 = Entry(font = ("Impact", 25))
        self.addEntry4.place(x=600, y=265, width = 50, height = 50) #c1 #r2

        self.addEntry5 = Entry(font = ("Impact", 25))
        self.addEntry5.place(x=665, y=265, width = 50, height = 50)


        self.addEntry6 = Entry(font = ("Impact", 25))
        self.addEntry6.place(x=730, y=265, width = 50, height = 50)

        self.addEntry7 = Entry(font = ("Impact", 25))
        self.addEntry7.place(x=600, y=330, width = 50, height = 50) #c1 #r3

        
        self.addEntry8 = Entry(font = ("Impact", 25))
        self.addEntry8.place(x=665, y=330, width = 50, height = 50)

        self.addEntry9 = Entry(font = ("Impact", 25))
        self.addEntry9.place(x=730, y=330, width = 50, height = 50)

        
        self.m1Det = [self.addEntry1, self.addEntry2, self.addEntry3, self.addEntry4, self.addEntry5, self.addEntry6, self.addEntry7, self.addEntry8, self.addEntry9]
        
        submitButton = interactiveButton("Create Question", self.addDet, 500, 605, 50)
        submitButton.createButton()

        backButton = interactiveButton("Back to Teacher Module", self.teacherModule, 440, 700, 50)
        backButton.createButton()

    def addDet(self):
        m1String = ''
        count = 1
        for i in self.m1Det:
            s = i.get()
            try:
                check = int(s)
            except ValueError:
                self.errorScreen()
                return

            
            m1String = m1String + s
            
            if count % 3 == 0:
                m1String = m1String + ';'
            elif count !=9:
                m1String = m1String +','
            count +=1
        m1String = m1String[:len(m1String)-1]
        insertDet = ("INSERT INTO determinantQuestions(Matrix) VALUES(?);")
        cursor.execute(insertDet, [(m1String)])
        connection.commit()
        self.createDeterminant()


    def countdownClock(self):

        

        if self.countdownTime <= 0:
            insertData = ("""INSERT INTO scoreTable(userID, Score) VALUES(?,?);""")
            cursor.execute(insertData, [(self.UserIDQ), (self.quizScore)])
            connection.commit()

            self.resultsBackground = imageLabel("Space-Background4.gif", 1, 1, False, True, -400, 0)
            self.resultsBackground.placeImage()

            self.generateGraph()

            

            self.generateGrade()

            
            
            self.resultsScreen()
            
           
        else:
            self.countdownLabel.configure(text="Timer: {}".format(str(self.countdownTime)))
            self.countdownTime -= 1
            self.master.after(1000, self.countdownClock)

    def resultsScreen(self):
        self.resultsBackground = imageLabel("Space-Background4.gif", 1, 1, False, True, -400, 0)
        self.resultsBackground.placeImage()

        
        
        scoreLabel = textLabel("Final Score: {}".format(self.quizScore), 0, 100, 'black', 25)
        scoreLabel.placeText()


        gradeLabel = textLabel("Grade: {}".format(self.quizGrade), 0, 200, 'black', 25)
        gradeLabel.placeText()


        if len(self.cartesiany) > 1:

            previousScore = self.cartesiany[-2]
            

            previousLabel = textLabel("Previous attempt's score: {}".format(previousScore), 0, 300, 'black', 25)
            previousLabel.placeText()

            if self.quizScore > previousScore:
                
                difference = self.quizScore - previousScore
                feedbackLabel = textLabel("You have improved by {} points from your previous attempt, well done!".format(difference), 0, 400, 'green', 25)
                feedbackLabel.placeText()
                
                
                
            elif self.quizScore == previousScore:
                
                feedbackLabel = textLabel("You have not improved from your previous attempt, try again!", 0, 400, 'black', 25)
                feedbackLabel.placeText()

            elif self.quizScore < previousScore:
                difference = previousScore - self.quizScore
                feedbackLabel = textLabel("You have dropped by {} points from your previous attempt, you need to try harder!".format(difference), 0, 400, 'red', 25)
                feedbackLabel.placeText()

                

            backButton = interactiveButton("Back to Main Menu", self.loginWidgets, 400, 600, 50)
            backButton.createButton()

            retryButton = interactiveButton("Try again", self.prequizCountdown, 500, 500, 50)
            retryButton.createButton()

        else:
            
            backButton = interactiveButton("Back to Main Menu", self.loginWidgets, 400, 600, 50)
            backButton.createButton()

            retryButton = interactiveButton("Try again", self.prequizCountdown, 500, 500, 50)
            retryButton.createButton()

        ld = self.generateLeaderboard()

        leaderboardHead = textLabel("Leaderboard", 800, 180, 'black', 35)
        leaderboardHead.placeText()
        count = 0
        for i in range(240, 540, 60):
            leaderboardLabel = textLabel("({}) {}: {}".format(count + 1, ld[count][0], ld[count][1]), 800, i, 'black', 35)
            leaderboardLabel.placeText()
            count +=1
    

        


    

    def generateQuestion(self):
        self.quizBackground = imageLabel("Space-Background2.gif", 1, 1, False, True, -400, 0)
        self.quizBackground.placeImage()
        self.countdownTime = 30
        self.lives = 3

        if self.quizDifficulty >= 0 and self.quizDifficulty < 1:
            self.generateAddition()
        elif self.quizDifficulty >= 1 and self.quizDifficulty <2:
            self.generateMultiplication()
        elif self.quizDifficulty >= 2 and self.quizDifficulty <3:
            self.generateDeterminant()
            

        answerButton = interactiveButton("Check Answer", self.compareAnswer, 550, 605, 50)
        answerButton.createButton()

        quizscoreLabel = Label(text= "Score: {}".format(self.quizScore), relief= GROOVE, font=("Impact", 25))
        quizscoreLabel.place(x=0, y=715)
        
        self.livesLabel = Label(text= "Lives: {}".format(self.lives), relief= GROOVE, font=("Impact", 25))
        self.livesLabel.place(x=0, y=650)

        self.countdownLabel = Label(relief = GROOVE, font = ("Impact", 25))
        self.countdownLabel.place(x=1235, y=760)


    def generateDeterminant(self):
        data = cursor.execute("SELECT * FROM determinantQuestions ORDER BY RANDOM();").fetchall()

        for entry_tuple in data:
            quizMString = entry_tuple[1]


        self.matrix = np.matrix(quizMString)
        self.matrixarray = np.array(self.matrix.T)
        self.matrixAnswer = int(np.linalg.det(self.matrixarray))


        question = [(self.matrix, 575, 200),('=', 750, 250)]
                
        for i in question:  
            if i[0]!= '=':
                matrixString = repr(i[0])
                matrixStringBalanced = matrixString[8:len(matrixString)-2]
                matrixStringBalanced = matrixStringBalanced.replace(',', "")
            
            elif i[0] == '=':
                matrixStringBalanced = i[0]
            
            questionWrap = textwrap.fill(matrixStringBalanced, width = 15)
            questionLabel  = Label(text = questionWrap, relief = GROOVE, font=("Impact", 50))
            questionLabel.place(x= i[1], y= i[2])


        self.answerEntry1 = Entry(font = ("Impact", 25))
        self.answerEntry1.place(x=850, y=265, width = 50, height = 50)
        



        self.values = [self.answerEntry1]

  
    def generateMultiplication(self):
        data = cursor.execute("SELECT * FROM multiplicationQuestions ORDER BY RANDOM();").fetchall()

        for entry_tuple in data:
            quizMString = entry_tuple[1]
            quizVString = entry_tuple[2]


        self.matrix = np.matrix(quizMString)
        self.vector = np.matrix(quizVString)
        self.matrixAnswer = np.dot(self.matrix, self.vector)


        question = [(self.matrix, 400, 200), ('x', 575, 250), (self.vector, 635, 200), ('=', 735, 250)]
                
        for i in question:  
            if i[0] != 'x' and i[0] != '=':
                matrixString = repr(i[0])
                matrixStringBalanced = matrixString[8:len(matrixString)-2]
                matrixStringBalanced = matrixStringBalanced.replace(',', "")
                
            elif i[0] == 'x' or i[0] == '=':
                matrixStringBalanced = i[0]

            
            if len(matrixStringBalanced) == 27: #vector
                questionWrap = textwrap.fill(matrixStringBalanced, width = 5)
                questionLabel  = Label(text = questionWrap, relief = GROOVE, font=("Impact", 50))
                questionLabel.place(x= i[1], y= i[2])
            else:
                questionWrap = textwrap.fill(matrixStringBalanced, width = 15)
                questionLabel  = Label(text = questionWrap, relief = GROOVE, font=("Impact", 50))
                questionLabel.place(x= i[1], y= i[2])



            
        self.answerEntry1 = Entry(font = ("Impact", 25))
        self.answerEntry1.place(x=850, y=200, width = 50, height = 50) #c1 #r1

        self.answerEntry2 = Entry(font = ("Impact", 25))
        self.answerEntry2.place(x=850, y=265, width = 50, height = 50)

        self.answerEntry3 = Entry(font = ("Impact", 25))
        self.answerEntry3.place(x=850, y=330, width = 50, height = 50)

        self.values = [self.answerEntry1, self.answerEntry2, self.answerEntry3]

            
  
        

    def generateAddition(self):

 
        data = cursor.execute("SELECT * FROM additionQuestions ORDER BY RANDOM();").fetchall()
 
        
        for entry_tuple in data:
            quizM1String = entry_tuple[1]
 
            quizM2String = entry_tuple[2]
 

        self.matrixOne = np.matrix(quizM1String)
        self.matrixTwo = np.matrix(quizM2String)
        self.matrixAnswer = np.add(self.matrixOne, self.matrixTwo)
  

     

        question = [(self.matrixOne, 300, 200), ('+', 450, 250), (self.matrixTwo, 500, 200), ('=', 700, 250)]
    
        for i in question:  
            if i[0] != '+' and i[0] != '=':
                matrixString = repr(i[0])
                matrixStringBalanced = matrixString[8:len(matrixString)-2]
                matrixStringBalanced = matrixStringBalanced.replace(',', "")
            elif i[0] == '+' or i[0] == '=':
                matrixStringBalanced = i[0]

            
            questionWrap = textwrap.fill(matrixStringBalanced, width = 15)
            questionLabel  = Label(text = questionWrap, relief = GROOVE, font=("Impact", 50))
            questionLabel.place(x= i[1], y= i[2])


            
        self.answerEntry1 = Entry(font = ("Impact", 25))
        self.answerEntry1.place(x=750, y=200, width = 50, height = 50) #c1 #r1

        self.answerEntry2 = Entry(font = ("Impact", 25))
        self.answerEntry2.place(x=815, y=200, width = 50, height = 50)

        self.answerEntry3 = Entry(font = ("Impact", 25))
        self.answerEntry3.place(x=880, y=200, width = 50, height = 50)

        self.answerEntry4 = Entry(font = ("Impact", 25))
        self.answerEntry4.place(x=750, y=265, width = 50, height = 50) #c1 #r2

        self.answerEntry5 = Entry(font = ("Impact", 25))
        self.answerEntry5.place(x=815, y=265, width = 50, height = 50)


        self.answerEntry6 = Entry(font = ("Impact", 25))
        self.answerEntry6.place(x=880, y=265, width = 50, height = 50)

        self.answerEntry7 = Entry(font = ("Impact", 25))
        self.answerEntry7.place(x=750, y=330, width = 50, height = 50) #c1 #r3

        
        self.answerEntry8 = Entry(font = ("Impact", 25))
        self.answerEntry8.place(x=815, y=330, width = 50, height = 50)

        self.answerEntry9 = Entry(font = ("Impact", 25))
        self.answerEntry9.place(x=880, y=330, width = 50, height = 50)

        self.values = [self.answerEntry1, self.answerEntry2, self.answerEntry3, self.answerEntry4, self.answerEntry5, self.answerEntry6, self.answerEntry7, self.answerEntry8, self.answerEntry9]

    def animationInitialisation(self):
        self.countdownTime = 100
        self.animationBackground = imageLabel("Space-Background2.gif", 1, 1, False, True, -400, 0)
        self.animationBackground.placeImage()
        
        choice = random.randint(1,4)
        if choice == 1:
            self.planetImage = PhotoImage(file = "planet1.gif").zoom(5,5)
        elif choice == 2:
            self.planetImage = PhotoImage(file = "planet2.gif").zoom(5,5)
        elif choice == 3:
            self.planetImage = PhotoImage(file = "planet3.gif").subsample(4,4)
        elif choice == 4:
            self.planetImage = PhotoImage(file = "planet4.gif").zoom(5,5)
        
        self.animation()


    def animation(self, countr = 750, countp = -1250):
        if countr <= -500:
            self.generateQuestion()
        else:
            try:
                self.rocketLabel.destroy()
                self.planetLabel.destroy()
            except AttributeError:
                pass
            
            

            

            

            self.planetLabel = Label(self.master, image = self.planetImage, bg = 'black')
            self.planetLabel.place(x =50, y = countp)
            
            
            self.rocketImage = PhotoImage(file = "rocketflying.gif").subsample(2,2)
            self.rocketLabel = Label(self.master, image = self.rocketImage, bg='green')
            self.rocketLabel.place(x = 600, y = countr)




            self.master.after(15, lambda: self.animation(countr -20, countp + 50))

  



    def compareAnswer(self):

        count = 0
        isCorrect = True
        for i in self.values:
        
            try:
                userAnswer = int(i.get())
                try:
                    if userAnswer !=  self.matrixAnswer.item(count):
                        isCorrect = False
                except AttributeError:
                    if userAnswer != self.matrixAnswer:
                        isCorrect = False
            except ValueError:
                isCorrect = False

            count +=1

        if not isCorrect:

            incorrectLabel = textLabel("Incorrect, try again", 0, 760, 'red', 25)
            incorrectLabel.placeText()

            self.quizDifficulty = self.quizDifficulty - 0.8
            
            if self.quizDifficulty  < 0:
                self.quizDifficulty = 0

            self.lives = self.lives - 1
            self.livesLabel = Label(text= "Lives: {}".format(self.lives), relief= GROOVE, font=("Impact", 25))
            self.livesLabel.place(x=0, y=650)

            if self.lives <= 0:
                self.countdownTime = 0


        elif isCorrect:
            
            correctLabel = textLabel("Correct! Well done!", 0, 760, 'green', 25)
            correctLabel.placeText()
            
            if self.quizDifficulty >= 0 and self.quizDifficulty < 1:
                self.quizScore = self.quizScore + 1
            elif self.quizDifficulty >= 1 and self.quizDifficulty <2:
                self.quizScore = self.quizScore + 2
            elif self.quizDifficulty >= 2:
                self.quizScore = self.quizScore + 5

            
            self.quizDifficulty = self.quizDifficulty + 0.6
            if self.quizDifficulty >= 3:
                self.quizDifficulty = 2

            self.animationInitialisation()
        
        


        

    def generateGrade(self):
        if self.quizScore <= 15: 
            self.quizGrade = 'F, there is a lot of improvement required from you.'
        elif self.quizScore <=30 and self.quizScore > 15:
            self.quizGrade = 'D, lots of room for improvement.'
        elif self.quizScore <=45 and self.quizScore > 30:
            self.quizGrade = 'C, you have passed, but by working harder you can achieve higher!'
        elif self.quizScore <= 60 and self.quizScore > 45:
            self.quizGrade = 'B, well done! However just a little more to go for an A!'
        elif self.quizScore <= 75 and self.quizScore > 60:
            self.quizGrade = 'A, Great work! Well done!'
        elif self.quizScore > 75:
            self.quizGrade = 'A*, you are the best of the best!'


#unique users, top 5, no duplicates
    def generateLeaderboard(self):
        obtainData = cursor.execute("""SELECT DISTINCT userID, Score FROM scoreTable ORDER BY Score DESC""").fetchall()
        leaderboardRec = []
        userIDCheck = []
        for line in obtainData:
            userID = line[0]
            if userID in userIDCheck:
                pass
            else:
                score = line[1]
                getuserName = ("""SELECT Username FROM userDetails WHERE userID = (?)""")
                cursor.execute(getuserName, [userID])
                userName = cursor.fetchall()
                leaderboardRec.append((userName, score))
                userIDCheck.append(userID)


        return leaderboardRec[:5] 

            

    def generateGraph(self):
        
        self.cartesiany = []
        cartesianxaxis = []
        obtainData = ("""SELECT scoreID, Score FROM scoreTable WHERE userID = (?)""")
        cursor.execute(obtainData, [(self.UserIDQ)])
        progressData = cursor.fetchall()
        for line in progressData:
            self.cartesiany.append(line[1])
            cartesianxaxis.append(line[0])

        cartesianx = [(i+1) for i in range (len(self.cartesiany))]
        
        plt.title("Progress over time")
        plt.xlabel ("Attempt")
        plt.ylabel ("Score")
        plt.plot(cartesianx,self.cartesiany)
        
        plt.show()
    


    



            


root = Tk()

applicationInterface = MainApplication(root)
applicationInterface.createScreen()



root.mainloop()
