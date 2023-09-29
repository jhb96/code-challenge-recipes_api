import json
import os
from venv import create
import boto3

# ELASTICSEARCH 
#from elasticsearch import Elasticsearch
#es = Elasticsearch(hosts=[{'host': os.environ['ELASTIC_HOST'], 'port': os.environ['ELASTIC_PORT']}]) # Better practice: Clients outside handler

# DYNAMO DB
dynamo = boto3.client('dynamodb')
TABLE_NAME = os.environ['RECIPES_TABLE']

def lambda_handler(event, context):

    """     
    Function to handle the API call for recipe: 
        - GET requests return a specific recipe
        - POST requests create a new recipe
        - UPDATE requests updates a specific recipe
    } """
    
    """     
    For ElasticSearch:
    operations = {
        'GET': lambda es, data: es.get(index=recipe_INDEX, id=data['recipe_id']), # RETRIEVE recipe
        'POST': lambda es, data: es.index(index=recipe_INDEX, body=data), # CREATE recipe
        'PUT': lambda es, data: es.update(index=recipe_INDEX, id=data['recipe_id'], document=data['fields_to_modify']) # UPDATE recipe
        #'DELETE': lambda es, data: es.delete(index = recipe_INDEX, id=recipe_id), # NOT REQUIRED
    } """

    print({"Context":"start lambda", "event": event})
    operations = {
        'GET': lambda x: get_recipe(x),
        'POST': lambda x: create_recipe(x),
        'PUT': lambda x: update_recipe(x['recipe_id'], x['fields_to_modify']),
        #'DELETE': lambda dynamo, x: dynamo.delete_item(**x), # NOT REQUIRED
    }    

    operation = event['httpMethod']
    if operation in operations: # Check if operation is valid
    
        payload = event['queryStringParameters'] if operation == 'GET' else json.loads(event['body'])
        print("Payload", payload)
        return respond(None, operations[operation](payload))
    else:
        return respond(ValueError('Unsupported method "{}"'.format(operation)))



def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200', 
        'body': err.message if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
        }

    }



def formatToDynamoDB(item):
    from boto3.dynamodb.types import TypeSerializer
    serializer =  TypeSerializer()
    return {key: serializer.serialize(value) for key, value in item.items()}

def formatToDict(dynamo):
    # To go from low-level format to python
    from boto3.dynamodb.types import TypeDeserializer
    deserializer = TypeDeserializer()
    return {k: deserializer.deserialize(v) for k,v in dynamo.items()}


#To Correct The Keys, If Automated Extraction From Forms

def update_recipe(recipe_id, item):
    item_dynamo = formatToDynamoDB(item)
    return dynamo.update_item(TableName = TABLE_NAME, Key = {'id': {'S': recipe_id}} , AttributeUpdates = item_dynamo)


def create_recipe(item):
    item_dynamo = formatToDynamoDB(item)
    return dynamo.put_item(TableName = TABLE_NAME, Item = item_dynamo)

def get_recipe(item):
    response = dynamo.get_item(TableName = TABLE_NAME, Key = {'id': {'S': item['recipe_id']}})
    response['Item'] = formatToDict(response['Item'])
    print("Response: ", response)
    return response