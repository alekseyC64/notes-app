# Notes App

## Requirments:
 - MySQL Server
 - [Python 2.7.*](https://www.python.org/downloads/)
 - [pip](https://pip.pypa.io/en/stable/installing/)

## Set MySql Server

> **`Watch this first` to learn how to install MySQL Server on Ubuntu https://youtu.be/54DDI4wUwqU** (in case you dont't know)

Need to create DB user:
```sh
User: bigdaddy
Password: bigdb
```

```sh
$ mysql -u root -p -h localhost
> Enter password:
```
```sh
mysql> CREATE DATABASE notesapp_db CHARACTER SET utf8 COLLATE utf8_general_ci;
```
```sh
mysql> GRANT ALL PRIVILEGES ON notesapp_db.* TO 'bigdaddy'@'localhost' IDENTIFIED BY 'bigdb';
```

##### Type `'help;'` or `'\h'` for help. Type `'\c'` to `clear` the current input statement.
---

## pip

> pip will already be installed if you're working in a [Virtual Environment](https://packaging.python.org/installing/#creating-and-using-virtual-environments) created by [virtualenv](https://packaging.python.org/key_projects/#virtualenv) or [pyvenv](https://packaging.python.org/key_projects/#venv).

Installing with `get-pip.py`

> To install pip, securely download [get-pip.py](https://bootstrap.pypa.io/get-pip.py).

Then `cd` into folder with this file and run the following:
```sh
$ python get-pip.py
```
```sh
$ git clone https://github.com/evgeny-sav/notes-app.git
```
```sh
$ cd notes-app
```
[virtualenvwrapper](http://virtualenvwrapper.readthedocs.io/en/latest/install.html#basic-installation):
```sh
$ sudo pip install virtualenvwrapper
```
[make virtual environment](http://virtualenvwrapper.readthedocs.io/en/latest/install.html#quick-start):
```sh
$ mkvirtualenv notes-app
```
Bind an existing virtualenv to an existing project: [setvirtualenvproject](http://virtualenvwrapper.readthedocs.io/en/latest/command_ref.html#setvirtualenvproject)

Syntax:
```sh
$ setvirtualenvproject [virtualenv_path project_path]
 or
$ setvirtualenvproject
```
Update pip:
```sh
$ pip install --upgrade pip
```
To install requirments from `requirments.txt`:

on Ubuntu install `libmysqlclient-dev` before installing requirments:
```sh
sudo apt-get install libmysqlclient-dev
```
install requirements
```sh
$ pip install -r requirements.txt
```



### Django:

```sh
$ cd notes_app
$ python manage.py migrate
$ python manage.py runserver
```
Go to http://localhost:8000/
