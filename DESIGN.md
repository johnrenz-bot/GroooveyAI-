---
name: Electric Stage Nocturne
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#ffb3ad'
  on-tertiary: '#68000a'
  tertiary-container: '#cf2c30'
  on-tertiary-container: '#ffecea'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels the electrifying spectacle of the live performing arts merged with the dynamic, heroic energy of a feathered champion. Rooted in deep, theatrical proscenium darkness, the visual language leverages luminous color pops drawn directly from theatrical stagecraft: vibrant spotlight amber, electric azure plumage, and dramatic curtain crimson.

The style fuses **Sleek Glassmorphism** with **Atmospheric Stage Lighting**:
- **Atmosphere:** Translucent frosted dark containers that float over deep velvet stage backdrops, back-illuminated by ambient colored spotlights.
- **Heroic Personality:** Energetic, confident, inspiring, and theatrical. Visual elements evoke front-row backstage access, high-fidelity live audio consoles, and dynamic hero entrances.
- **Emotional Response:** Users experience the anticipation of the curtain rising, the warmth of the footlights, and the crisp clarity of a modern command center tailored for live performance communication.

## Colors

The palette is engineered exclusively for high-drama dark interfaces, celebrating the vivid chromatic identity of the superhero eagle mascot against the darkness of an auditorium.

- **Primary (`#2563EB` Electric Azure):** Represents the hero's wing plumage and crisp stage lasers. Applied to active states, focused accents, interactive triggers, and key messaging conduits.
- **Secondary (`#F59E0B` Stage Amber Gold):** Derived from the golden medallion emblem, sharp beak, and intense footlight beams. Used for high-priority notifications, badges, highlights, and star ratings.
- **Tertiary (`#EF4444` Theatrical Crimson):** The signature cape and velour curtain red. Used for dynamic performance callouts, live recording indicators, critical alerts, and heroic badges.
- **Neutral Core (`#0B0F19` Deep Proscenium Void):** Serves as the canvas substrate. Tiered shades (`#111827`, `#1E293B`, and `#334155`) formulate container panels, frosted headers, and backstage surfaces without washing out high-saturation highlights.

### Semantic & Stage Glow Roles
- **Glow Accents:** Diffused radial halos using primary, secondary, and tertiary hues at `12%` to `20%` opacity behind active conversation hubs and key cards.
- **Text & Content:** High-contrast off-whites (`#F8FAFC` and `#E2E8F0`) ensure pristine legibility across dark surfaces, while muted stage metadata sits at `#94A3B8`.

## Typography

Typography establishes an intentional cadence between bold stage presence and high-density chat readability:

- **Headlines (`Space Grotesk`):** Brings a geometric, avant-garde theatrical character. It cuts cleanly through dark ambient backgrounds, evoking futuristic stage rigging, bold marquee bills, and comic title treatments.
- **Body & Labels (`Plus Jakarta Sans`):** Provides warm, open apertures and supreme clarity in both conversational bubbles and technical metadata, maintaining effortless scanability during real-time messaging interactions.

### Hierarchy Guidelines
- Numerical counters, participant statuses, and timestamps utilize tabular figures where supported.
- Marquee titles and modal alerts employ `headline-lg` with tight tracking (`-0.015em`) to evoke bold performance banners.

## Layout & Spacing

The layout is structured around an adaptive 12-column grid system configured for chat consoles, live stage streams, and backstage communication channels.

### Layout Mechanics
- **Desktop (1024px+):** Three-tier layout comprising an unyielding sidebar (stage directory/channels), an expansive conversational stream, and a dynamic backstage inspector panel. Outer canvas margin is set to `2rem` with a `1.25rem` column gutter.
- **Tablet (768px - 1023px):** Two-tier panel layout where the backstage inspector collapses into an overlay drawer.
- **Mobile (<768px):** Single-column stacked stream with fixed bottom control bar, edge-to-edge floating chat rows, and a compact canvas margin of `1rem` with `0.75rem` internal gutters.

### Chat Spacing Rhythm
- Sequential chat messages from the same participant collapse vertical separation to `space-xs` (4px).
- Interleaved messages between different stage performers or audience participants expand to `space-md` (16px).
- Input composition bars and sticky action bars maintain an internal horizontal padding of `space-md` and a vertical breathing space of `space-sm`.

## Elevation & Depth

Visual hierarchy uses frosted acoustic layers, perimeter rim lighting, and luminous theatrical backlights rather than heavy opaque drop shadows.

### Glassmorphic Surface Tiers
- **Backdrop Canvas (Floor 0):** Pure deep stage void (`#0B0F19`), grounding the stage.
- **Stage Panels (Tier 1):** `#111827` rendered at `75%` opacity with a `16px` backdrop-filter blur. Edges feature a hairline border (`1px solid rgba(255, 255, 255, 0.08)`).
- **Floating Overlays & Modals (Tier 2):** `#1E293B` at `80%` opacity with a `24px` blur, bordered with `rgba(255, 255, 255, 0.14)`.

### Spotlight Ambient Luminescence
- **Electric Spotlight:** For highlighted action items or user focus, an ambient glow radiates beneath the element using `box-shadow: 0 0 32px -4px rgba(37, 99, 235, 0.35)`.
- **Encore Amber Accent:** Urgent notifications and mascot badges utilize an inner and outer amber glow (`0 0 24px -2px rgba(245, 158, 11, 0.3)`).
- **Crimson Cue:** Critical alerts or active recording indicators feature a theatrical pulse (`0 0 20px -2px rgba(239, 68, 68, 0.4)`).

## Shapes

The design system embraces a **Rounded (Level 2)** shape profile, balancing the soft, feather-like warmth of the eagle hero with the high-tech precision of stage gear.

- **Base Radius (0.5rem / 8px):** Input fields, message action menus, checkboxes, and inline system pills.
- **Large Radius (1rem / 16px):** Conversational chat bubbles, glassmorphic stage cards, floating toolbars, and modal containers.
- **Extra Large Radius (1.5rem / 24px):** Floating bottom action bars, docked composer docks, and hero banners.
- **Full Pill (`9999px`):** Status indicator tags, live countdown chips, user avatars, and primary action buttons.

## Components

### Buttons
- **Primary Hero Button:** Gradient background transitioning from Electric Azure (`#2563EB`) to Deep Sapphire (`#1D4ED8`), white text, fully rounded pill shape (`9999px`), accented by a subtle electric neon blue halo on hover.
- **Secondary Spotlight Button:** Semi-translucent dark fill (`rgba(255, 255, 255, 0.06)`), gold-amber border (`1px solid #F59E0B`), gold text, emitting a soft stage-light glow when engaged.
- **Theatrical Action Button (Tertiary/Destructive):** Crimson red fill (`#EF4444`) with white text and deep ruby shadow, reserved for stopping streams, leaving backstage, or ending acts.

### Chat Bubbles & Threading
- **Incoming Messages (Cast/Crew):** Surface glass tint (`rgba(30, 41, 59, 0.75)`), high-legibility text (`#F8FAFC`), rounded corners with a subtle trailing curve on the top-left edge.
- **Outgoing Messages (Current User):** Tinted electric blue glass (`rgba(37, 99, 235, 0.22)`), bound by a crisp border (`1px solid rgba(37, 99, 235, 0.5)`), nested on the right edge.
- **Hero/VIP Callout Message:** Gold border tint with a micro mascot insignia badge anchored to the top-right header corner.

### Input Fields & Message Composer
- Frosted dark container (`rgba(17, 24, 39, 0.85)`) framed by a sleek border (`rgba(255, 255, 255, 0.1)`).
- On focus, border snaps to Electric Azure with a soft radial back-illumination.
- Trailing actions (send trigger, attachments, emoji reacts) sit on an interior floating dock with gold and blue highlight icons.

### Chips & Badges
- **Live / On Stage:** Pill-shaped badge featuring a pulsing Crimson dot (`#EF4444`) on a translucent red pill (`rgba(239, 68, 68, 0.15)`).
- **Hero Badge:** Amber gold badge (`#F59E0B`) with micro star emblem echoing the eagle mascot's chest clasp.

### Checkboxes & Switches
- Checkbox frames use `rounded` corners (`4px`), transitioning from subdued smoke borders to full Electric Azure with crisp white checks on selection.
- Toggles resemble audio console sliders: dark track with an Electric Azure or Gold thumb that lights up when active.

### Cards & Stage Panels
- Backstage profile cards and audio monitors utilize deep glass panels with top-edge highlight lines (`1px linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`), simulating light caught on glass equipment.