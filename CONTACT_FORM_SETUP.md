# Contact Forms Setup Instructions

Your website now has **TWO contact forms** integrated using **Web3Forms** - a completely FREE service with no signup required for basic features!

## The Two Forms

1. **Partnership Application Form** - Main form for wholesale/retail partners (at the bottom of the homepage)
2. **Customer Question Form** - Floating action button (FAB) in bottom-right corner for customer inquiries

Both forms send to **info.hasheesh@gmail.com** but with different subject lines so you can easily identify them.

## Setup Steps (5 minutes)

### Step 1: Get Your FREE Access Key

1. Go to https://web3forms.com
2. Click **"Get Started Free"** or **"Create Access Key"**
3. Enter your email: **info.hasheesh@gmail.com**
4. Click **"Create Access Key"**
5. Check your email (info.hasheesh@gmail.com) - you'll receive:
   - Your Access Key (looks like: `abcd1234-5678-90ef-ghij-klmnopqrstuv`)
   - Confirmation link (click it to activate)

### Step 2: Add Your Access Key to BOTH Forms

You need to add the same access key in **TWO places** in `index.html`:

#### Form 1: Partnership Application Form (around line 2521)
```html
<!-- BEFORE -->
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">

<!-- AFTER (example) -->
<input type="hidden" name="access_key" value="abcd1234-5678-90ef-ghij-klmnopqrstuv">
```

#### Form 2: Customer Question Form (around line 3737)
```html
<!-- BEFORE -->
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">

<!-- AFTER (example) -->
<input type="hidden" name="access_key" value="abcd1234-5678-90ef-ghij-klmnopqrstuv">
```

**Quick Find:** Search for `YOUR_ACCESS_KEY_HERE` in index.html - you should find it **TWO times**. Replace both!

### Step 3: Test Both Forms

#### Test the Partnership Form:
1. Open your website in a browser
2. Scroll to the "Work With Us" section at the bottom
3. Fill out the partnership application with test data
4. Click "Submit Application"
5. Check **info.hasheesh@gmail.com** for an email with subject: "New Partnership Application from HaSheesh Website"

#### Test the Customer Question Form:
1. Look for the floating message icon button in the bottom-right corner
2. Click it to open the question modal
3. Fill out your name, email, and question
4. Click "Send Message"
5. Check **info.hasheesh@gmail.com** for an email with subject: "New Customer Question from HaSheesh Website"

## Features Included

✅ **Completely Free** - No payment required, ever
✅ **Spam Protection** - Built-in honeypot and bot detection
✅ **Email Notifications** - All submissions sent to info.hasheesh@gmail.com
✅ **Success/Error Messages** - User-friendly feedback
✅ **Animations** - Smooth scroll animations that reverse
✅ **Mobile Responsive** - Works perfectly on all devices

## How It Works

### Partnership Application Form
When someone submits the partnership form:
1. Form data is sent to Web3Forms API
2. Web3Forms forwards it as an email to **info.hasheesh@gmail.com**
3. Applicant sees a success message
4. You receive the email with:
   - Store/Business name
   - Contact person name
   - Email address
   - Phone number
   - Store location
   - Business type
   - Daily sales volume
   - Years in business
   - Why they want to partner
   - Additional information

### Customer Question Form (FAB)
When someone clicks the floating button and submits a question:
1. Form data is sent to Web3Forms API
2. Web3Forms forwards it as an email to **info.hasheesh@gmail.com**
3. Customer sees a success message and modal closes automatically
4. You receive the email with:
   - Customer's name
   - Customer's email (so you can reply)
   - Their question

## Email Formats You'll Receive

### Partnership Application Email
```
Subject: New Partnership Application from HaSheesh Website

Store Name: Premium Smoke Shop
Contact Person: John Doe
Email: john@smokeshop.com
Phone: +1 (555) 123-4567
Store Location: Chicago, IL
Business Type: Smoke Shop
Daily Sales Volume: $1,000 - $2,500
Years in Business: 3 years

Why Partner with HaSheesh:
We've been serving the Chicago area for 3 years and our customers
are asking for premium hemp products. HaSheesh aligns with our
commitment to quality...

Additional Information:
We have 2 locations and are planning to open a third...
```

### Customer Question Email
```
Subject: New Customer Question from HaSheesh Website

Name: Jane Smith
Email: jane@example.com

Message:
What's the difference between THCA and regular THC?
```

## Troubleshooting

**Problem: Form says "error sending message"**
- Check that you replaced `YOUR_ACCESS_KEY_HERE` with your actual key in **BOTH forms**
- Make sure you clicked the confirmation link in your email
- Check your spam folder for the Web3Forms confirmation email

**Problem: Not receiving emails**
- Check spam/junk folder in info.hasheesh@gmail.com
- Verify the access key is correctly pasted in **BOTH forms** (no extra spaces)
- Make sure you clicked the email confirmation link from Web3Forms
- Test both forms separately to see which one is having issues

**Problem: Only one form works**
- Make sure you added the access key to **BOTH** forms
- Search for `YOUR_ACCESS_KEY_HERE` - if you find it anywhere, you missed that form

**Problem: Want to change the email address**
- Get a new access key for the new email at https://web3forms.com
- In index.html, find the two `<input type="hidden" name="email" value="info.hasheesh@gmail.com">` lines
- Replace `info.hasheesh@gmail.com` with your new email address in both forms

## Advanced Options (Optional)

### Add reCAPTCHA Protection
If you want extra spam protection, Web3Forms supports Google reCAPTCHA v3 for free. See: https://docs.web3forms.com/how-to-guides/js-frameworks/html-and-javascript

### Custom Redirect After Submission
Currently, users stay on the same page after submission. To redirect them:
- Change line 2391 from `value="false"` to `value="https://yourwebsite.com/thank-you"`

### Email Templates
You can customize the email format in your Web3Forms dashboard (requires free account creation)

## Support

- **Web3Forms Documentation**: https://docs.web3forms.com
- **Web3Forms Support**: support@web3forms.com
- **Free Tier Limits**: 250 submissions/month (more than enough for most sites)

## Cost

**100% FREE** for up to 250 submissions per month. If you ever need more, paid plans start at just $5/month for 1000 submissions.

---

That's it! Your contact form is ready to use. Just add your access key and you're good to go! 🚀
