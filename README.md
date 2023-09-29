# Code challenge: Gota, an API for recipes.
Challenge description can be found in [challenge_description](challenge_description.md)
The proposed solution can be found in [solution](solution.md) and explain all the components choosed that will be deployed in aws.

## Challenge topics
Make an AWS serverless arquitecture with a CRUD API for recipes.

Make an nodejs client to test the API.

Duration: 2 days

Basically, this code challenge wants to probe the knowledge of the candidate in the following topics:
- Serverless architecture
- Python or Go programming languages
- AWS knowledge: arquitecture, deployment, etc
- Multiple non-relational databases: DynamoDB, ElasticSearch, etc
- NodeJS knowledge: API client
- Docker (optionally)

## Requirements
To deploy the API you need:
- [An AWS profile configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) in your CLI with enough permissions to deploy the API
- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) installed
- [Docker](https://docs.docker.com/get-docker/) installed 
- [Node](), including the NPM package management tool.

## Getting started

Download this repository in local

```ruby
git clone https://github.com/jhb96/code-challenge-recipes_api
cd code-challenge-recipes_api
```

## Deployment

To deploy all the components of the API, we will use Serverless Application Model (SAM) to create the stack.
You can also use other serverless cli compatible with SAM, but we are going to use SAM CLI.

To build, deploy and install dependencies you can just uses the start command:
```ruby
npm start
```

You will be asked with a series of prompts to configure your stack. Choose the name and region and i recommend choose the default configurations in the rest.

Finally, if the process is successful, the API will be up and running. And you will get an output with the URL of the API in the output. You must copy it in order to test the api.

Also, you can get the API url using:

```ruby
aws cloudformation describe-stacks --stack-name {{your_stack_name}} --query 'Stacks[0].Outputs[0].OutputValue' --output text
```


## Run & Test

Requirements:  
You need to have the API deployed in order to run the tests and have node installed if you want to use the client in this repository.

Configure the client with your API url:
- Get your API's URL in the configuration.yml and paste it in the client.js file in the configuration section: API_RECIPES_URL
- Don't change the TOKEN value, it's already configured.

### Test

**Note**: I detected a problem, probably with caching in authorization that don't allow you to change the method (get,post) in the api after 5 minutes. So if you create a recipe you have to wait 5 minutes to test the get method.
Sorry! I will fix it when i have some time!

You can test your API with the client you wish, but i prepared a client to easy test the API.
We have a folder with examples files to test the get/post/create methods.


- Create a recipe:

You can create a new recipe writting it with the correct format in the folder example.
Format is specified in the challenge description.

```ruby
node client.js create recipe_json_file_inside_example_folder
For example:
node client.js create recipe_pizza.json
node client.js create burger_classic.json
```
- Get a recipe:
```ruby
node client.js retrieve recipe_id
For example:
node client.js pizza_margherita_italian

```
- Update a recipe:
```
Soon
```

## Cleanup 
In order to delete all the resources created by the API, you can use the following command:

```ruby
npm delete 
```
and confirm all the questions to delete the stack correctly.
