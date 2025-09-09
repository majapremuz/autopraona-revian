export const environment = {
  production: true,
  cache: true,
  client_id: "AutopraonicaRevian",
  client_password: "AutopraonicaRevianPristup",
  rest_server: {
    protokol: 'https://',
    host: 'autopraonica-revian.app',
    functions: {
        api: '/rest_v2/api.php',
        token: '/rest_v2/token.php'
        // api: '/rest_v2/api.php',
        // token: '/rest_v2/token.php'
    },
    multimedia: '/Assets/multimedia'
  },
  google_map_api: 'AIzaSyBT0jYZNte-NOsAICVMEOtmRYJamX0hVuM',
  cache_key: 'cache-key-',
  car_key: 'car-key-',
  company: 1,
  company_id: 5,
};
