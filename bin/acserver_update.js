var exec = require('child_process').execSync;
var prompt = require('prompt');
var path = require('path');

// assumes this script is run from the project directory
var install_dir = path.resolve('lib/acserver');
var steamcmd_dir = path.resolve('lib/steamcmd');

if (process.env.CI) {
  return console.log("Detected CI environment: NOT using steamcmd. Continuing.\n");
}

console.log("Updating Assetto Corsa Dedicated Server via steamcmd...\n");
console.log("NOTE! You will be prompted for a steam gaurd code if this first time running this command.");
console.log("NOTE! The Steam Guard code will be sent to the email you registered your steam account with.\n");

prompt.get({
  properties: {
    uname: {
      type: 'string',
      required: true,
      description: 'Your Steam username'
    },
    pass: {
      type: 'string',
      description: 'Your Steam password (will not be shown)',
      required: true,
      hidden: true
    }
  }
}, (err, result) => {
  if (err) {
    console.log('Error!');
    throw err;
  }

  var cmd = `${path.join(steamcmd_dir, 'steamcmd.sh')} +login ${result.uname} ${result.pass} +force_install_dir ${install_dir} +@sSteamCmdForcePlatformType windows +app_update 302550 validate +quit`;
  var cmd_sanitized = cmd.replace(result.pass, '****');
  install_steam(cmd, cmd_sanitized, result.pass);
});

function install_steam (cmd, cmd_sanitized, password) {
  cmd_sanitized = cmd_sanitized || cmd;
  console.log(`Running: ${cmd_sanitized}`);

  try {
    exec(cmd, {stdio: 'inherit'});
  } catch (e) {
    console.log(`\n${e.message.replace(password, '****')}`);
    process.exit(1);
  }

  console.log('Finished updating Assetto Corsa Dedicated Server\n');
}