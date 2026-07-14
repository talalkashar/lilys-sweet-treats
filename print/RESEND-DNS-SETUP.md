# Resend domain DNS (Namecheap) — lilyssweettreatsva.com

Add these under **Advanced DNS → Host Records**. Do NOT delete existing Vercel A/CNAME for @ and www.

## 1. DKIM (TXT)
| Type | Host | Value |
|------|------|--------|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCaT0G7wS+DLF9wT7S1+gbjq/6Wzsh6dASa1SVo/FksiLcD2SEXmqNCsyBt3vdcTYtMoc8v3iJJo0p19cViKwg7LYKewzTI5dBqI5jTITeEbLkWCZnFEiltoDqdmdPbnnPQhd7HAIWA59OJk0Uua0rEl+3z6JUVEz1CSAX+C1SGrwIDAQAB` |

## 2. MX for send subdomain
| Type | Host | Value | Priority |
|------|------|--------|----------|
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | `10` |

## 3. SPF for send subdomain (TXT)
| Type | Host | Value |
|------|------|--------|
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |

TTL: Automatic

After saving, wait 5–30 minutes, then verify domain in Resend and set Vercel:
EMAIL_FROM=Lily's Sweet Treats <orders@lilyssweettreatsva.com>
