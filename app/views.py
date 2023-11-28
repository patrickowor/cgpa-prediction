from fastapi import APIRouter, Depends, Response
from sqlalchemy import delete
from app.models import Courses, Programme, User, UserModel
from app.db import AsyncSession, get_session
from pydantic import BaseModel
from typing import List, Optional
from sqlmodel import select
from app.authentication import auth_handler
app = APIRouter()

class LoginModel(BaseModel):
    email : str
    password : str

class CoursesWithGrade(BaseModel):
    course_id : int 
    course_name : str
    grade : str

class PredictForm(BaseModel):
    level : str # level - semester
    coursesandgrade : List[CoursesWithGrade]
    degree : str  # 1, 21, 22, 3, pass
    minimum : Optional[int]

class CoursesForm(BaseModel):
    title : str 
    code : str 
    unit : int
    status : str 
    semester : int 
    level : int


class AddProgramForm(BaseModel):
    name : str 
    semester : int 
    courses : List[CoursesForm]

@app.post("/signup")
async def signup(
    data : UserModel ,
    session : AsyncSession = Depends(get_session)
):
    try:
        programs = (await session.execute(select(Programme))).all()
        programs_list = []
        for program in programs:

            programs_list.append(program[0].name.lower())
        if data.program != None and data.program not in programs_list:
            return {"error" : "program doesnt exist in list of accepted programs"}
        user = (await session.execute(select(User).where(User.email == data.email))).first()
        if user is not None :
            return {"error" : "User already exist"}

        data = dict(data)
        data["password"] = auth_handler.get_password_hash(data["password"])
        user = User(**data)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        token = auth_handler.encode_token(user.email)
        return {"message" : {"token" : token, "user" : user}}
    except Exception as e:
        # respone.status_code = 404
        return {"error" : str(e)}

@app.post("/login")
async def login(
    data : LoginModel ,
    session : AsyncSession = Depends(get_session)
):
    try:
        user = (await session.execute(select(User).where(User.email == data.email))).first()
        if user is  None :
            return {"error" : "User doesnt exist"}
        user : User = user[0]
        if not auth_handler.verify_password(data.password, user.password ) :
            return {"error" : "incorrect password"}
        token = auth_handler.encode_token(user.email)
        return {"message" : {"token" : token, "user" : user}}
    except Exception as e:
        # respone.status_code = 404
        return {"error" : str(e)}


@app.post("/addprogram")
async def addprogram(
    data : AddProgramForm ,
    session : AsyncSession = Depends(get_session)
):
    try:
        prgrm = (await session.execute(select(Programme).where(Programme.name == data.name))).first()
        if prgrm is  None :
            prgrm = Programme(name=data.name, semesters= data.semester)
            session.add(prgrm)
            await session.commit()
            await session.refresh(prgrm)
        else :
            prgrm = prgrm[0]
        for course in data.courses:
            course_or_none = (await session.execute(select(Courses).where(Courses.title == course.title, Courses.status == course.status, Courses.programme_id ==  prgrm.id, Courses.code == course.code))).first()
            if course_or_none is None:
                crs = Courses(title=course.title, status=course.status, code = course.code, unit = course.unit, semester=course.semester, level=course.level,programme_id =  prgrm.id )
                session.add(crs)
                await session.commit()
                await session.refresh(crs)
        return {"message" : "success"}
    except Exception as e:
        # respone.status_code = 404
        return {"error" : str(e)}

@app.get("/getprogram/{name}")
async def getprogram(
    name : str,
    session : AsyncSession = Depends(get_session)
):

    try:
        prgrm = (await session.execute(select(Programme).where(Programme.name == name.strip()))).first()
        print(prgrm)
        if prgrm is  None :
            # respone.status_code = 404
            return {"error": "program not found"}
        else:
            prgrm = prgrm[0]
            course_list = (await session.execute(select(Courses).where(Courses.programme_id ==  prgrm.id))).all()
            return {"message": course_list}
    except Exception as e:
        # respone.status_code = 404
        return {"error" : str(e)} 


@app.post("/predict")
async def predict(
    data : PredictForm,
    email=Depends(auth_handler.auth_wrapper),
    session : AsyncSession = Depends(get_session)
):
    try:
        # the user email and data is confirmed 
        user : User = (await session.execute(select(User).where(User.email == email))).first()[0]
        # getting the user program from the program name
        programme: Programme = (await session.execute(select(Programme).where(Programme.name == user.program))).first()[0]
        
        user_grade_score = 0
        user_courses_list = []
        sum_of_units = 0
        grade = {"a" : 5 , "b" : 4 , "c" : 3, "d" : 2, "e" : 1, "f" : 0}
        cgpa_max_score = {"1" : 5.00, "21" : 4.49 , "22" : 3.49, "3" : 2.49, "pass" : 1.49}
        cgpa_min_score = {"1" : 4.50, "21" : 3.50 , "22" : 2.50, "3" : 1.5, "pass" : 1}
        cgpa_to_name = {"1" : "first class", "21" : "second class upper" , "22" : "second class lower", "3" : "third class", "pass" : "pass"}


        


        for courseandgrade in data.coursesandgrade:
            
            course_or_none = (await session.execute(select(Courses).where(Courses.id == courseandgrade.course_id, Courses.programme_id == programme.id ))).first()
            if course_or_none:
                course : Courses = course_or_none[0]
                try:
                    user_grade_score += (grade[courseandgrade.grade.lower()] * course.unit)
                except:
                    user_grade_score += (int(courseandgrade.grade.lower()) * course.unit)
                sum_of_units += course.unit
                user_courses_list.append(course)
            else :
                # respone.status_code = 404
                return {"error" : f" the course '{courseandgrade.course_name}' with id {courseandgrade.course_id} doesnt exist in this database", "name" : courseandgrade.course_name, "id" : courseandgrade.course_id }
            



        try:
            current_level, current_semester = data.level.split("-")
            current_level, current_semester = current_level.strip(), current_semester.strip()
        except: 
            # respone.status_code = 404
            return {"error" : "level parameter should be of the format 'level-semester'"}
        
        current_cgpa = user_grade_score / sum_of_units

        # if cgpa_max_score[data.degree] < current_cgpa:
        #     # respone.status_code = 404
        #     return {"error" : f"your cgpa at {current_cgpa} has excedded minimum cgpa required for {cgpa_to_name[data.degree]}."}
        
        
        completed_semesters = ((int(current_level[0]) * 2) - (0 if current_semester.lower() == "rain" else 1 ))


        final_courses_dict = {}

        minimum_score_per_course = data.minimum if data.minimum != None and data.minimum < 6 and data.minimum >= 0 else round(cgpa_min_score[data.degree] + 0.1)
        
        for semester_index in range(completed_semesters + 1, programme.semesters + 1):
        
            search_level =  "100" if semester_index <= 2 else  \
                                "200" if semester_index <= 4 else \
                                    "300" if semester_index <= 6 else \
                                        "400" if semester_index <= 8  else "500"
            if semester_index % 2 == 0:
                search_semester = '2'
            else :
                search_semester = "1"

            try:
                final_courses_dict[search_level]
            except Exception as e:
                final_courses_dict[search_level] = []


            list_of_courses = (await session.execute(select(Courses).where(Courses.level == search_level, Courses.semester == search_semester,  Courses.status != "E",Courses.status != "D" ))).all()
            for c in list_of_courses:
                val = dict(c[0])
                del val["_sa_instance_state"]
                user_grade_score += (minimum_score_per_course * val["unit"])
                sum_of_units += val["unit"]
                final_courses_dict[search_level].append(val)

        final_cgpa = user_grade_score/ sum_of_units
        if final_cgpa < cgpa_min_score[data.degree]:
            is_smaller = True
            not_empty = True
            i = 0
            final_courses_dict["elective"] = []
            list_of_courses = (await session.execute(select(Courses).where( Courses.status == "E"))).all()
            list_of_courses = list (list_of_courses)
            
            while is_smaller and not_empty:
                i +=1
                c = list_of_courses[0]
                del list_of_courses[0]
                val = dict(c[0])
                del val["_sa_instance_state"]
                user_grade_score += (minimum_score_per_course * val["unit"])
                sum_of_units += val["unit"]
                final_courses_dict["elective"].append(val)
                if (user_grade_score/ sum_of_units) >= cgpa_min_score[data.degree]:
                    is_smaller = False 
                if len(list_of_courses) <= 0:
                    not_empty = False
                if i == 100:
                    break


        if (user_grade_score/ sum_of_units) < cgpa_min_score[data.degree]:
            return {"cgpa" : round(user_grade_score/ sum_of_units, 2), "attainable" : False, "courses" : final_courses_dict }
        else :
            return {"cgpa" : round(user_grade_score/ sum_of_units, 2), "attainable" : True, "courses" : final_courses_dict }

    except Exception as e:
        # respone.status_code = 404
        return {"error" : "Please enter correct course list to proceed"} 
    