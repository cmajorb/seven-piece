FROM python:3.10

WORKDIR /
COPY ./requirements.txt /
RUN pip install --upgrade pip
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY . /
EXPOSE 80

# CMD ["uwsgi", "--ini", "/uwsgi.ini"]
CMD ["python", "sevenpiece/manage.py", "runserver", "0.0.0.0:80"]