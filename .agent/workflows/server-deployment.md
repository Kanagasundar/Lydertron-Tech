---
description: Steps to deploy Lydertron Tech website to a server with custom domain
---

# Lydertron Tech - Server Deployment Guide

## Prerequisites Checklist
- [ ] Server access (SSH credentials or cPanel login)
- [ ] Domain name from client
- [ ] FTP/SFTP credentials (if using shared hosting)

---

## Option 1: VPS/Dedicated Server (Nginx)

### Step 1: Connect to Server
```bash
ssh username@server-ip
```

### Step 2: Install Nginx (if not installed)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y
```

### Step 3: Create Website Directory
```bash
sudo mkdir -p /var/www/lydertron
sudo chown -R $USER:$USER /var/www/lydertron
```

### Step 4: Upload Files
```bash
# From local machine
scp -r * username@server-ip:/var/www/lydertron/
```

### Step 5: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/lydertron
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/lydertron;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2|woff)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

### Step 6: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/lydertron /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Install SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## Option 2: Shared Hosting (cPanel)

### Step 1: Login to cPanel

### Step 2: Open File Manager
Navigate to `public_html` directory

### Step 3: Upload Files
- Upload all files from Lydertron folder
- Ensure index.html is in root of public_html

### Step 4: Point Domain
- Go to "Domains" or "Addon Domains"
- Configure the domain to point to public_html

### Step 5: Enable SSL
- Go to "SSL/TLS" or use "Let's Encrypt SSL" if available
- Install certificate for domain

---

## Option 3: Apache Server

### Nginx replacement config for Apache:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/lydertron

    <Directory /var/www/lydertron>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/css application/javascript
    </IfModule>
</VirtualHost>
```

---

## Domain DNS Configuration

When client provides domain, configure these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | SERVER_IP_ADDRESS | 3600 |
| A | www | SERVER_IP_ADDRESS | 3600 |
| CNAME | www | your-domain.com | 3600 |

---

## Files to Upload

```
Lydertron/
├── index.html
├── styles.css
├── script.js
├── .nojekyll (optional - GitHub specific)
└── img/
    ├── image1.png
    ├── image2.jpg
    ├── image3.jpg
    ├── image4.jpg
    ├── image5.jpg
    ├── image6.jpg
    ├── image7.jpeg
    ├── image8.jpg
    └── image10.jpg
```

---

## Post-Deployment Verification

- [ ] Website loads at http://your-domain.com
- [ ] Website loads at https://your-domain.com (SSL works)
- [ ] All images load correctly
- [ ] Mobile responsiveness works
- [ ] Contact form works
- [ ] Navigation links work
- [ ] Product carousel functions properly

---

## Quick Deploy Command (SCP)
```bash
# Run from Lydertron project folder
scp -r index.html styles.css script.js img/ username@server-ip:/var/www/lydertron/
```
