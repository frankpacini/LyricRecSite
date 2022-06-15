import os

import pandas as pd
import pyodbc
import dill
from tqdm import tqdm

import torch
from transformers import BertTokenizer, BertModel

s = open('../creds.txt').read().split('\n')

server = 'lyricrec.database.windows.net'
database = 'LyricRec'
username = s[1]
password = '{' + s[2] + '}'   
driver= '{ODBC Driver 17 for SQL Server}'

print("Connecting to db with creds {} {}".format(username, password))
with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
    with conn.cursor() as cursor:
        print("Retrieving data from db")
        query = "SELECT * FROM tracks;"
        df = pd.read_sql(query, conn)
        df.to_csv("output/tracks.csv")