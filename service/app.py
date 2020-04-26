import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
import time
import psycopg2.extras


app = Flask(__name__)
CORS(app)

psycopg2.extras.register_uuid()
conn = psycopg2.connect(
        database="openedu2020", user="postgres", password="****", host="****", port="5432")


@app.route('/api/u/activity',methods=['POST'])
def create():
    cur = conn.cursor()
    data = request.get_json()
    print(data)
    data['timeValue']=time.strftime('%Y-%m-%d %H:%M:%S')
    cur.execute("insert into appl1011(uuid, courseid, credit, memberid, begintime) values(%s,%s,%s,%s,%s)",
             (uuid.uuid1(),data['course_uuid'], data['course_credit'], data['member_uuid'], data['timeValue']))
    conn.commit()
    return "1"

@app.route('/api/u/activity/<id>',methods=['GET'])
def read_one_activity(id):
    cur = conn.cursor()
    tmp_id = "'"+id+"'"
    cur.execute(
        "select courseid from appl1011 where memberid={}".format(tmp_id))
    rows = cur.fetchall()
    l = []
    # course =[]
    for i,row in enumerate(rows):
        dic= {'courseid': str(rows[i][0])}
        a = "'" + str(rows[i][0]) + "'"
        cur.execute("select * from mast1014 where uuid={}".format(a))
        courses = cur.fetchall()
        for i in courses:
            cour = {'code':str(i[4]),'name':str(i[6])}
            l.append(cour)
    print(l)
    return jsonify(l)

@app.route('/api/u/member',methods=['GET'])
def read_member():
    cur = conn.cursor()
    cur.execute(
        "select * from mast0501")
    rows = cur.fetchall()
    l = []
    for row in rows:
        # print(row)
        dic= {'id': str(row[0]),'employeeid': str(row[14]),'firstname':str(row[5]),'uuid':str(row[1])}
        l.append(dic)
    return jsonify(l)


@app.route('/api/u/course',methods=['GET'])
def read_course():
    cur = conn.cursor()
    cur.execute(
        "select * from mast1014")
    rows = cur.fetchall()
    l = []
    for row in rows:
        # print(row)
        dic= {'id': str(row[0]),'code': str(row[4]),'name':str(row[6]),'uuid':str(row[1]),'credit':str(row[10])}
        l.append(dic)
    return jsonify(l)


@app.route('/api/u/activity/<string:name>', methods=['DELETE'])
def delete(name):
    cur = conn.cursor()
    cur.execute("select uuid from mast1014 where name='{}'".format(name))
    course_uuid = cur.fetchall()
    print(str(course_uuid[0][0]))
    course_id = "'"+ str(course_uuid[0][0]) +"'"
    cur.execute("DELETE from appl1011 where courseid={}".format(course_id))
    conn.commit() 
    return "1"

if __name__ == '__main__':
    app.run()
