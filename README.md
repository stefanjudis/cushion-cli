![cushion logo](https://raw.github.com/stefanjudis/cushion-cli/master/assets/cushion-cli-page-logo.png)

# cushion-cli [![Build Status](https://travis-ci.org/stefanjudis/cushion-cli.png?branch=master)](https://travis-ci.org/stefanjudis/cushion-cli) [![NPM version](https://badge.fury.io/js/cushion-cli.png)](http://badge.fury.io/js/cushion-cli) [![Dependency Status](https://gemnasium.com/stefanjudis/cushion-cli.png)](https://gemnasium.com/stefanjudis/cushion-cli)


## Your are a command line hero. And you like CouchDB. Maybe cushion-cli is something for you.

### Command line tool for cushion CouchDB API. It is based on the node.js CouchDB-Api [Cushion](https://github.com/Zoddy/cushion).


###[Introduction on Youtube](https://www.youtube.com/watch?v=w5ppOvKwWC0)


## Getting Started
Install the module with: `npm install -g cushion-cli`

After that the global `cushion` command should be available in your terminal. Call it and you will be introduced by the cushion setup for a connection. You will be asked for host, port and if you want to setup a connection as an admin or not. If so you need to enter you admin name and password.


## General Commands ( not depending on level and usable all the time ):

### connection

**Description:** Switch to connection level.

No matter at which level you are, you can jump to connection level to use specific commands at this level.

After switching to connection level there will be a few new connection specific commands. So check them out by only pressing **TAB**.

**Example:**

```
document ✩ [documentName] ✩ -> connection
connection ✩ [host] ✩ ->
```

### database [databaseName]
**Description:** Switch to database level.

Jump to database level with command. If you are at connection level you need to set up a name. That means if you want to set up a new database switch the new name only and call the ```create``` command afterwards. If you want to work with an existing one type in database and enter first letter and press **TAB** . 

**! This command is supported by auto-completion !**

After switching to database level there will be a few new database specific commands. So check them out by only pressing **TAB**.

If you are at document level use this command to go back to database level. Alternatively you could use ```..```.

**Examples:**

```
connection ✩ [host] ✩ -> database [databaseName]
database ✩ [databaseName] ✩ ->
```

```
document ✩ [documentName] ✩ -> database
database ✩ [databaseName] ✩ ->
```

### exit

**Description:** Stop cushion and to something else.

**Example:**

```
conncetion ✩ [host] ✩ -> exit
Bye bye - happy couching
```

### help [command]

**Description:** Look for help for specific command.

**This command is level specific!** It will only show you the help messages for commands available on your current level (connection, database, document, user). To check which commands are available for some help (if you find something that is missing, [please drop me a line](mailto:stefanjudis@gmail.com)) enter ```help```and press **TAB**. 

**! This command is supported by auto-completion !**

**Example:**

```
connection ✩ [host] ✩ -> help version

Get version of connected couchdb.

Command:
    $ version
    
connection ✩ [host] ✩ ->
```

### listDatabases

**Description:** Get list of all databases of current CouchDB connection.

**Example:**

```
connection ✩ [host] ✩ -> listDatabases

CouchDB includes the following databases:

Response:
- _replicator
- _users
- foo
- bar
- baz

connection ✩ [host] ✩ ->
```

### listUsers

**Description:** Get list of all users of connected CouchDB.

**Example:**

```
connection ✩ [host] ✩ -> listUsers

Following users exist:

Response:
- foo
- bar

connection ✩ [host] ✩ ->
```

### user [userName]

**Description:** Switch to user level.

Enter a given name for switching either to an existing user or for creating a new one by calling ```create``` at user level. To check which users are available to switch to enter ```user```and press **TAB**.

**! This command is supported by auto-completion !**

After switching to user level there will be a few new user specific commands. So check them out by only pressing **TAB**.

**Example:**

```
connection ✩ [host] ✩ -> user [userName]
user ✩ [userName] ✩ ->
```

### [..]

**Description:** Switch to parent level.

If you are at document level you will switch to database level. Database and user level will switch to connection level. Command at connection level will do nothing.

**Example:**

```
database ✩ [databaseName] ✩ -> ..
connection ✩ [host] ✩ ->
```


## Connection Level Commands ( "connection ✩ [host] ✩ ->" ):

### activeTaks

**Description:** Get list of active tasks.

**Example:**

```
connection ✩ [host] ✩ -> activeTasks

Response:
(empty array)

connection ✩ 127.0.0.1 ✩ ->
```

### config [section] [option] [value]

**Description:** Get or set config information.

The parameters section, option and value are optional. So if you want to retrieve all config information just call ```config``` without any parameters. If you want to retrieve config information for a particular section call ```config [section]``` and so on. If you want to **set** any config option just set the value as third parameter ( 4th example ).

**! This command is supported by auto-completion for section !**

**Examples:**

```
connection ✩ [host] ✩ -> config

Response:
httpd_design_handlers:
  _info:    {couch_httpd_db,   handle_design_info_req}
  _list:    {couch_httpd_show, handle_view_list_req}
  …
  a lot of fancy information here
  …
  util_driver_dir:    /opt/local/lib/couchdb/erlang/lib/couch-1.1.1/priv/lib
  view_index_dir:     /opt/local/var/lib/couchdb

connection ✩ [host] ✩ ->
```

```
connection ✩ [host] ✩ -> config stats

Response:
rate:    1000
samples: [0, 60, 300, 900]

connection ✩ host ✩ ->
```

```
connection ✩ [host] ✩ -> config stats rate

Response:
1000

connection ✩ [host] ✩ ->
```

```
connection ✩ [host] ✩ -> config ssl port 1000

Response:
true

connection ✩ [host] ✩ -> config ssl port

Response:
1000

connection ✩ 127.0.0.1 ✩ ->
```

### createAdmin [name] [password]

**Description:** Create a new admin. You have got the possibilities to do in one step or to run a prompt dialog asking for name and password.

**Examples:**

```
connection ✩ [host] ✩ -> createAdmin
What is the name of admin? john
What is the password for john? fancyPassword
Admin was created.

Response:
true

connection ✩ [host] ✩ ->
```

```
connection ✩ [host] ✩ -> createAdmin john fancyPassword
Admin was created.

Response:
true

connection ✩ [host] ✩ ->
```

### deleteAdmin [name]

**Description:** Delete an existing admin. You have got the possibilities to do in one step or to run a prompt dialog asking for admin name.

**Examples:**

```
connection ✩ [host] ✩ -> deleteAdmin
What is the name of admin? john
Admin was deleted.

Response:
true

connection ✩ [host] ✩ ->
```

```
connection ✩ [host] ✩ -> deleteAdmin john
Admin was deleted.

Response:
true

connection ✩ [host] ✩ ->
```
### deleteConnection [name|index]

**Description:** If you set up a new connection you have the possibility to save the connection for later usage. Additional to that you can save connection by calling the [saveConnection](#saveconnection-name) command. To delete useless connection from storage use this command.

**! This command is supported by auto-completion for the connection name !**

**Examples:**

```
Connection file found.
You have the following saved connections:

(1) local -> 127.0.0.1
(2) foo -> 127.0.0.1
…
a lot of fancy information here
…
connection ✩ [host] ✩ -> deleteConnection foo

Connection foo deleted.

connection ✩ [host] ✩ ->
```

```
Connection file found.
You have the following saved connections:

(1) local -> 127.0.0.1
(2) foo -> 127.0.0.1
…
a lot of fancy information here
…
connection ✩ [host] ✩ -> deleteConnection 2

Connection foo deleted.

connection ✩ [host] ✩ ->

```

### listAdmins

**Description:** Retrieve a list of admins of connected CouchDB.

**Examples:**

```
connection ✩ [host] ✩ -> listAdmins

Response:
foo:    -hashed-2e385bfb093b1b122730ad2da7923217c2db2284,eeb71f0578016a523b22271d53595fd8
bar:    -hashed-a4bc105fc8c0cd4bd09c4233cb987e246d3994bb,f7febdc698f7ef097136a196c2d051d8

connection ✩ [host] ✩ ->
```

### log [bytes]

**Description:** Retrieve the tail of the server logs of connected CouchDB. Without set bytes param you will get 1000 Bytes of the tail.

**Examples:**

```
connection ✩ [host] ✩ -> log

Response:
T] [info] [<0.23322.8>] 127.0.0.1 - - 'GET' /_config 200
[Tue, 12 Mar 2013 21:58:41 GMT] [info] [<0.31614.8>] 127.0.0.1 - - 'GET' / 200
…
lot of fancy information here
…
[Tue, 12 Mar 2013 22:16:03 GMT] [info] [<0.8336.9>] 127.0.0.1 - - 'GET' / 200

connection ✩ [host] ✩ ->
```

```
connection ✩ [host] ✩ -> log 32

Response:
0.1 - - 'GET' /_log?bytes=8 200

connection ✩ [host] ✩ ->
```

### restart

**Description:** Restart the CouchDB. You have to be logged in as admin to do so.

**Example:**

```
connection ✩ [host] ✩ -> restart

Response:
ok: true

connection ✩ [host] ✩ ->
```

### saveConnection [name]

**Description:** Save the connection for later usage. 

**Example:**

```
connection ✩ [host] ✩ -> saveConnection foo

Connection foo was saved.

connection ✩ [host] ✩ ->
```

### showConnection

**Description:** If you are at a new connection and you forgot what the settings was, this command will give you information about current connection.

**Example:**

```
connection ✩ [host] ✩ -> showConnection

Your current connection is:

host -> 127.0.0.1
port -> 5984
username -> john
password -> fancyPassword
secure -> false
path -> some/path/to/someWhere

connection ✩ [host] ✩ ->
```

### showConnections

**Description:** Get a list of all saved connections.

**Example:**

```
connection ✩ [host] ✩ -> showConnections
Connection file found.
You have the following saved connections:

(1) local -> 127.0.0.1
(2) foo -> someHost
(3) bar -> anotherHost

connection ✩ host ✩ ->
```

### stats

**Description:** Get server statistics.

**Example:**

```
connection ✩ [host] ✩ -> stats

Response:
couchdb:
  open_databases:
    description: number of open databases
    current:     null
    sum:         null
    …
    a lot of fancy information here
    …
    min:         null
    max:         null

connection ✩ [host] ✩ ->
```

### uuids [numberOfUuids]

**Description:** Create CouchDB uuids.

**Examples:**

```
connection ✩ [host] ✩ -> uuids

Response:
- 4be0aced2a9fba4d4514ceb56e000d6b

connection ✩ [host] ✩ ->
```

```
connection ✩ [host] ✩ -> uuids 10

Response:
- 4be0aced2a9fba4d4514ceb56e001cee
- 4be0aced2a9fba4d4514ceb56e002286
- 4be0aced2a9fba4d4514ceb56e003050
- 4be0aced2a9fba4d4514ceb56e00399e
- 4be0aced2a9fba4d4514ceb56e003afd
- 4be0aced2a9fba4d4514ceb56e0045fd
- 4be0aced2a9fba4d4514ceb56e00510b
- 4be0aced2a9fba4d4514ceb56e005973
- 4be0aced2a9fba4d4514ceb56e0067a0
- 4be0aced2a9fba4d4514ceb56e006be4

connection ✩ [host] ✩ ->
```

### version

**Description:** Get version of connected CouchDB.

**Example:**

```
connection ✩ [host] ✩ -> version

Response:
1.1.1

connection ✩ [host] ✩ ->
```

## Database Level Commands ( "database ✩ [databaseName] ✩ ->" ):

### allDesignDocuments 

**Description:** Get a list of all design documents. The representation is without '_design/' at the beginning, because you have to use it at ```view``` command without prefix anyway.

**Example:**

```
database ✩ [databaseName] ✩ -> allDesignDocuments
This databases includes of 2 design documents.

Response:
- designFoo
- designBar

database ✩ [databaseName] ✩ ->
```

### allDocuments [param1] [param2] ...

**Description:** Get a list of all documents given in selected database. Look for all possible param at [here](http://wiki.apache.org/couchdb/HTTP_Document_API#all_docs) at query parameters.

**Example:**

```
database ✩ [databaseName] ✩ -> allDocuments
This databases exists of 10 documents.
Displayed result has an offset of 0

Response:
Doc1:            6-841ea3bec41a1ccbf776591dda80e1f9
Doc2:            14-f65a9da7700c81a73d23985e7fe286b2
_design/entries: 2-3b756e80956bb0ddff78dbd9a4468a3e
Doc3:            19-819e98e81df4c835841e51b83749c918
…

database ✩ [databaseName] ✩ ->
```

```
database ✩ [databaseName] ✩ -> allDocuments limit=3 startkey="_design/entries"
This databases exists of 10 documents.
Displayed result has an offset of 2

Response:
_design/entries: 2-3b756e80956bb0ddff78dbd9a4468a3e
Doc3:            19-819e98e81df4c835841e51b83749c918
Doc4:            15-04000ead021dacbcf43a8c8969c5b2f1

database ✩ [databaseName] ✩ ->
```

### allViews [designName]

**Description:** Get a list of views for design document.

**! This command is supported by auto-completion for the design name !**

**Example:**

```
database ✩ [databaseName] ✩ -> allViews foo
This design document includes of 2 views.

Response:
- viewBar
- viewBaz

database ✩ [databaseName] ✩ ->
```

### cleanup

**Description:** Start [view cleanup](http://wiki.apache.org/couchdb/HTTP_view_API#View_Cleanup) for connected database.

**Example:**

```
database ✩ [databaseName] ✩ -> cleanup

Response:
true

database ✩ [databaseName] ✩ ->
```

### compact

**Description:** Start [compaction](http://wiki.apache.org/couchdb/Compaction) for connected database.

**Example:**

```
database ✩ [databaseName] ✩ -> compact

Response:
true

database ✩ [databaseName] ✩ ->
```

### create

**Description:** Create new database (if not exist) and set it in CouchDB. You need to be at database level to execute this command. 

**Example:**

```
connection ✩ [host] ✩ -> database foo

Switched to database foo

database ✩ foo ✩ -> create

Database created.

database ✩ foo ✩ -> listDatabases

CouchDB includes the following databases:

Response:
- _replicator
- _users
- db1
- db2
- foo

database ✩ foo ✩ ->
```

### destroy

**Description:** Delete given database and remove it from CouchDB. Switch to database level of an existing database and call ```destroy```command.

**Example:**

```
connection ✩ [host] ✩ -> listDatabases

CouchDB includes the following databases:

Response:
- _replicator
- _users
- db1
- db2
- foo

connection ✩ [host] ✩ -> database foo

Switched to database foo

database ✩ foo ✩ -> destroy

Database deleted.

Switched to connection level

connection ✩ [host] ✩ -> listDatabases

CouchDB includes the following databases:

Response:
- _replicator
- _users
- db1
- db2

connection ✩ [host] ✩ -
```

### document [docId]

**Description:** Switch to document level by ID. If you don't set the ID CouchDB will set it for you later. After switching to document level don't forget to ```load``` given document, if you want to access the data.

**! This command is supported by auto-completion for the document id !**

**Example:**

```
database ✩ [databaseName] ✩ -> document doc1

Switched to document level.

document ✩ doc1 ✩ ->
```

```
database ✩ [databaseName] ✩ -> document

Switched to document level.

document ✩ ... ✩ ->
```

### ensureFullCommit

**Description:** Saves all uncommited stuff to the disk.

**Example:**

```
database ✩ [databaseName] ✩ -> ensureFullCommit

Response:
true

database ✩ [databaseName] ✩ ->
```

### exists

**Description:** Check if given database already exists. If not, you can create it. If so, you can delete it.

**Examples:**

```
atabase ✩ [existingDatabase] ✩ -> exists

Database already exists.

database ✩ [existingDatabase] ✩
```

```
database ✩ [notExistingDatabase] ✩ -> exists

Database doesn't exist yet.

database ✩ [notExistingDatabase] ✩ ->
```

### info

**Description:** Get information about connected database.

**Example:**

```
database ✩ [databaseName] ✩ -> info

Response:
db_name:              foo
doc_count:            10
doc_del_count:        7
update_seq:           149
purge_seq:            0
compact_running:      false
disk_size:            618587
instance_start_time:  1363201782697759
disk_format_version:  5
committed_update_seq: 149

database ✩ [databaseName] ✩ ->
```

### tmpView [map] [params|reduce] [reduce]

**Description:** Retrieve a temporary view for given database.

**Example:**

```
database ✩ [databaseName] ✩ -> tmpView 'function(doc) {emit(doc._id, doc);}'
This databases exists of 10 document.
Displayed result has an offset of 0.


Response:
-
  id:    4be0aced2a9fba4d4514ceb56e007a04
  key:   4be0aced2a9fba4d4514ceb56e007a04
  value:
    _id:  4be0aced2a9fba4d4514ceb56e007a04
    _rev: 1-967a00dff5e02add41819138abb3284d
-
  id:    id1
  key:   key1
  value:
    _id:        id1
    _rev:       6-841ea3bec41a1ccbf776591dda80e1f9
    name:       foo
    
database ✩ [databaseName] ✩ ->    
```

```
database ✩ [databaseName] ✩ -> tmpView 'function(doc) {emit(doc._id, doc);}' limit=1
This databases exists of 10 documents.
Displayed result has an offset of 0.


Response:
-
  id:    4be0aced2a9fba4d4514ceb56e007a04
  key:   4be0aced2a9fba4d4514ceb56e007a04
  value:
    _id:  4be0aced2a9fba4d4514ceb56e007a04
    _rev: 1-967a00dff5e02add41819138abb3284d
    
database ✩ [databaseName] ✩ -> 
```

```
database ✩ [databaseName] ✩ -> tmpView 'function(doc) {emit(doc._id, doc);}' 'function(keys, values, rereduce){return sum()}'
This databases exists of undefined documents.
Displayed result has an offset of undefined.


Response:
-
  key:   null
  value: 0

database ✩ [databaseName] ✩ ->
```

```
database ✩ [databaseName] ✩ -> tmpView 'function(doc) {emit(doc._id, doc);}' limit=1 'function(keys, values, rereduce){return sum()}'
This databases exists of 10 documents.
Displayed result has an offset of 0.


Response:
-
  id:    4be0aced2a9fba4d4514ceb56e007a04
  key:   4be0aced2a9fba4d4514ceb56e007a04
  value:
    _id:  4be0aced2a9fba4d4514ceb56e007a04
    _rev: 1-967a00dff5e02add41819138abb3284d

database ✩ [databaseName] ✩ ->
```

### view [design] [view] [param1] [param2] ...

**Description:** Retrieve a particular view in design document for given database.

**Example:** 

```
database ✩ [databaseName] ✩ -> view entries all

This databases exists of 9 documents.

Displayed result has an offset of 0.

Response:
- id:    document1
  key:    foo1
  value:
    _id:        document1
    _rev:       6-841ea3bec41a1ccbf776591dda80e1f9
    bar:        baz
- id:    document2
  key:   foo2
  value:
    _id:        document1
    _rev:       6-841ea3bec41a1ccbf776591dda80e1f9
    bar:       baz
…
a lot of fancy information here
…
- id:    document5
  key:   foo5
  value:
    _id:        document1
    _rev:       6-841ea3bec41a1ccbf776591dda80e1f9
    bar:       baz
    
database ✩ [databaseName] ✩ ->
```

## Document Level Commands ( "document ✩ [documentName] ✩ ->" ):

### content [key] [value]

**Description:** Get or set document body content. Don't forget to save it with ```save``` command later on.

**! This command is supported by auto-completion for the document body key !**

**Examples:**

```
document ✩ [docId] ✩ -> content

Response:
_id:        docId
name:       someName
…
a lot of fancy information here
…
foo:        bar

document ✩ [docId] ✩ ->
```

```
document ✩ [docId] ✩ -> content name

Response:
someName

document ✩ [docId] ✩ ->
```

```
document ✩ [docId] ✩ -> content name newName

Property set.

document ✩ [docId] ✩ -> content

Response:
_id:        docId
name:       newName
…
a lot of fancy information here
…
foo:        bar

document ✩ [docId] ✩ ->
```

### info ###

**Description:** Get info about given document.

**Examples:**

```
document ✩ [docId] ✩ -> info

Response:
revision: 13-8da00c2e8d7b1a0ddc6db934e48b85a1
size:     448

document ✩ [docId] ✩ ->
```

### load ###

**Description:** Load body of particular document. Before that command your document will be empty.

**Example:**

```
document ✩ [docId] ✩ -> info

Response:
revision: 13-8da00c2e8d7b1a0ddc6db934e48b85a1
size:     448

document ✩ [docId] ✩ ->
```

### save ###

**Description:** Save body of particular document to CouchDB.

**Example:**

```
document ✩ [docId] ✩ -> save

Document saved.

document ✩ [docId] ✩ ->
```

## User Level Commands ( "user ✩ [userName] ✩ ->" ):

### addRole [role1] [role2] ...###

**Description:** Add one or more new roles to current user.

**Example:**

```
user ✩ foo ✩ -> addRole bar

Role(s) were successfully added.

user ✩ foo ✩ -> getRoles

User has the following roles:

Response:
- bar
```

```
user ✩ foo ✩ -> addRole bar1 bar2 bar3

Role(s) were successfully added.

user ✩ foo ✩ -> getRoles

User has the following roles:

Response:
- bar1
- bar2
- bar3

user ✩ foo ✩ ->
```

### create [password]###

**Description:** Create new user. **Password argument optional**. If empty password prompt, will be displayed afterwards.

**Example:**

```
connection ✩ [host] ✩ -> user foo

Switched to user foo

user ✩ foo ✩ -> create
What is the passwort for the user? fancyPassword

User was successfully created.

user ✩ foo ✩ ->
```

```
connection ✩ [host] ✩ -> user foo

Switched to user foo

user ✩ foo ✩ -> create fancyPassword

User was successfully created.

user ✩ foo ✩ ->
```

### delete ###

**Description:** Delete current user. Level will be switched to connection level afterwards.

**Example:**

```
user ✩ foo ✩ -> delete

User was succesfully deleted.

connection ✩ 127.0.0.1 ✩ ->
```

### deleteRole [role]###

**Description:** Delete a particular role of current user.

**! This command is supported by auto-completion for the wished role !**

**Example:**

```
user ✩ foo ✩ -> getRoles

User has the following roles:

Response:
- bar

user ✩ foo ✩ -> deleteRole bar

Role(s) were successfully deleted.

user ✩ foo ✩ -> getRoles

User has the following roles:

Response:
(empty array)

user ✩ foo ✩ ->
```

###getRoles###

**Description:** Get all roles of current user.

**Example:**

```
user ✩ foo ✩ -> getRoles

User has the following roles:

Response:
- bar
- bar2
- bar3

user ✩ foo ✩ ->
```
## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## Release History
0.2.8 - more tests, minor bug fixes, implementation of check mark for unsaved document changes


## License
Copyright (c) 2013 stefan judis  
Licensed under the MIT license.
