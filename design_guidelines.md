# Design Guidelines for "The Birthday Challenge"

## Visual Style & Theme

**Overall Vibe:** Techie, sleek, laid back, and cool

**Color Palette:**
- Background: Very dark charcoal
- Main accent: Muted orange
- Secondary accents: Soft gray and white
- No neon colors - keep everything subtle and refined

**Typography:**
- Clean modern sans-serif font throughout
- Large enough text for mobile readability

**UI Components:**
- Rounded, minimal buttons and cards
- Subtle glows or shadows (nothing loud or neon)
- Mobile and desktop responsive design

## Layout Structure

### Initial Welcome Screen
- Big animated title: "Happy Birthday Dave" with graffiti/paint splash style effect
- Subtitle: "The Birthday Challenge" 
- Entrance animation: fade in, scale up, or slight wiggle
- After 2-3 seconds, fade in instructions box below

### Instructions Box
Clear, concise panel with game rules, followed by:
- "Start Game" button
- Visible starting balance display: "Balance: 100"

### Game Layout

**Top Bar:**
- Left: "The Birthday Challenge" text
- Center: Current question indicator ("Question 1 of 6")
- Right: Countdown timer

**Main Card:**
- Question text (prominent)
- Visible countdown timer
- Current balance display
- Text input for answer
- "Submit answer" button

**Control Buttons (below input):**
- "Need a hint"
- "Give me more time"
- "Make it easier"

## Balance Display System

**Primary Display:**
- Always visible: "Balance: X" (integer format)
- Show as "X crypto dollars"

**Transaction Feedback:**
- Animated change notifications ("minus 3", "minus 10")
- Small log line explaining each transaction:
  - "Hint used minus 3"
  - "Time boost minus 1"
  - "Wrong answer minus 10"
  - "Correct answer no change"

## Timer Mechanics Display

- 40 seconds starting countdown per question
- Clear visibility: "Time left: X seconds" or circular countdown
- Visual update when time boost activated
- "Time is up" message on timeout

## Hint System UI Progression

**First Hint ($3):**
- Reveals multiple choice options (3-4 choices) below text input
- Keep text input visible
- Display: "Hint cost minus 3"

**Second Hint ($3):**
- Reduces to two choices (fifty-fifty)
- Display: "Extra hint minus 3"
- Disable hint button after this

**"Make it easier" ($2):**
- Shows one-sentence textual clue
- One-time use per question

## Answer Feedback Animations

**Correct Answer:**
- Confetti animation over main card
- Big "Correct" message with celebratory text
- Brief green highlight on balance
- Pulse animation on card or celebratory emoji effect

**Incorrect Answer:**
- Red highlight flash on balance
- "Incorrect minus 10" message
- No confetti or celebration

## End Screen

**Final Display:**
- Big message: "Challenge complete"
- Final balance: "X crypto dollars"
- Note: "This is your real birthday gift amount in the real world"

**Gift Selection:**
- "Choose your reward" heading
- Four button choices:
  - "Crypto transfer"
  - "Amazon gift card"
  - "PlayStation gift card"
  - "Gas card"

**Form Displays:**
- Crypto: Wallet address input + optional note
- Other options: Email input + optional note
- "Submit choice" button
- Confirmation message on submission

## Status Dashboard

Small persistent display showing:
- Current question number
- Time remaining
- Current balance

## Animations & Effects

- Entrance animations for title (2-3 second delay before instructions)
- Balance change animations (highlight and notification text)
- Confetti celebration on correct answers
- Pulse/glow effects on successful completion
- Timer countdown visual feedback
- Smooth transitions between questions