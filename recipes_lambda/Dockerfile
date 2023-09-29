FROM public.ecr.aws/lambda/python:3.9

COPY recipesApiLambda.py requirements.txt ./

RUN python3.9 -m pip install -r requirements.txt -t . 

CMD ["recipesApiLambda.lambda_handler"]