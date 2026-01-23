### Use virtual enviroment (Best Method)
1. Create a Virtual Enviroment to save libraries
    > python -m venv .venv

2. Activate venv
bash: source .venv/Scripts/activate

3. install libraries
pip install uvicorn fastapi yfinance yahooquery

4. Run
$ uvicorn app.main:app --reload
Or
$ python -m uvicorn app.main:app --reload

### Docker Setup

1. Build Image
$ docker build -t yfinance-fastapi .

2. Build Container and run container

> $ docker run -d -p 8000:8000 --name container_name image_name

> $ docker run -d -p 8000:8000 --name yfinance-fastapi yfinance-fastapi


### Test FastAPI Alone

1. Create a Virtual Enviroment to save libraries
    > python -m venv .venv

2. Activate Venv
    > source .venv/Scripts/activate

3. Install libraries
    > pip install fastapi uvicorn
    
    Or : Keep libraries in requirements.txt
    ```requirements.txt
    fastapi
    uvicorn
    ```
    > pip install -r requirements.txt

4. Run project
    > uvicorn app.main:app --reload

    Rmb to activate venv before using this command. Refer Step 2.