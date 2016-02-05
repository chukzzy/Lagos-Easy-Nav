We will be using MariaDb (SQL Based) for our backend server.

You can read the documentation and how to get started [here](https://mariadb.com/kb/en/mariadb/getting-started/)

The minimum requirements are to have a mariadb/mysql server on your local
machine, and a root user on the server.

##### Try some of these links for installation instructions for your OS
[Mac](https://mariadb.com/kb/en/mariadb/building-mariadb-on-mac-os-x-using-homebrew/)
[Ubuntu](https://downloads.mariadb.org/mariadb/repositories/#mirror=osuosl&distro=Ubuntu&version=10.0&distro_release=trusty)
[Windoze](https://www.youtube.com/watch?v=yQPnCxJMOWI)

### Note:
If you get npm error logs when you run `npm install`, try running
`npm install` again with `--python=python2` flag.

Navigate to create-database directory, run `npm install` and
`node create-database.js`.
This should run a script to create a database for tide and a user that
has permission to access it.

Once the database and user are created, then every other script should be
able to create tables in the database with our default user.

Navigate to any other directory here containing scripts that migrate
what you might need. Run `npm install` and `node script-to-run.js`.
Wait for the script to finish.

Make sure you run the scripts in locations directory first before
events because events need places of course.

#### This script does not drop any table or database.
#### You need to manually drop any conflicting table or
#### database on your machine.
#### This is a precaution to prevent the scripts from wiping
#### existing data, whether intentionally or mistakenly.