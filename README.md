# Your are a command line hero. And you like CouchDB. Maybe cushion-cli is something for you.

### Command line tool for cushion CouchDB API. It is based on the node.js CouchDB-Api [Cushion](https://github.com/Zoddy/cushion).


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

**Example:**

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

#### [..]

**Description:** Switch to parent level.

If you are at document level you will switch to database level. Database and user level will switch to connection level. Command at connection level will do nothing.

**Example:**

```
database ✩ [databaseName] ✩ -> ..
connection ✩ [host] ✩ ->
```


## Connection Level Commands ( "connection ✩ [host] ✩ ->" )
…


## Database Level Commands ( "database ✩ [databaseName] ✩ ->" )
…


## Document Level Commands ( "document ✩ [documentName] ✩ ->" )
…

## User Level Commands ( "connection ✩ [host] ✩ ->" )

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 stefan judis  
Licensed under the MIT license.
