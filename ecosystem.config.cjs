module.exports = {
  apps: [
    {
      name: 'shbm-fe',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: '/home/vsterev/git/shbm/static/static_shbm_frontend_1',
        PM2_SERVE_PORT: 5173,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html',
      },
    },
  ],
  deploy: {
    production: {
      user: 'vsterev',
      host: '192.168.10.10',
      ref: 'origin/master',
      path: '/home/vsterev/git/shbm/pm2/shbm-frontend',
      repo: 'git@github.com:vsterev/shbm-fe.git',
      'post-deploy': `yarn \
		  && yarn build --outDir /home/vsterev/git/shbm/static/static_shbm_frontend_1 --mode production --emptyOutDir \
		  && pm2 startOrReload ecosystem.config.cjs --only shbm-fe`,
    },
  },
};
