import torch
from transformers import BertTokenizer, BertModel
import os
import dill
import pandas as pd

# from .models import Track

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

class MLModel(torch.nn.Module):
    def __init__(self):
        super(MLModel, self).__init__()
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', do_lower_case=True)
        self.bert = BertModel.from_pretrained('bert-base-uncased', output_hidden_states = True)
        self.bert.eval()

        self.songid_to_embedding = read_file('../embedding_dict')
        self.embedding_to_songid = {str(v): k for k,v in self.songid_to_embedding.items()}
        self.embeddings = torch.stack(list(self.songid_to_embedding.values()))
        self.k = 6
        self.max_len = 510

    def text_to_embedding(self, in_text):
        '''
        Uses the BERT 'model' and 'tokenizer' to generate a vector
        representation of the input string, 'in_text'.

        Returns the vector stored as a numpy ndarray.
        '''
        token_vecs = []
        for i in range(len(in_text)):

            # tokenizer will:
            #  (1) Tokenize the sentence
            #  (2) Prepend the '[CLS]' token to the start.
            #  (3) Append the '[SEP]' token to the end.
            #  (4) Map tokens to their IDs.
            results = self.tokenizer(
                in_text[i],                         # sentence to encode.
                add_special_tokens = True,       # Add '[CLS]' and '[SEP]'
                truncation=True,                 # Truncate all sentences.
                max_length = self.max_len,       # Length to truncate to.
                padding=True,                    # Pad to the longest sequence
                return_attention_mask=True,      
            )

            input_ids = results.input_ids
            attn_mask = results.attention_mask

            # Cast to tensors.
            input_ids = torch.tensor(input_ids).unsqueeze(0)
            attn_mask = torch.tensor(attn_mask).unsqueeze(0) 

            with torch.no_grad():

                outputs = self.bert(
                    input_ids = input_ids,
                    token_type_ids = None,
                    attention_mask = attn_mask)
                
                hidden_states = outputs[2]

                # Sentence Vectors
                # To get a single vector for our entire sentence we have multiple 
                # application-dependent strategies, but a simple approach is to 
                # average the second to last hiden layer of each token producing 
                # a single 768 length vector.
                # `hidden_states` has shape [13 x batch_size x 510 x 768]

                # Take mean of each vector for each token in the sequence after concatenating last 4 hidden layers
                # `token_vecs` is a tensor with shape [batch_size x (768*4)]
                track_token_vecs = torch.mean(torch.cat((hidden_states[-4], hidden_states[-3], hidden_states[-2], hidden_states[-1]), dim=2), dim=1)
                # print("Token vecs size:", token_vecs_batch.size())

            token_vecs.append(track_token_vecs)

            # Stack all batches
        sentence_embedding = torch.cat(token_vecs)

        return sentence_embedding

    def knn(self, x, y=None, p = 2):
        y = x if type(y) == type(None) else y

        size = (x.size(0), y.size(0), x.size(1))
        x = x.unsqueeze(1).expand(*size)
        y = y.unsqueeze(0).expand(*size)

        dist = torch.linalg.norm(x-y, p, dim=2)
        return torch.topk(dist, self.k, largest=False)
    
    def forward(self, song_id, lyrics, is_new=False):

        if is_new:
            vectors = self.text_to_embedding([lyrics])
            self.update(song_id, vectors[0].detach().numpy())
        else:
            vectors = self.songid_to_embedding[song_id].unsqueeze(0)

        sim_scores, indices = self.knn(vectors, self.embeddings)
        song_ids = torch.tensor([self.embedding_to_songid[str(self.embeddings[i])] for i in indices[0]])
        out = torch.t(torch.cat((song_ids[None,:], sim_scores))).detach().numpy()
        
        if song_ids[0] != song_id or sim_scores[0][0] != 0:
            raise Exception('Closest id to {} {} is {} with sim score {}'.format(song_id, '(new)' if is_new else '',
                                                                                    song_ids[0], sim_scores[0][0]))
        return out

    def update(self, song_id, embedding):
        self.songid_to_embedding[song_id] = embedding
        self.embedding_to_songid[str(embedding)] = song_id
        self.embeddings = torch.cat(self.embeddings, embedding[None, :])
        write_file('../embedding_dict', self.songid_to_embedding)

# if os.path.isfile('model.pt'):
#     model = torch.load('model.pt')
# else:
# model = MLModel()
# torch.save(model, 'model.pt')

# def get_recs(lyrics):
#     return model(lyrics)