# Fonts directory

Drop static font files here and keep the filenames expected by `src/index.css`:

- `Inter-Regular.woff2`
- `Inter-Regular.woff`
- `Inter-Regular.ttf`

The boilerplate points `@font-face` to these files in this order:
1. `/fonts/Inter-Regular.woff2`
2. `/fonts/Inter-Regular.woff`
3. `/fonts/Inter-Regular.ttf`

If you prefer to use another font family, update both:

- `@font-face` in [`src/index.css`](/Users/user/Documents/github/hailo/project-boilerplate/src/index.css)
- The alias stack in `:root`.
