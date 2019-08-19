FROM nginx:1.16
MAINTAINER wishgood@gmail.com
COPY build /opt/geojson-editor/dist
COPY nginx.conf /etc/nginx/nginx.conf