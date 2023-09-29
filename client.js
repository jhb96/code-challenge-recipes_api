
/*
Client to query recipe API 

*/

///////////////// CONFIGURATION ////////////
const API_RECIPES_URL = "https://cm547hzn2j.execute-api.eu-west-1.amazonaws.com/dev/recipes";
const TOKEN = "allow"
///////////////////////////////////////////

const myArgs = process.argv.slice(2)
const axios = require('axios')


if (myArgs.length == 0 || myArgs[0] == "help") {
    console.log("----------------- INSTRUCTIONS -----------------")
    console.log("Please, follow the instructions to create a new recipe:")
    console.log("1- Create a new recipe: node client.js create json_file_inside_example")
    console.log("2- Get a recipe: node client.js retrieve recipe_id")
    console.log("3- Modify a recipe: node client.js modify json_file_inside_example")
    console.log("You have test examples in the Readme file")
    console.log("----------------------------------")
    return
}

switch (myArgs[0]) {
    case "retrieve":
        if( myArgs[1]) {
            retrieverecipe(myArgs[1])
        }else{

            console.log("Correct format to request a recipe: node client.js get recipe_id")
        }
    
        return
    
    case "create":
        console.log("---------------- CREATE recipe ------------------")
        console.log("Correct format to request a recipe: node client.js get recipe_id")
        if(myArgs[1]){
            createRecipe(myArgs[1], myArgs[2])
        }
        console.log("----------------------------------")
        return

    case "modify":
        console.log("----------------------------------")
        console.log("Correct format to request a recipe: node client.js get recipe_id")
        console.log("----------------------------------")

        if(myArgs[1]){
            modifyRecipe(myArgs[1])
        }

        return

    default:
        console.log("----------------------------------")
        console.log("Wrong second third param: valid create/modify/retrieve")
        console.log("----------------------------------")

        break;
}


function retrieverecipe(recipe_id){
    console.log("Searching recipe with id: " + recipe_id)
    const url = API_RECIPES_URL + "?recipe_id=" + recipe_id
    console.log("Request URL: " + url)
    const options = {
        url: url,
        method: 'GET',
        headers:{
            "Authorization": TOKEN
        }
    }

    axios(options)
    .then(res => {
        if(res.status == 200){
            console.log("-------- RESPONSE OK ---------")
            var recipe = res.data.Item
            console.log("Recipe id: " + recipe.id)
            console.log("Recipe name: " + recipe.name)
            if(res.data.Item.ingredients){
                console.log("Ingredients:")
                res.data.Item.ingredients.forEach( ing => console.log("- " + ing['name'] + " => " + ing['quantity']))
            }
            if(res.data.Item.steps){
                console.log("Steps:")
                var n = 0
                res.data.Item.steps.forEach( step => {
                        console.log( n + "- " + step['title']  + ( step.description ? `: ${step.description}`: "") )
                        n++
                    }
                )
            }

        }
        else{
            console.log("-------- RESPONSE ERROR ---------")
            return "Error code: " + res.HTTPStatusCode
        }
        
    })
    .catch(err => {
        console.log('Error: ', err.message);
    });

    
}

function modifyRecipe(recipe_file) {
    console.log("Modifying recipe with id: " + recipe_id)
    var recipe = require("./examples/" + recipe_file);
    console.log("Fields to update: " + JSON.stringify(recipe))

    try {
        const url = API_RECIPES_URL
        const options = {
            url: API_RECIPES_URL,
            method: 'PUT',
            data: JSON.stringify(recipe),
            headers:{
                "Authorization": TOKEN
            }
        }

        axios(options)
        .then(res => {
            if(res.status == 200){
                console.log("-------- RESPONSE OK ---------")
                console.log("Recipe modified!")
                console.log("Consult it with: node client.js retrieve " + recipe.id)

            }
            else{
                console.log("-------- RESPONSE ERROR ---------")
                return "Error code: " + res.HTTPStatusCode
            }
            
        })
    .catch(err => {
        console.error("dasdas")
        console.error('Error2: ', err.message);
    });

    } catch (error) {
        console.error("dasdas")
        console.error('Error: ', error);
    }
    
}

function createRecipe(recipe_file){
    // Get a file in current folder
    var recipe = require("./examples/" + recipe_file);
    console.log("Recipe to create: " + JSON.stringify(recipe))
    const options = {
        url: API_RECIPES_URL,
        method: 'POST',
        data: JSON.stringify(recipe),
        headers:{
            "Authorization": TOKEN
        }
    }
    axios(options)
    .then(res => {
        if(res.status == 200){
            console.log("-------- RESPONSE OK ---------")
            console.log("Recipe created!")
            console.log("Consult it with: node client.js retrieve " + recipe.id)
        }
        else{
            console.log("-------- RESPONSE ERROR ---------")
            return "Error code: " + res.HTTPStatusCode
        }
        
    })
    .catch(err => {
        console.error(err)
        console.error('Error: ', err.message, err.code);
    });

}