# PhantomDeck UI Components Architecture

This document tracks the objectives and standards for our reusable components. 
We aim for a **Pro Cyber** aesthetic: Glassmorphism, high performance, and deep accessibility.

## 📐 General Standards
- **Styling**: Tailwind CSS v4 only. No separate `.css` files.
- **Logic**: Qwik `component$` using signals for state.
- **Theming**: Strict adherence to the `oklch` palette in `global.css`.
- **Flexibility**: All components must use the `cn()` utility to allow class overrides.

---

## 🛠️ Component Roadmap

### 1. Button (Objective)
**Status**: ✅ Complete
**Inspiration**: Shadcn 2.0 / Next.js
**Core Features**:
- Multi-variant system: `default`, `outline`, `secondary`, `ghost`, `glass`, `destructive`, `link`.
- Multi-size system: `xs`, `sm`, `default`, `lg`, `icon`.
- Reactive states: hover, active (scale pulse), focus, disabled.
- Fully slot-compatible for icons and text.

### 2. Card (Objective)
**Status**: ✅ Complete
**Inspiration**: Shadcn 2.0 / Next.js
**Core Features**:
- Compound component structure: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- "Cyber Pro" aesthetic: glassmorphism, subtle shadows, and themed backdrops.
- Size variants: `default` (standard) and `sm` (compact layouts).
- Responsive layout handling with group-hover effects.

### 3. Dialog / Modal (Objective)
**Status**: ✅ Complete
**Inspiration**: Shadcn 2.0 / Next.js
**Core Features**:
- Native `<dialog>` implementation for true accessibility and focus trapping.
- Compound sub-components: `Dialog`, `DialogHeader`, `DialogTitle`, `DialogContent`, `DialogFooter`.
- "Cyber Pro" aesthetic: large backdrops, blur effects, and smooth entry/exit animations.
- Fully reactive 'show' state via Qwik signals.

### 4. Dynamic Tabs (Objective)
**Status**: ✅ Complete
**Core Features**:
- Context-based state management (zero global pollution).
- Sub-components: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
- Animates-in on switch with a high-fidelity slide/fade effect.
- Default and Line variants for flexible layouts.

### 5. Carousel (Objective)
**Status**: ✅ Complete
**Core Features**:
- 100% Native CSS Scroll Snap (Zero-JS for core scrolling).
- Mobile-optimized touch gestures.
- Custom breakpoints for responsive display (Single/Multi-item).
- "Pro" snap-centering and alignment.

### 6. Drawer (Objective)
**Status**: ✅ Complete
**Core Features**:
- Native-first design.
- Edge-transition support (Bottom, Top, Left, Right).
- Mobile-first slide-up interaction pattern.
- Same modular API as Dialog for consistent developer experience.

### 7. Popover (Objective)
**Status**: ✅ Complete
**Core Features**:
- Native Browser Popover API (Zero-JS for toggling).
- Declarative attribute-based trigger and content.
- Same modular API as Dialog for consistent developer experience.

### 8. Table (Objective)
**Status**: ✅ Complete
**Inspiration**: Shadcn 2.0 / Next.js
**Core Features**:
- Semantic HTML implementation (thead, tbody, tfoot, tr, th, td).
- "Cyber Pro" aesthetic: Glass headers, subtle borders, and italic typography.
- Horizontal scroll support for responsive data grids.
- Compound components: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`.

### 9. Input OTP (Objective)
**Status**: ✅ Complete
**Core Features**:
- Modular design with `InputOTP`, `InputOTPGroup`, `InputOTPSlot`.
- Native Qwik reactivity for 100% control over focus and values.
- High-fidelity visual feedback (Pulsing caret, focus scaling).
- Optimized for mobile and pasting.

### 10. Neural Notifications (Toast)
**Status**: ✅ Complete
**Inspiration**: Sonner
**Core Features**:
- Powered by `qwik-sonner`.
- Custom "Cyber Pro" glassmorphism styling.
- Global singleton accessible from any component.

### 11. Telemetry Buffering (Skeleton)
**Status**: ✅ Complete
**Core Features**:
- `animate-pulse` based loading states.
- Surgical borders and glass effects to match card aesthetics.
- Flexible sizing and shape support.

### 12. Field Architecture
**Status**: ✅ Complete
**Core Features**:
- Advanced primitives for form building: `Field`, `FieldLabel`, `FieldTitle`, `FieldDescription`.
- Integrated validation display via `FieldError`.
- Native `<fieldset>` and `<legend>` for accessibility.
- Support for `vertical`, `horizontal`, and `responsive` orientations.

### 13. Neural Input Vector (Forms)
**Status**: ✅ Complete
**Core Features**:
- **Input & Textarea**: Surgical-grade text fields with custom glass effects and focus intensities.
- **Checkbox & Switch**: Fully styled binary toggles with hidden native inputs for accessibility.
- **Radio Group**: Compound choices with specialized "Lattice" selection feedback.
- **Theming**: Automatic integration with `Field` labels and error states.
