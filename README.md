# OFFLINE NETWORK

## SETUP IDE

* install node


## SETUP ROUTER

### install openwrt

* Connect to the TL-MR3020 router via Ethernet cable at IP address 192.168.0.254, log in to the router's web GUI (default login/password: admin / admin) and overwrite the factory firmware by installing the openwrt-ar71xx-generic-tl-mr3020-v1-squashfs-factory.bin firmware image like a regular firmware update.
* install config backup file by loggin int to router -> System -> Backup ... -> Upload Config -> `offline_network_router_config.tar.gz`

### disable internet and redirect all trafic to rasp pi

* go to network -> wifi -> "the wan wifi" -> disable
* login by ssh : `ssh root@192.168.72.1`
  * uncomment line in */etc/dnsmasq.conf*: `address=/#/192.168.72.2`

### change static lease to rasp pi

* go to network -> dhcp -> static leases: reserve 192.168.72.2 for rasp pi

## SETUP RASPPI

### install image

* either install offline_network_arch_img.zip on raspberry pi
* or install archlinux img from here: <http://sourceforge.net/projects/archlinux-rpi2/?source=typ_redirect>

### (configure system)

#### Update System and install sudo

* pacman -Syu
* pacman -S sudo

#### add pi user

* create new user: `useradd -m pi`
* passwd pi: 
* "EDITOR=nano visudo" -> add line `pi ALL=(ALL) ALL`

#### install nginx and node

* pacman -S nginx node
  * edit /etc/nginx.conf:

      ```
      server {
          listen 443;
          server_name localhost;
          rewrite ^(.*) http://192.168.72.2/start permanent;
      }

      server {
          listen 80;

          server_name  localhost on.app;
          root   /home/pi/offlineNetwork/www;

          client_max_body_size 30M;

          #access_log  logs/host.access.log  main;
          
          # apple captive test1
          location /hotspot-detect.html {
              rewrite ^ http://on.lan/start/apple/success.html;
          }

          # apple captive test2
          location /library/test/success.html {
              rewrite ^ http://on.lan/start/apple/success.html;
          }

          location / {
              if ($host = 'on.lan') {
                  rewrite ^ http://on.lan/app/ last;
              }
              rewrite ^ http://on.lan/start/ permanent;
          }

    	  # /app/ goes to node server
          location /app {
              proxy_pass http://192.168.72.2:8080;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;        
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
          }

          # show splash page
          location /start {
                  index index.html;
          }

          error_page   500 502 503 504  /50x.html;
          location = /50x.html {
              root   /usr/share/nginx/html;
          }
      }
      ```
* `sudo systemctl start nginx.service` and sudo `systemctl enable nginx.service`

* pacman -S nodejs npm

#### setup node.js process managaer

* install: `npm install pm2 -g`
* add app to process manager: `pm2 start app.js`
* make sure you start pm2 processes logged in with user pi
* list processes: `pm2 list` and save config with `pm2 save`
* create sytemd startup script, login as su: `pm2 startup systemd -u pi`
* `systemctl daemon-reload; systemctl enable pm2; systemctl start pm2`

### resize partition

Start fdisk:

* sudo fdisk /dev/mmcblk0
* Then delete partitions with d and create a new with n. You can view the existing table with p.

* p to see the current start of the main partition
* d, 3 to delete the swap partition
* d, 2 to delete the main partition
* n p 2 to create a new primary partition, next you need to enter the start of the old main partition and then the size (enter for complete SD card). The main partition on the Debian image from 2012-04-19 starts at 157696, but the start of your partition might be different. Check the p output!
* w write the new partition table

Now you need to reboot:

* sudo shutdown -r now
* after reboot: sudo resize2fs /dev/mmcblk0p2


## Troubleshooting

* If captive portal page keep on popping up on projection mac:
  * rename `/System/Library/CoreServices/Captive Network Assistant.app`into `/System/Library/CoreServices/No More Captive Network Assistant.app`

  ​