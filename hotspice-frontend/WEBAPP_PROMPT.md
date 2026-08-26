# Build Prompt: Hot & Spice — Web App

Copy everything below this line into a fresh Claude Code session (in a new/empty repo for the web app) to build the web version of the Hot & Spice food ordering platform.

---

## Context

I have an existing **React Native (Expo Router) mobile app** called **Hot & Spice** — a food ordering app for a Pakistani fast-food brand (burgers, chicken, combos, beverages, desserts) based in Lahore, Pakistan. I need you to build a **web app** that replicates all of its functionality and talks to the **same existing Laravel REST API backend**. You are not touching the mobile app or the backend — you're building a new web frontend from scratch.

There is no existing web code to copy from — this spec is a complete functional and visual description of the mobile app, translated into requirements for a web build. Use your judgment on idiomatic web patterns (e.g. top nav instead of bottom tabs) but preserve every feature, data flow, and business rule described below.

## Tech stack

- **Next.js (App Router) + TypeScript** — for routing, SSR/SEO on menu pages, and easy deployment.
- **Tailwind CSS** for styling (recreate the design system described below — do not invent a new visual identity).
- **axios** for the API client (mirrors the mobile app's pattern).
- **React Context** for global state (Auth, Cart, Favorites) — no need for Redux/Zustand, this app's state is simple.
- **localStorage** as the web equivalent of the mobile app's AsyncStorage persistence.
- Icon set: use `lucide-react` or `react-icons` (Ionicons equivalents — mapping notes included per screen below).
- Currency formatting: Pakistani Rupees, displayed as `Rs. {amount}` (rounded to whole numbers, no decimals shown anywhere in the mobile app).

## Backend API

The backend is an existing Laravel API (not part of this task — do not build it). Base URL must be configurable via environment variable (`NEXT_PUBLIC_API_URL` or similar) — **do not hardcode an IP** the way the mobile app currently does (its `client.ts` hardcodes `http://192.168.1.13:8000/api`, which was a local-dev shortcut, not something to replicate).

**Auth:** Bearer token auth (Laravel Sanctum-style personal access tokens). Store the token in `localStorage`. Attach `Authorization: Bearer {token}` to every request via an axios interceptor. On any `401` response, clear the stored token/user and redirect to `/login`.

### Endpoints (inferred from the mobile client — verify against actual backend if you have access to it)

```
POST   /api/register          { name, email, password, password_confirmation }
                               → { user: {id,name,email}, token }

POST   /api/login              { email, password }
                               → { user: {id,name,email}, token }

POST   /api/logout             (auth required) → 204/200

GET    /api/categories         → Category[]

GET    /api/menu-items         ?category_id=<optional>
                               → MenuItem[]

GET    /api/addresses          (auth required) → Address[]

POST   /api/addresses          (auth required)
                               { label, address_line, city?, is_default? }
                               → Address

DELETE /api/addresses/:id      (auth required) → 204

POST   /api/addresses/:id/default   (auth required) → Address

POST   /api/orders             (auth required)
                               {
                                 order_type: "delivery" | "pickup",
                                 delivery_address?: string,
                                 notes?: string,
                                 items: [{ menu_item_id, quantity }],
                                 coupon_code?: string
                               }
                               → Order
                               (on invalid coupon, backend returns 422 with
                                errors.coupon_code[0] — surface this inline
                                on the checkout form, not as a toast/alert)

GET    /api/orders             (auth required) → Order[]  (current user's orders)
```

### Data models (TypeScript)

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;         // e.g. "burgers", "combos", "chicken", "beverages", "desserts"
  sort_order: number;
}

interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;        // decimal as string, e.g. "850.00"
  image: string | null; // absolute URL or null
  calories: number | null;
  is_featured: boolean;
  category: Category;   // nested
}

interface Address {
  id: number;
  label: string;         // e.g. "Home", "Work"
  address_line: string;
  city: string | null;
  is_default: boolean;
}

interface OrderItem {
  id: number;
  item_name: string;
  item_price: string;
  quantity: number;
  line_total: string;
}

interface Order {
  id: number;
  order_number: string;
  order_type: "delivery" | "pickup";
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  subtotal: string;
  delivery_fee: string;
  coupon_code: string | null;
  discount_amount: string;
  total: string;
  delivery_address: string | null;
  notes: string | null;
  created_at: string;    // ISO timestamp
  items: OrderItem[];
}

// Client-side only (not from API)
interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}
```

Note: prices from the API are decimal strings — always `Number()` them before math, and `Math.round()` for display (the mobile app never shows decimals).

## Global state (3 contexts)

**1. AuthContext**
- State: `user: User | null`, `isLoading: boolean`.
- On mount, hydrate `user` from `localStorage` (key `user`) and check for a stored `auth_token`.
- `login(email, password)` → calls API, stores `auth_token` and `user` in localStorage, sets state.
- `register(name, email, password, passwordConfirmation)` → same pattern, calls `/register`.
- `logout()` → calls `/logout` (best-effort; still clears local state even if the API call fails), clears localStorage, resets `user` to null.
- Registers a global "unauthorized" handler with the API client so any 401 anywhere in the app forces logout + redirect to `/login`.

**2. CartContext** — persisted to `localStorage` under key `cart_items`.
- State: `items: CartItem[]`.
- `addToCart(menuItem)` — if item already in cart, increment quantity by 1; otherwise add with quantity 1.
- `removeFromCart(menuItemId)`.
- `updateQuantity(menuItemId, quantity)` — if quantity drops to 0 or below, remove the item.
- `clearCart()` — called after a successful order placement.
- Derived: `totalItems` (sum of quantities), `totalPrice` (sum of price × quantity).
- Cart is **not tied to login** — it persists locally regardless of auth state (mirrors mobile behavior), though placing an order does require auth (route guard handles this).

**3. FavoritesContext** — persisted to `localStorage` under key `favorite_items`.
- State: `favorites: MenuItem[]` (stores full item objects, not just IDs).
- `isFavorite(menuItemId)`, `toggleFavorite(menuItem)`.

## Route map & auth guarding

Mobile app uses Expo Router with a redirect effect: if not logged in and not on `/login` or `/register`, force-redirect to `/login`; if logged in and on those pages, redirect to home. Replicate this as global auth-gate logic (e.g. middleware or a top-level layout check) — **the entire app requires login except `/login` and `/register`.**

| Route | Purpose |
|---|---|
| `/login` | Email/password login |
| `/register` | Name/email/password/confirm registration |
| `/` (home) | Landing/browse page — was a bottom tab |
| `/menu` | Full menu with category filter — was a bottom tab, accepts `?categoryId=` |
| `/menu/[id]` (or `/item/[id]`) | Item detail page |
| `/cart` | Cart — was a bottom tab |
| `/checkout` | Order placement form (pushed from cart, not a tab) |
| `/order-success` | Post-order confirmation (receives order summary via query params or route state) |
| `/orders` | Order history — was a bottom tab |
| `/profile` | Account page — was a bottom tab |
| `/addresses` | Manage saved addresses |
| `/favorites` | Saved favorite items |
| `/about` | Static "About Us" info page |

On mobile, primary navigation is a **5-tab bottom bar** (Home, Menu, Cart, Orders, Profile) plus a **slide-out side drawer** (opened via a hamburger icon on the Home screen) containing: My Favorites, My Addresses, My Orders, Explore Menu, About Us, and a Log Out action showing the user's name/email/avatar at the top. For the web build, translate this into a standard **top navbar** (logo, primary nav links, cart icon with item-count badge, account menu) — a bottom tab bar is a mobile-only pattern and shouldn't be replicated literally on desktop, though a bottom nav for narrow/mobile-web viewports is reasonable. Preserve every link from both the tab bar and the drawer somewhere in the web nav (e.g. navbar + account dropdown).

## Design system

- **Primary brand color:** `#FF3D00` (a bold orange-red — used for all primary buttons, active states, prices, icons, badges).
- **Secondary brand color:** `#0D5969` (a dark teal accent, from the restaurant's logo mark).
- **Background:** `#fafafa` (app background), cards are `#fff`.
- **Text:** headings/body `#0D5969` (brand teal, weight 800 for headings), secondary `#555`/`#666`/`#888`/`#999` depending on hierarchy, borders `#eee`/`#ddd`.
- **Cards:** white background, `border-radius: 12–14px`, subtle shadow (`shadow-opacity: 0.06, shadow-radius: 4, y-offset: 1` — translate to a soft small box-shadow), padding ~12–16px.
- **Buttons:** primary = solid `#FF3D00` background, white bold text, `border-radius: 10px`, generous vertical padding (14–16px). Secondary/outline buttons use `#FF3D00` border + text on white/transparent background.
- **Typography:** system font stack (`system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`). Headings are heavy (weight 800), most body text is weight 600–700 for labels/prices, 400–500 for descriptions.
- **Icon accent circles:** small circular badges with a light tint background (`#fbe9e7`) holding a brand-colored icon — used throughout (category tiles, "view details" arrows, etc.).
- **Status badge colors** (order status pills, white text on colored pill, `border-radius: 12px`):
  - `pending` → `#f59e0b` (amber)
  - `confirmed` → `#3b82f6` (blue)
  - `preparing` → `#8b5cf6` (purple)
  - `out_for_delivery` → `#06b6d4` (cyan)
  - `delivered` → `#22c55e` (green)
  - `cancelled` → `#ef4444` (red)
- Category icon mapping (Ionicons name → suggest a lucide/react-icons equivalent): `burgers` → fast-food/burger icon, `combos` → restaurant/utensils icon, `chicken` → flame icon, `beverages` → cafe/cup icon, `desserts` → ice-cream icon. Fallback to a generic fast-food icon for unknown slugs.

## Page-by-page specification

### Login (`/login`)
- Centered form on white background. Logo "🍔 Hot & Spice" (large, bold) + "Welcome back" subtitle.
- Fields: email (no autocapitalize, email keyboard type on mobile web), password (with a show/hide eye-icon toggle).
- Inline red error text above the form on failure (e.g. "Please enter email and password", or the backend's `message` field on API failure — default to "Login failed. Please try again.").
- Primary red submit button, shows a spinner while loading, disabled while loading.
- Link at bottom: "Don't have an account? Sign up" → `/register`.
- On success: store token+user, redirect to home.

### Register (`/register`)
- Same visual pattern as Login. Fields: full name, email, password, confirm password (each password field has its own show/hide toggle).
- Client-side validation: all fields required; password and confirm password must match — show inline error and stop before hitting the API.
- On success: store token+user, redirect to home (same as login).
- Link at bottom: "Already have an account? Log in" → `/login`.

### Home (`/`)
- Top bar: hamburger/menu icon (opens the nav drawer/menu on mobile-width; can be a persistent sidebar or just omitted in favor of the navbar on desktop), an address selector chip (currently just a placeholder — "No Address Selected" with a location pin icon, clicking shows a "coming soon" notice; there's no real address-picker wired up here yet), and the "🍔 Hot & Spice" wordmark in brand red.
- Below that, an **order-type row**: two pill/chip buttons, "Delivery" (bicycle icon) and "Pickup" (storefront icon) — both currently just navigate to `/menu` (they don't actually set an order-type state on this screen; the real order-type choice happens at checkout).
- **Promo banner**: full-width red rounded card, "Free Delivery" headline + "On orders above Rs. 1500" subtext, bicycle icon.
- **"Browse Full Menu" shortcut row**: white card, restaurant icon + label + chevron, links to `/menu`.
- **"Explore Menu" section**: header with a "View All" link (→ `/menu`), then a wrapping grid of category tiles (≈3 per row), each a white rounded card with a circular red-tinted icon and the category name; clicking a tile navigates to `/menu?categoryId={id}`.
- **"🔥 Popular Right Now" section**: horizontally-scrolling row of featured items (`menuItem.is_featured === true`, fetched from `/menu-items` and filtered client-side — there's no dedicated "featured" endpoint). Each card: image (or a placeholder icon if `image` is null), name, price, and a small circular "+" quick-add-to-cart button that calls `addToCart` directly from the card (no navigation).
- Show a loading spinner (brand red) while the featured-items fetch is in flight; categories load independently and silently.

### Menu (`/menu`)
- Header: "Our Menu" title.
- Horizontal scrollable **category selector**: circular icon buttons, first one is always "All" (apps/grid icon). Active category has a filled red circle + red bold label; inactive categories are white-with-red-border circles + red icon + gray label. Tapping the already-active category again deselects it back to "All". Reads/writes the `categoryId` query param so deep-links and the Home page's category tiles work.
- **Item list**: vertical list of horizontal cards — image thumbnail on the left (with a small heart/favorite toggle button overlaid top-right of the image, semi-transparent dark circle background, filled red heart if favorited else white outline), name/description/price/add-button info on the right. The "+" add button adds 1 to cart directly from the list (no navigation required).
- Empty state: "No items found." centered gray text.
- Loading state: centered red spinner.
- Refetches `menu-items` whenever the selected category changes.

### Item detail (`/menu/[id]` or `/item/[id]`)
- Large image at top (or placeholder icon on gray background) with a heart/favorite toggle overlaid top-right.
- Below: item name (large bold), price (bold red), full description, calorie count if present (flame icon + "{n} cal"), and a quantity stepper (−/number/+, minimum 1).
- Sticky/fixed bottom button: "Add to Cart — Rs. {price × quantity}" — adds the item to cart `quantity` times (i.e. calls addToCart in a loop, matching mobile behavior) and navigates back to the previous page.
- If the item id isn't found in the fetched menu list, show a simple "Item not found" state.
- Note: the mobile app fetches *all* menu items and finds the one matching the route param client-side rather than hitting a single-item endpoint — you may do the same, or use a dedicated endpoint if the backend has one; either is fine as long as the page works from a direct link.

### Cart (`/cart`)
- Empty state: cart-outline icon, "Your cart is empty" text, red "Browse Menu" button → `/menu`.
- Otherwise: header "Your Cart" + item count subtitle ("N items"). List of cart line items: thumbnail, name, unit price, quantity stepper (−/count/+, decrementing to 0 removes the item), and a trash icon to remove entirely.
- Sticky footer: Subtotal row + full-width red "Proceed to Checkout" button → `/checkout`.

### Checkout (`/checkout`)
- **Order Type**: two side-by-side toggle buttons (Delivery / Pickup), selected one filled red.
- **Delivery Address** section (only shown when order type = Delivery):
  - Radio-style list of the user's saved addresses (label + address line), fetched from `/addresses` on mount; defaults to the user's `is_default` address (or the first one) pre-selected.
  - An extra "Use a different address" radio option that reveals a free-text multiline address input.
  - If the user has zero saved addresses and hasn't chosen "different address" yet, show a dashed-border prompt card: "Save an address for next time" → links to `/addresses`.
  - Client-side validation before submit: must have either a selected saved address or non-empty new-address text.
- **Order Notes** (optional): free-text multiline input, e.g. placeholder "E.g. Extra spicy, no onions...".
- **Coupon code**: collapsed by default behind a "Have a coupon?" text link (tag icon); clicking reveals an uppercase text input. If the order submission fails specifically due to an invalid coupon (API returns a validation error on `coupon_code`), auto-expand this section and show the backend's error message inline in red beneath the field — do not show a generic alert for this specific case.
- **Order Summary card**: line items (qty × name → line price), divider, Subtotal, Delivery Fee (flat **Rs. 150** for delivery orders, **Rs. 0** for pickup — this is a hardcoded client-side constant, not something the API returns pre-checkout), divider, bold Total.
- **Place Order button**: full-width red, shows spinner while submitting, label reads "Place Order — Rs. {total}". On success: clear the cart and navigate to `/order-success`, passing the returned order's number, subtotal, delivery_fee, discount_amount, coupon_code, and total. On failure (non-coupon errors): show the backend's error message (fallback: "Failed to place order. Please try again.").

### Order success (`/order-success`)
- Centered confirmation screen: green circular checkmark icon, "Order Placed!" heading, "Order #{order_number}", "Your order has been received and is being prepared." subtext.
- If summary data was passed through: a card showing Subtotal, Delivery Fee, and — only if discount > 0 — a green "Discount ({coupon_code})" line, then a divider and bold Total.
- Two actions: "Track My Order" (red button) → `/orders`, and a plain-text "Back to Home" link → `/`.

### Orders (`/orders`)
- Header "My Orders". Refetches on every page focus/mount so a just-placed order shows immediately (pull-to-refresh equivalent on mobile — on web, at least refetch on navigation/focus, and consider a manual refresh affordance).
- Loading: centered red spinner. Empty: receipt-outline icon + "No orders yet".
- Otherwise: a card per order — order number + colored status pill (mapping/colors above) in the header row, formatted date below (`DD Mon YYYY, HH:MM`), a divider, then each line item as "{qty}x {item_name}" with its line total right-aligned, another divider, then a footer row showing the order type ("🛵 Delivery" or "🏬 Pickup") on the left and the bold red grand total on the right.

### Profile (`/profile`)
- Header "My Profile". A card with a red circular avatar (person icon), user's name (bold) and email (gray, smaller).
- A menu card with rows: "My Addresses" → `/addresses`, "My Orders" → `/orders`, "Log Out" (red text/icon, bottom of card, no bottom border) — logout shows a confirm dialog ("Are you sure you want to log out?") before actually logging out.

### Addresses (`/addresses`)
- List of saved address cards: label (bold) + "Default" badge (light-red pill) if applicable, address line, city if present, and action links: "Set as Default" (only shown on non-default addresses) and "Delete" (with a confirm prompt).
- Empty state: location-outline icon + "No saved addresses yet".
- Bottom/persistent "+ Add New Address" button opens a modal/sheet with fields: Label (default "Home"), Address (multiline, required), City (optional). Saving calls the create-address API, closes the modal, and refetches the list. The very first address a user ever adds should be sent with `is_default: true`.

### Favorites (`/favorites`)
- Distinct visual treatment from other list pages: light-gray page background (`#ececec`), items rendered as gray (`#dcdcdc`) cards rather than white.
- Each card: item name (bold, large), a "VIEW DETAILS →" link (red text + small red circular arrow icon) to the item detail page, price at the bottom-left; on the right, a filled red heart icon (tap to un-favorite) above a thumbnail image.
- Empty state: large circular white icon badge with an outlined red heart, "No Favorites" heading, and a red "EXPLORE MENU" button (bold uppercase, letter-spaced) → `/menu`.

### About (`/about`)
- Static informational page, not fetched from the API. Logo + tagline ("It's finger lickin' fast."), then three white cards:
  1. "Who We Are" — descriptive paragraph about the brand.
  2. "Our Promise" — three bullet rows with icons: freshly prepared (flame), fast delivery (bicycle), honest pricing (tag).
  3. "Get in Touch" — phone (`042-111-000-111`), email (`support@hotandspice.pk`), location ("Lahore, Pakistan"), each with a matching icon.
- Footer text: "App Version 1.0.0" (adjust/omit version string as appropriate for a web build, or replace with a copyright line).

## Cross-cutting behavior notes

- **Prices**: always parse the API's string price as a number and round for display; never show decimals.
- **All list/detail screens that add to cart** do so optimistically and instantly (no confirmation dialog, no toast) — this matches the mobile app's snappy feel; a small visual acknowledgment (e.g. a brief badge bump on the cart icon) is a reasonable web enhancement but not required.
- **Auth errors (401) anywhere** should force a logout + redirect to `/login`, exactly like the mobile app's global interceptor.
- **The cart and favorites lists survive logout** in the mobile app (they're just local storage, unrelated to the auth token) — replicate this; don't clear them on logout unless you have a specific reason to diverge.
- **Order placement requires auth** (the whole app is gated behind login per the route map above, so this is automatic).
- This is a **Pakistani business** — currency is PKR (Rs.), locale formatting for dates matches `en-GB`-style output (e.g. "10 Aug 2026, 14:30"), delivery fee and free-delivery threshold are in PKR.

## What NOT to copy from the mobile app

- Do not hardcode an API base URL/IP — use an environment variable.
- Do not leave `console.log` debug statements from error handlers (the mobile login/register screens currently log full error responses to the console — fine for RN dev, not appropriate to ship on web).
- The mobile project has a handful of default Expo-template files (`themed-text`, `themed-view`, `parallax-scroll-view`, `hello-wave`, `collapsible`, `haptic-tab`, `external-link`) that are **unused boilerplate**, not part of the actual app — don't bother replicating them.

## Deliverable

A working Next.js + TypeScript web app that:
1. Authenticates against the existing Laravel API.
2. Implements every page and behavior described above.
3. Matches the visual language (colors, spacing, card style, typography weight) described in the Design System section.
4. Is responsive — usable on both desktop and mobile-web viewports, adapting the tab-bar/drawer navigation pattern to appropriate web idioms without dropping any destination.
5. Handles loading and empty states on every data-fetching screen, matching the patterns described per-page above.
