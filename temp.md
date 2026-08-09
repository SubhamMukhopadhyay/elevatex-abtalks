# Project Prompts & Design Guidelines

This file serves as a reference for the design system, specific styling choices, and rules established during the development of Elevatex.

## Design Rules (UI/UX)
- **Primary Typography:** 
  - Ensure strict sizing and spacing. The hero title uses `text-[2.5rem] md:text-[3.5rem] font-black tracking-tight`.
  - Do not use `tracking-tighter` as it squishes letters. Do not add drop shadows to text, as it conflicts with text rendering on mobile and causes letters to appear hollow or thin.
- **Strict Mobile Wrapping:**
  - The hero text must NEVER wrap to three lines on narrow devices.
  - Utilize `flex flex-col` on the parent `<h1>` and `whitespace-nowrap` on individual `<span>` elements to enforce a rigid two-line structure.
- **Desktop Layout:**
  - Maintain the split-screen layout (`md:flex-row`). The typography stays left-aligned in the left column, while feature cards exist in the right column.

## Performance Optimization Rules
- **No Backdrop Blurs on Mobile:**
  - Android devices experience severe frame drops and lag when rendering `backdrop-blur-sm` or `backdrop-blur-md` on full-screen fixed modals.
  - Fix: Use pure semi-transparent backgrounds like `bg-black/95` or `bg-[#0a0515]/95` instead of `backdrop-blur`.
- **Scroll Locking:**
  - Whenever a modal (e.g., Profile Card Modal, Streak Freeze Modal) is opened, a `useEffect` must be triggered to set `document.body.style.overflow = 'hidden'` to prevent background scrolling. Reset to `'unset'` on unmount.
