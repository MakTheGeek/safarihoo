# Safarihoo CMS Security Specification

## 1. Operational Model
- **Mode requested**: No authentication (`sans auth`) for immediate CMS and file repository management via the Safarihoo Admin Panel.
- **Public + Admin Data Scope**: Only public website copy, curated attractions, published links, and public/admin-managed media assets are stored. No user PII (emails, phone numbers of users, passwords, payment data) is stored in Firestore.
- **Warning**: Because unauthenticated writes are enabled per the user's "sans auth" requirement, strict structural validation, strict key whitelisting (`hasAll` + `hasOnly`), size caps (< 750 KB per document payload), immutable `createdAt`, and server-enforced timestamps (`request.time`) are enforced on every write. Users should enable Firebase Auth before broad public production deployment if multi-user/untrusted access is exposed.

## 2. Data Invariants
1. Every document ID across `site_content`, `site_files`, `site_links`, `site_attractions`, `site_destinations`, and `site_reviews` MUST match `^[a-zA-Z0-9_-]+$` and be <= 128 characters.
2. Every document write MUST contain exact blueprint fields only — no shadow/ghost fields (`keys().hasOnly(...)`).
3. Every `string` field has explicit `.size()` min/max bounds matching `firebase-blueprint.json`.
4. `site_files.dataUrl` is capped at `750000` chars (~750 KB) to guarantee documents never breach Firestore's 1 MB document limit. `sizeBytes` must be an integer between `0` and `50000000`.
5. `site_files.storageMode` MUST be `'inline'` or `'external'`; when `'inline'`, `dataUrl` must be non-empty; when `'external'`, `externalUrl` must be non-empty.
6. `site_links.url` must start with `https://`, `http://`, `/`, or `#` (blocks `javascript:` XSS URI injection).
7. `site_attractions.highlights` and `highlightsFr` arrays are strictly capped at `<= 8` entries; `site_destinations.categories` is capped at 1..4 valid categories and `thumbnails` at 1..6 validated URLs/thumbnails; `site_reviews.rating` is integer 1..5.
8. `createdAt == request.time` on create; `createdAt` is immutable on update; `updatedAt == request.time` on create and update.
9. `site_settings` only permits single document ID `admin_lock` (`allow list: if false`, `allow delete: if false`), requiring `passwordHash` to be empty when `enabled == false` or a valid `saltHex(32):scryptHex(128)` hash when `enabled == true`.

## 3. The "Dirty Dozen" Payloads (Expected `PERMISSION_DENIED`)
1. Ghost field injection on `site_content` (`{ ..., isAdmin: true }`).
2. Oversized `dataUrl` (> 750,000 chars) on `site_files` (Denial of Wallet / 1MB crash).
3. Invalid `storageMode` (`"ftp"`) on `site_files`.
4. Empty `dataUrl` when `storageMode == "inline"` on `site_files`.
5. XSS URI injection `javascript:alert(1)` in `site_links.url`.
6. Wrong type for `order` (`"first"` instead of integer) on `site_links`.
7. Spoofed `createdAt` timestamp (client Date instead of `request.time`) on create.
8. Mutating `createdAt` during an `update` on `site_content`.
9. Unbounded `highlights` array (> 8 elements) on `site_attractions`.
10. Non-string element `[123]` inside `highlights` on `site_attractions`.
11. Poisoned document ID (`"../../etc/passwd"` or 200-char ID) on `setDoc`.
12. Negative `price` (`-50`) on `site_attractions`.
13. Arbitrary docId (`other_setting`), invalid `passwordHash` format, `list`, or `delete` on `site_settings`.
