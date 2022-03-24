import sqlite3


connection = sqlite3.connect('Quiz.db')
cursor = connection.cursor()


#add
#In form (questionID, m1,m2)
cursor.execute("""
CREATE TABLE IF NOT EXISTS additionQuestions
(
    a_ID INTEGER PRIMARY KEY,
    Matrix1 TEXT,
    Matrix2 TEXT


    
)""")







#mult
#in form (qID, matrix, vector)
cursor.execute("""
CREATE TABLE IF NOT EXISTS multiplicationQuestions
(
    m_ID INTEGER PRIMARY KEY,
    Matrix TEXT,
    Vector TEXT



)""")






      

connection.commit()

#determinant
cursor.execute("""
CREATE TABLE IF NOT EXISTS determinantQuestions
(
    d_ID INTEGER PRIMARY KEY,
    Matrix TEXT




)""")






      

connection.commit()



#Create login database

cursor.execute(""" CREATE TABLE IF NOT EXISTS userDetails
(

userID INTEGER PRIMARY KEY,
Username TEXT,
Password TEXT 



)""")


data = cursor.execute("SELECT * FROM userDetails").fetchall()
print(data)
connection.commit()


cursor.execute(""" CREATE TABLE IF NOT EXISTS scoreTable
(
    scoreID INTEGER PRIMARY KEY,
    userID INTEGER,
    Score INTEGER,
    FOREIGN KEY(userID) REFERENCES userDetails(userID)
    
    
)""")

data2 = cursor.execute("SELECT DISTINCT userID, Score FROM scoreTable ORDER BY Score DESC").fetchall()
print(data2)

data3 = cursor.execute("SELECT * FROM additionQuestions").fetchall()
print(data3)

data3 = cursor.execute("SELECT * FROM multiplicationQuestions").fetchall()
print(data3)



connection.commit()
connection.commit()
connection.close()
