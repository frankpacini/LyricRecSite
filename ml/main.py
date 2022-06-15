import os

import pandas as pd
import pyodbc
import dill
from tqdm import tqdm

import torch
from transformers import BertTokenizer, BertModel

def write_file(output_path, obj):
    ## Write to file
    if output_path is not None:
        folder_path = os.path.dirname(output_path)  # create an output folder
        if not os.path.exists(folder_path):  # mkdir the folder to store output files
            os.makedirs(folder_path)
        with open(output_path, 'wb') as f:
            dill.dump(obj, f)
    return True
def read_file(path):
    with open(path, 'rb') as f:
        generator = dill.load(f)
    return generator

def text_to_embedding(tokenizer, model, in_text):
    '''
    Uses the provided BERT 'model' and 'tokenizer' to generate a vector
    representation of the input string, 'in_text'.

    Returns the vector stored as a numpy ndarray.
    '''

    # ===========================
    #   STEP 1: Tokenization
    # ===========================

    MAX_LEN = 510

    # tokenizer will:
    #  (1) Tokenize the sentence
    #  (2) Prepend the '[CLS]' token to the start.
    #  (3) Append the '[SEP]' token to the end.
    #  (4) Map tokens to their IDs.
    print("Tokenizing...")
    output_path = "./output/bert_tokens"
    if os.path.isfile(output_path):
        results = read_file(output_path)
    else:
        results = tokenizer(
            in_text,                         # sentence to encode.
            add_special_tokens = True,       # Add '[CLS]' and '[SEP]'
            truncation=True,                 # Truncate all sentences.
            max_length = MAX_LEN,            # Length to truncate to.
            padding=True,                    # Pad to the longest sequence
            return_attention_mask=True,      
        )
        write_file(output_path, results)

    input_ids = results.input_ids
    attn_mask = results.attention_mask

    # Cast to tensors.
    input_ids = torch.tensor(input_ids)
    attn_mask = torch.tensor(attn_mask)

    # Add an extra dimension for the "batch" (even though there is only one
    # input in this batch)
    # input_ids = input_ids.unsqueeze(0)
    # attn_mask = attn_mask.unsqueeze(0)


    # ===========================
    #   STEP 1: Tokenization
    # ===========================

    # Put the model in evaluation mode--the dropout layers behave differently
    # during evaluation.
    model.eval()

    # telling the model not to build the backward graph will make this
    # a little quicker.
    with torch.no_grad():

        # Forward pass, returns hidden states and predictions
        # This will return the logits rather than the loss because we have
        # not provided labels.
        print("Running model...")
        print(input_ids.size(), attn_mask.size())

        split_size = input_ids.size()[0]//128
        full_input_ids = torch.split(input_ids, split_size)
        full_attn_mask = torch.split(attn_mask, split_size)

        token_vecs_batches = []
        for batch in tqdm(range(len(full_input_ids))):
            input_id_batch = full_input_ids[batch]
            attn_mask_batch = full_attn_mask[batch]

            outputs = model(
                input_ids = input_id_batch,
                token_type_ids = None,
                attention_mask = attn_mask_batch)
            
            print("Processing batch {}".format(batch))
            hidden_states = outputs[2]

            # Sentence Vectors
            # To get a single vector for our entire sentence we have multiple 
            # application-dependent strategies, but a simple approach is to 
            # average the second to last hiden layer of each token producing 
            # a single 768 length vector.
            # `hidden_states` has shape [13 x batch_size x 510 x 768]

            # Take mean of each vector for each token in the sequence after concatenating last 4 hidden layers
            # `token_vecs` is a tensor with shape [batch_size x (768*4)]
            token_vecs_batch = torch.mean(torch.cat((hidden_states[-4], hidden_states[-3], hidden_states[-2], hidden_states[-1]), dim=2), dim=1)
            # print("Token vecs size:", token_vecs_batch.size())

            token_vecs_batches.append(token_vecs_batch)

        # Stack all batches
        sentence_embedding = torch.cat(token_vecs_batches)
        print("Embedding size:", sentence_embedding.size())
            
        # Move to the CPU and convert to numpy ndarray.
        sentence_embedding = sentence_embedding.detach().cpu().numpy()

        return sentence_embedding

def Bert2Vec(df):
    # Load pre-trained model (weights)
    model = BertModel.from_pretrained('bert-base-uncased', output_hidden_states = True)
    # model.cuda()

    # Load the BERT tokenizer.
    print('Loading BERT tokenizer...')
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', do_lower_case=True)
    
    vectors = text_to_embedding(tokenizer, model, df['Lyrics'].tolist())
    return vectors


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
        query = "SELECT Lyrics FROM tracks;"
        df = pd.read_sql(query, conn)

print("Generating embeddings")
output_path = "./output/bert2vec"
embeddings = Bert2Vec(df)
write_file(output_path, embeddings)