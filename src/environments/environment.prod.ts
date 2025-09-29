export const environment = {
  production: true,
  app_version: 104,
  cache: true,
  client_id: "MativaApp",
  client_password: "MativaAppPristup",
  rest_server: {
    protokol: 'https://',
    host: 'mativagroup.versalink-api.com', // dev server mativa company: 4
    functions: {
        api: '/api/',
        token: '/token.php'
    },
    multimedia: '/Assets/multimedia'
  },
  google_map_api: 'AIzaSyBT0jYZNte-NOsAICVMEOtmRYJamX0hVuM',
  cache_key: 'cache-key-',
  def_image: 'assets/imgs/no-image-icon-23485.png',
  company_id: 17,
  show_id: true,
  version: '10122024',
  db_version: '1.2.8',
};
