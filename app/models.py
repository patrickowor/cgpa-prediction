from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class Programme(SQLModel, table=True):
   ''' this is an example user model for sqlmodel'''
   id: int = Field(default=None, primary_key=True)
   name: str
   semesters : int = Field(default=8)
   courses : List["Courses"] = Relationship(back_populates="programme")
    
class CoursesModel(SQLModel):
   title : str
   code : str
   unit : int 
   status : str 
   semester : str 
   level : str 
   # semester_index : int 


class Courses(CoursesModel, table=True):
   ''' this is an example user model for sqlmodel'''
   id: int = Field(default=None, primary_key=True)
   programme_id : int =  Field(foreign_key="programme.id")
   programme : Optional[Programme] = Relationship(back_populates="courses")

class UserModel(SQLModel):
   firstname : str 
   lastname : str 
   username : str 
   email : str 
   password : str
   program : str = Field(default="computer engineering")
class User(UserModel, table=True):
   id: int = Field(default=None, primary_key=True)