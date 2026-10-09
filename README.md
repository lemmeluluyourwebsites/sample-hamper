# Digital Cozy Hamper 🌸✨

A mobile-first, glassmorphic digital sanctuary and interactive playground. Crafted with soft glowing ambient halos, tactile micro-interactions, responsive 60fps animations, procedural canvas effects, and zero-latency Web Audio soundscapes.

---

## 🎨 Aesthetic & Design System

- **Palette:** Deep Black background with vibrant Cute Baby Pink glowing accents (`#ff85a1`, `#ffd1dc`, `#f472b6`).
- **Glassmorphism:** Layered frosted glass panels (`backdrop-blur-xl`, subtle translucent borders, and soft halo drop shadows).
- **Mobile-First & Tactile:** Guaranteed 48x48px minimum touch targets, `touch-action: none` on interactive canvases to prevent mobile scroll-bounce, and Web Audio API synthesized audio responses.

---

## 📱 Features

### 💖 Category 1: First Aid (Emotional Support)
- **Need to Vent?:** A safe venting modal. Writing your thoughts and pressing "Burn It & Release" triggers a procedural canvas flame animation over the words, shakes the container, dissolves the text to ash, and releases rising smoke particles before serene dismissal.
- **Quick Comfort Delivery:** Instant comfort buttons (*"I need a hug"*, *"I need a kiss"*, *"I need both"*) delivering vertical 9:16 animated cards, personalized comforting messages, and loving reassurance.
- **My Open—When Letters:** A dedicated card providing direct access to custom open-when letters crafted specially for every emotional moment and milestone.
- **Reasons I Love You Jar:** A 3D-styled glass jar graphic with cylindrical depth, cork stopper, and specular highlights holding folded origami love notes. Tapping the jar triggers an animation of a folded paper note floating out of the jar neck and unfolding into a modal with heartfelt affirmations.

---

### ✨ Category 2: Fidget (Sensory Relief)
- **Interactive Fluid Ripple Zone:** Canvas-based fluid simulation tracking touch and pointer movements, creating expanding, rapidly fading (0.5s) baby pink concentric ripples and glowing waves.
- **Haptic Bubble Wrap:** A grid of glassmorphic bubbles featuring spring scale pop animations, opacity reduction, soft synth pop audio, haptic vibration feedback (`navigator.vibrate`), and a reset action.
- **Mystery Scratch Card:** An HTML5 canvas layered over randomly selected hidden photos with adaptive aspect ratio and baby pink foil. Moving across the card erases the top layer (`globalCompositeOperation = 'destination-out'`). Clearing 90% snaps opacity to 0 and showers celebratory confetti.
- **Digital Dune Sand:** Granular physics engine driven by device tilt via the `DeviceOrientation` API (or manual touch dragging). Initialized one-fourth filled at the bottom with dense particles strictly adhering to a natural sand palette (`#d2b48c`, `#c2b280`, `#e6d5ac`).
- **Harmonic Octave Harp & Melody Composer:** A 3-octave diatonic solfège scale (Do, Re, Mi, Fa, Sol, La, Ti, Do) allowing users to compose, record, and play back their own romantic melodies.

---

### 🎮 Category 3: Cozy Mini-Games
- **Catch the Hearts:** Draggable basket (`drag="x"` in Framer Motion) catching falling Hearts (+1) and Kisses (+2) while dodging Rainclouds (-1). Features dynamic speed scaling as you score to keep it fun and competitive.
- **Cupid's Worry Popper:** A relaxed physics shooter where players tap or aim and shoot glowing heart arrows from a pink bow to pop floating worry bubbles (*Stress*, *Overthinking*, *Anxiety*), exploding them into confetti and soothing positive messages. No timers, no scores.
- **Petal by Petal:** A delicately rendered botanical flower bloom with 16 realistic petals. Plucking petals requires a true outward swipe gesture into the breeze, revealing playful love affirmations (*"I love him more"* vs. *"He loves me more"*). Detaching the final petal reveals the couple's keepsake frame and triggers the screenshot victory banner!

---

## 🛠️ Technology Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS v4**
- **Framer Motion**
- **HTML5 Canvas & 2D Context API**
- **Web Audio API** (Procedural synthesis for zero-latency pops, diatonic major scales, chimes, and fire sounds)
- **Canvas Confetti**
- **Lucide React**

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lemmeluluyourwebsites/sample-hamper.git
   cd sample-hamper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

---

## 📄 License
Private and confidential gift project.
