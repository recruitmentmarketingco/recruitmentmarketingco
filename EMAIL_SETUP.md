# Email Setup Documentation

## Overview
This website uses PHP with PHPMailer library to send form submissions via SMTP (Gmail).

## SMTP Configuration

### Current Settings
- **SMTP Server**: smtp.gmail.com
- **Port**: 587 (TLS)
- **Email**: recruitmentmarketingco@gmail.com
- **Password**: oG46=VXgBy*

### Files Involved

1. **send-email.php** - Main email processing script
   - Located in root directory
   - Handles all form types (recruitment plan, quote requests, PPC audit)
   - Uses PHPMailer library for SMTP
   - Returns JSON responses for AJAX handling

2. **assets/js/forms.js** - Frontend form handler
   - AJAX form submission
   - Loading states and user feedback
   - Popup management
   - Error handling

3. **phpmailer/** - PHPMailer library
   - PHPMailer.php - Main mailer class
   - SMTP.php - SMTP protocol handler
   - Exception.php - Exception handling

## Form Types

### 1. Recruitment Plan Request (Homepage)
**Form ID**: `recruitmentPlanForm`
**Fields**:
- Name (text, required)
- Company Name (text, required)
- Openings Available (select, required)
- Email (email, required)

**Function**: `submitForm(e)`

### 2. SEO Quote Request (SEO Page)
**Form ID**: `quoteForm`
**Fields**:
- Name (text, required)
- Company Name (text, required)
- Website (url, required)
- Current Ad Spend (select, required)

**Function**: `submitQuoteForm(e)`

### 3. PPC Audit Request (PPC Page)
**Form ID**: `ppcAuditForm`
**Fields**:
- Name (text, required)
- Company Name (text, required)
- Website (url, required)

**Function**: `submitPPCAuditForm(e)`

## Server Requirements

### PHP Requirements
- PHP 7.4 or higher
- Required PHP extensions:
  - `openssl` - for TLS/SSL connections
  - `sockets` - for SMTP connections
  - `mbstring` - for character encoding

### Hosting Compatibility
Works with any hosting that supports:
- PHP
- Outgoing SMTP connections on port 587
- File uploads (for PHPMailer library)

### Tested Platforms
- ✅ Apache with mod_php
- ✅ Nginx with PHP-FPM
- ✅ cPanel/WHM hosting
- ✅ Cloud hosting (AWS, DigitalOcean, etc.)

## Security Considerations

### Current Implementation
⚠️ **WARNING**: The SMTP password is currently stored in plain text in `send-email.php`

### Recommended Improvements

1. **Use Environment Variables**
   ```php
   $mail->Username = getenv('SMTP_USERNAME');
   $mail->Password = getenv('SMTP_PASSWORD');
   ```

2. **Create .env file** (not tracked in git)
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=recruitmentmarketingco@gmail.com
   SMTP_PASSWORD=oG46=VXgBy*
   ```

3. **Add to .gitignore**
   ```
   .env
   send-email.php
   ```

4. **Use Gmail App Password**
   - Instead of main account password
   - More secure and can be revoked
   - Generate at: https://myaccount.google.com/apppasswords

5. **Add Rate Limiting**
   - Prevent form spam/abuse
   - Implement CAPTCHA (reCAPTCHA)
   - Add honeypot fields

## Troubleshooting

### Email Not Sending

1. **Check PHP error log**
   ```bash
   tail -f /var/log/php_errors.log
   ```

2. **Test SMTP connection**
   ```php
   $mail->SMTPDebug = 2; // Enable verbose debug output
   ```

3. **Common Issues**:
   - Port 587 blocked by firewall
   - Gmail "Less secure apps" settings
   - Incorrect credentials
   - PHP mail() function disabled

### Gmail Specific Issues

1. **"Less secure app" blocked**
   - Use App Password instead
   - Enable 2FA on Gmail account
   - Generate App Password

2. **Daily send limits**
   - Gmail free: 500 emails/day
   - Google Workspace: 2000 emails/day

3. **Suspicious activity**
   - Gmail may temporarily block sending
   - Verify account at: https://accounts.google.com/DisplayUnlockCaptcha

## Testing

### Local Testing (PHP Built-in Server)
```bash
cd /home/user/webapp
php -S localhost:8080
```

Visit: http://localhost:8080

### Test Form Submission
1. Open browser developer console (F12)
2. Fill out any form
3. Submit and check:
   - Network tab for AJAX request
   - Console for any JavaScript errors
   - Email inbox for received message

### cURL Testing
```bash
curl -X POST http://localhost:8080/send-email.php \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "form_type=recruitment_plan&name=Test&company=TestCo&openings=1-5&email=test@example.com"
```

## Monitoring

### Email Delivery
- Check Gmail "Sent" folder
- Monitor bounce rates
- Track form submission analytics

### Error Logging
Enable error logging in `send-email.php`:
```php
error_log('Email Error: ' . $e->getMessage(), 3, 'email_errors.log');
```

## Alternative SMTP Providers

If Gmail issues occur, consider:

1. **SendGrid** (free: 100 emails/day)
   ```php
   $mail->Host = 'smtp.sendgrid.net';
   $mail->Port = 587;
   ```

2. **Mailgun** (free: 5000 emails/month)
   ```php
   $mail->Host = 'smtp.mailgun.org';
   $mail->Port = 587;
   ```

3. **Amazon SES** (very cheap, reliable)
   ```php
   $mail->Host = 'email-smtp.region.amazonaws.com';
   $mail->Port = 587;
   ```

## Updating Credentials

To change SMTP credentials, edit `send-email.php` lines 111-115:

```php
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'your-email@gmail.com';
$mail->Password = 'your-password-here';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;
```

## Support

For issues or questions:
- Check PHPMailer documentation: https://github.com/PHPMailer/PHPMailer
- Review PHP error logs
- Test SMTP connectivity with telnet: `telnet smtp.gmail.com 587`
