# Gere certificados self-signed para desenvolvimento
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout dev.key -out dev.crt \
  -subj "/C=BR/ST=SP/L=Localhost/O=Dev/OU=Dev/CN=localhost"
