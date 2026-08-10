# Google Site Verification — "not verifying" plan

## Current state (verified this turn)
- The tag `<meta name="google-site-verification" content="fx_YSO4ay6DYtR0kkUi4vL7PGjeGkrBBe2vFRaw3GvQ"/>` is present in `src/routes/index.tsx` head.
- It is being served in the **live published HTML** at `https://xcopper1122334455.lovable.app/` (HTTP 200, no login wall).
- No code change is required to add or fix the tag — it is correct and reachable.

## Why verification can still fail (in order of likelihood)
1. **Google hasn't re-crawled yet.** Verification re-fetches the page on Google's schedule and can take minutes to a few hours. The tag may be live now but Google is still reading an older version.
2. **Wrong property/URL.** The property added in Search Console must be a **URL-prefix** property for exactly `https://xcopper1122334455.lovable.app/` (meta-tag verification works only for URL-prefix, not domain properties).
3. **Verify wasn't re-clicked after the tag went live.** The tag was added to the code after the initial verify attempt.

## Steps to get verified
1. Confirm the property in Google Search Console is the **URL-prefix** `https://xcopper1122334455.lovable.app/` (type SITE). If a domain property (`sc-domain:`) was created, create a URL-prefix one instead — the meta tag cannot verify a domain property.
2. Open the exact URL in an incognito browser to confirm the tag is visible: View Page Source → search for `google-site-verification`.
3. Click **Verify** again in Search Console. If it says the tag wasn't found, wait 15–60 minutes (Google caches fetched HTML) and click Verify again — do not change the code.
4. Do not re-publish the app for this; the tag is already live.

## Optional (if you want Lovable to manage Search Console)
- Link a Google Search Console connection to this project so I can monitor indexing/sitemap state directly from here.

## Out of scope / not done
- No source edits — the tag is already correctly deployed. Changing code would not help and could break the currently-working tag.
