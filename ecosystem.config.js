module.exports = {
    apps: [
      {
        name: 'www.singingbowlvillagenepal.com',
        script: 'npm',
        exec_mode: "fork",  // Enables clustering
        instances: "1", // Change to "max" to use all available cores        
        args: 'run start',
        watch: false, // Set to true if you want to watch file changes
        max_memory_restart: "512M",
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
