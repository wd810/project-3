
# coding: utf-8

# In[10]:


get_ipython().magic('matplotlib inline')
import pandas as pd
import numpy as np
import pymongo
import matplotlib.pyplot as plt
import seaborn as sns


# In[2]:


# connect to mongo db
client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client.pokemon_db
col_pokemon = db['pokemon_data']


# In[3]:


pokemon_data = pd.DataFrame(list(col_pokemon.find()))


# # pokemon weight

# In[4]:


pokemon_weight = pokemon_data[['id', 'name', 'weight']]
pokemon_weight.max()


# In[5]:


pokemon_weight.min()


# In[6]:


np.median(pokemon_weight['weight'])


# In[7]:


np.mean(pokemon_weight['weight'])


# In[11]:


#sns.set(color_codes=True)
#sns.distplot(pokemon_weight['weight'])


# # pokemon height

# In[12]:


pokemon_height = pokemon_data[['name', 'height']]
pokemon_height.max()


# In[13]:


pokemon_height.min()


# In[14]:


#sns.distplot(pokemon_height['height'])


# # pokemon type

# In[45]:


pokemon_type = pd.DataFrame(
    data = {
        'name': pokemon_data['name'],
        'type': [item[0]['type']['name'] for item in pokemon_data['types']]
    }
)
pokemon_type_output = pokemon_type.groupby('type').count().rename(index=str, columns={'name': 'number'})


# In[16]:


pokemon_shape = pokemon_height.merge(pokemon_weight, on='name', how='outer').merge(pokemon_type, on='name', how='outer')
pokemon_shape.plot(kind='scatter', x='height', y='weight')


# In[43]:


pokemon_shape['dens'] = pokemon_shape['height'] / pokemon_shape['weight']
pokemon_shape_avg = pokemon_shape.groupby('type').mean()


# In[46]:


pokemon_shape_avg = pokemon_shape_avg.drop(columns='id')
pokemon_type_data = pokemon_type_output.join(pokemon_shape_avg)


# In[50]:


#save type data to mongodb
col_type = db['pokemon_type']
col_type.insert_many(pokemon_type_data.T.to_dict('records'))


# In[51]:


pokemon_type_json = pokemon_type_data.T.to_json()

