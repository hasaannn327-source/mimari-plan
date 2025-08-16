#!/bin/bash

# Mimari Kat Planı Öneri Sistemi - Deploy Script
# Bu script uygulamayı kolayca deploy etmenizi sağlar

echo "🏗️  Mimari Kat Planı Öneri Sistemi - Deploy Script"
echo "=================================================="

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Deploy seçenekleri
echo -e "${BLUE}Deploy seçeneklerini seçin:${NC}"
echo "1) Local Development (localhost)"
echo "2) Static Hosting (GitHub Pages, Netlify, Vercel)"
echo "3) Docker Container"
echo "4) Production Server (Nginx/Apache)"
echo "5) Cloud Platform (AWS, GCP, Azure)"

read -p "Seçiminizi yapın (1-5): " choice

case $choice in
    1)
        echo -e "${GREEN}Local Development başlatılıyor...${NC}"
        deploy_local
        ;;
    2)
        echo -e "${GREEN}Static Hosting için hazırlanıyor...${NC}"
        deploy_static
        ;;
    3)
        echo -e "${GREEN}Docker Container oluşturuluyor...${NC}"
        deploy_docker
        ;;
    4)
        echo -e "${GREEN}Production Server için hazırlanıyor...${NC}"
        deploy_production
        ;;
    5)
        echo -e "${GREEN}Cloud Platform için hazırlanıyor...${NC}"
        deploy_cloud
        ;;
    *)
        echo -e "${RED}Geçersiz seçim!${NC}"
        exit 1
        ;;
esac

# Local Development
deploy_local() {
    echo -e "${YELLOW}Local development başlatılıyor...${NC}"
    
    # Backend bağımlılıklarını kontrol et
    if [ ! -d "backend/node_modules" ]; then
        echo "Backend bağımlılıkları yükleniyor..."
        cd backend
        npm install
        cd ..
    fi
    
    # Plan görsellerini oluştur
    echo "Plan görselleri oluşturuluyor..."
    cd backend
    npm run generate-plans
    cd ..
    
    # Backend sunucusunu başlat
    echo -e "${GREEN}Backend sunucusu başlatılıyor...${NC}"
    echo "Backend: http://localhost:3000"
    echo "Frontend: http://localhost:8080"
    echo ""
    echo "Terminal 1'de backend'i çalıştırın:"
    echo "cd backend && npm start"
    echo ""
    echo "Terminal 2'de frontend'i çalıştırın:"
    echo "cd frontend && python -m http.server 8080"
    echo "veya"
    echo "cd frontend && npx serve ."
}

# Static Hosting
deploy_static() {
    echo -e "${YELLOW}Static hosting için hazırlanıyor...${NC}"
    
    # Build klasörü oluştur
    BUILD_DIR="dist"
    rm -rf $BUILD_DIR
    mkdir -p $BUILD_DIR
    
    # Frontend dosyalarını kopyala
    echo "Frontend dosyaları kopyalanıyor..."
    cp -r frontend/* $BUILD_DIR/
    
    # Backend plan verilerini frontend'e kopyala
    echo "Plan verileri kopyalanıyor..."
    mkdir -p $BUILD_DIR/data
    cp backend/planData.json $BUILD_DIR/data/
    
    # Plans klasörünü kopyala
    if [ -d "backend/plans" ]; then
        cp -r backend/plans $BUILD_DIR/
    fi
    
    # Service Worker'ı güncelle (relative path'ler için)
    sed -i 's|/api/|./api/|g' $BUILD_DIR/sw.js
    sed -i 's|/icons/|./icons/|g' $BUILD_DIR/sw.js
    sed -i 's|/plans/|./plans/|g' $BUILD_DIR/sw.js
    
    # README oluştur
    cat > $BUILD_DIR/README.md << EOF
# Mimari Kat Planı Öneri Sistemi - Static Build

Bu klasör static hosting platformları için hazırlanmıştır.

## Deploy Seçenekleri:

### GitHub Pages
1. Bu klasörü GitHub repository'nize push edin
2. Settings > Pages > Source: Deploy from a branch
3. Branch: main, folder: / (root)

### Netlify
1. Bu klasörü GitHub'a push edin
2. Netlify'da "New site from Git" seçin
3. Repository'yi seçin ve deploy edin

### Vercel
1. Bu klasörü GitHub'a push edin
2. Vercel'de "New Project" seçin
3. Repository'yi import edin ve deploy edin

### Manual Upload
1. Bu klasördeki tüm dosyaları hosting sunucunuza yükleyin
2. HTTPS kullanın (PWA için gerekli)

## Notlar:
- PWA özellikleri için HTTPS gerekli
- Service Worker offline çalışma sağlar
- Tüm veriler tarayıcı cache'inde saklanır
EOF
    
    echo -e "${GREEN}Static build tamamlandı!${NC}"
    echo "Build klasörü: $BUILD_DIR"
    echo ""
    echo "Deploy için:"
    echo "1. GitHub Pages: $BUILD_DIR klasörünü repository'ye push edin"
    echo "2. Netlify: $BUILD_DIR klasörünü sürükleyip bırakın"
    echo "3. Vercel: $BUILD_DIR klasörünü import edin"
    echo "4. Manual: $BUILD_DIR içeriğini hosting sunucunuza yükleyin"
}

# Docker Container
deploy_docker() {
    echo -e "${YELLOW}Docker container oluşturuluyor...${NC}"
    
    # Dockerfile oluştur
    cat > Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

# Backend bağımlılıkları
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Backend kodları
COPY backend/ ./backend/

# Frontend dosyaları
COPY frontend/ ./frontend/

# Plan verileri
COPY backend/planData.json ./frontend/data/
COPY backend/plans/ ./frontend/plans/

# Port aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "backend/server.js"]
EOF
    
    # .dockerignore oluştur
    cat > .dockerignore << EOF
node_modules
npm-debug.log
.git
.gitignore
README.md
deploy.sh
Dockerfile
.dockerignore
EOF
    
    # Docker build
    echo "Docker image oluşturuluyor..."
    docker build -t kat-plani-app .
    
    echo -e "${GREEN}Docker container hazır!${NC}"
    echo ""
    echo "Container'ı çalıştırmak için:"
    echo "docker run -p 3000:3000 kat-plani-app"
    echo ""
    echo "Docker Compose ile çalıştırmak için docker-compose.yml oluşturun:"
    cat > docker-compose.yml << EOF
version: '3.8'
services:
  kat-plani-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
EOF
    
    echo "Docker Compose ile çalıştırmak için:"
    echo "docker-compose up -d"
}

# Production Server
deploy_production() {
    echo -e "${YELLOW}Production server için hazırlanıyor...${NC}"
    
    # Nginx config oluştur
    cat > nginx.conf << EOF
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    root /var/www/kat-plani;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # PWA support
    location = /sw.js {
        add_header Cache-Control "no-cache";
    }
    
    location = /manifest.json {
        add_header Cache-Control "no-cache";
    }
    
    # Fallback for SPA
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
    
    # Systemd service oluştur
    cat > kat-plani.service << EOF
[Unit]
Description=Kat Plani API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/kat-plani
ExecStart=/usr/bin/node backend/server.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF
    
    # Deploy script oluştur
    cat > deploy-production.sh << 'EOF'
#!/bin/bash

# Production deploy script
echo "Production server'a deploy ediliyor..."

# Uygulamayı durdur
sudo systemctl stop kat-plani

# Yeni dosyaları kopyala
sudo cp -r frontend/* /var/www/kat-plani/
sudo cp -r backend/ /var/www/kat-plani/
sudo cp backend/planData.json /var/www/kat-plani/frontend/data/
sudo cp -r backend/plans/ /var/www/kat-plani/frontend/

# Bağımlılıkları yükle
cd /var/www/kat-plani/backend
sudo npm ci --only=production

# Service'i yeniden başlat
sudo systemctl start kat-plani
sudo systemctl enable kat-plani

# Nginx'i yeniden yükle
sudo nginx -t && sudo systemctl reload nginx

echo "Deploy tamamlandı!"
EOF
    
    chmod +x deploy-production.sh
    
    echo -e "${GREEN}Production server dosyaları hazır!${NC}"
    echo ""
    echo "Dosyalar:"
    echo "- nginx.conf: Nginx konfigürasyonu"
    echo "- kat-plani.service: Systemd service"
    echo "- deploy-production.sh: Deploy script"
    echo ""
    echo "Kurulum adımları:"
    echo "1. nginx.conf'u /etc/nginx/sites-available/ klasörüne kopyalayın"
    echo "2. SSL sertifikalarınızı yapılandırın"
    echo "3. kat-plani.service'i /etc/systemd/system/ klasörüne kopyalayın"
    echo "4. deploy-production.sh script'ini çalıştırın"
}

# Cloud Platform
deploy_cloud() {
    echo -e "${YELLOW}Cloud platform için hazırlanıyor...${NC}"
    
    # AWS CloudFormation template
    cat > cloudformation.yml << EOF
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Kat Plani App Infrastructure'

Parameters:
  DomainName:
    Type: String
    Description: Domain name for the application
  
Resources:
  # S3 Bucket for static files
  StaticBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '\${DomainName}-static'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html
  
  # CloudFront Distribution
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt StaticBucket.RegionalDomainName
            Id: S3Origin
            S3OriginConfig:
              OriginAccessIdentity: !Ref CloudFrontOAI
        Enabled: true
        DefaultRootObject: index.html
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          Compress: true
          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6 # CachingOptimized
        CustomErrorResponses:
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: /index.html
  
  # CloudFront Origin Access Identity
  CloudFrontOAI:
    Type: AWS::CloudFront::CloudFrontOriginAccessIdentity
    Properties:
      CloudFrontOriginAccessIdentityConfig:
        Comment: !Sub 'OAI for \${DomainName}'
  
  # S3 Bucket Policy
  StaticBucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref StaticBucket
      PolicyDocument:
        Statement:
          - Effect: Allow
            Principal:
              AWS: !Sub 'arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity \${CloudFrontOAI}'
            Action: s3:GetObject
            Resource: !Sub '\${StaticBucket}/*'
  
  # Lambda@Edge for PWA headers
  PWAHeadersFunction:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: !Sub '\${DomainName}-pwa-headers'
      Runtime: nodejs18.x
      Handler: index.handler
      Role: !GetAtt LambdaExecutionRole.Arn
      Code:
        ZipFile: |
          exports.handler = async (event) => {
            const response = event.Records[0].cf.response;
            const headers = response.headers;
            
            // Add PWA headers
            headers['service-worker-allowed'] = [{value: '/'}];
            headers['x-frame-options'] = [{value: 'DENY'}];
            headers['x-content-type-options'] = [{value: 'nosniff'}];
            
            return response;
          };
      Timeout: 5
  
  # Lambda Execution Role
  LambdaExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

Outputs:
  WebsiteURL:
    Description: 'Website URL'
    Value: !GetAtt StaticBucket.WebsiteURL
  
  CloudFrontURL:
    Description: 'CloudFront Distribution URL'
    Value: !GetAtt CloudFrontDistribution.DomainName
EOF
    
    # Terraform configuration
    cat > main.tf << EOF
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 Bucket for static hosting
resource "aws_s3_bucket" "static_website" {
  bucket = var.domain_name
  
  tags = {
    Name = "Kat Plani Static Website"
  }
}

# S3 Bucket Website Configuration
resource "aws_s3_bucket_website_configuration" "static_website" {
  bucket = aws_s3_bucket.static_website.id
  
  index_document {
    suffix = "index.html"
  }
  
  error_document {
    key = "index.html"
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "static_website" {
  bucket = aws_s3_bucket.static_website.id
  
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 Bucket Policy
resource "aws_s3_bucket_policy" "static_website" {
  bucket = aws_s3_bucket.static_website.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "\${aws_s3_bucket.static_website.arn}/*"
      },
    ]
  })
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "static_website" {
  origin {
    domain_name = aws_s3_bucket.static_website.bucket_regional_domain_name
    origin_id   = "S3Origin"
  }
  
  enabled             = true
  is_ipv6_enabled    = true
  default_root_object = "index.html"
  
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  
  # Cache behavior for PWA files
  ordered_cache_behavior {
    path_pattern     = "/sw.js"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }
  
  # Error pages
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  
  tags = {
    Name = "Kat Plani CloudFront"
  }
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}

# Outputs
output "website_endpoint" {
  value = aws_s3_bucket.static_website.website_endpoint
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.static_website.domain_name
}
EOF
    
    # Variables file
    cat > variables.tf << EOF
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}
EOF
    
    # Terraform variables example
    cat > terraform.tfvars.example << EOF
aws_region  = "us-east-1"
domain_name = "your-domain.com"
EOF
    
    echo -e "${GREEN}Cloud platform dosyaları hazır!${NC}"
    echo ""
    echo "Dosyalar:"
    echo "- cloudformation.yml: AWS CloudFormation template"
    echo "- main.tf: Terraform configuration"
    echo "- variables.tf: Terraform variables"
    echo "- terraform.tfvars.example: Terraform variables example"
    echo ""
    echo "AWS CloudFormation ile deploy:"
    echo "1. AWS Console'da CloudFormation > Create Stack"
    echo "2. cloudformation.yml dosyasını yükleyin"
    echo "3. Domain name parametresini girin"
    echo ""
    echo "Terraform ile deploy:"
    echo "1. terraform.tfvars dosyasını oluşturun"
    echo "2. terraform init && terraform plan && terraform apply"
}

echo ""
echo -e "${GREEN}Deploy tamamlandı!${NC}"
echo "Uygulamanızı başarıyla deploy ettiniz."
echo ""
echo "Önemli Notlar:"
echo "- PWA özellikleri için HTTPS gerekli"
echo "- Service Worker offline çalışma sağlar"
echo "- Tüm veriler tarayıcı cache'inde saklanır"
echo "- Backend API'si olmadan da çalışır (offline mode)"