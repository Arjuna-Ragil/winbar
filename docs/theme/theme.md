# Custom Themes Guide

Winbar allows you to fully customize its appearance by creating your own themes. Themes dictate the colors of the background, widgets, and text elements used across the status bar and overlay modules.

## How to Add a Custom Theme

Themes in Winbar are defined using simple JSON files.

1. Navigate to the `themes/` directory located in the same folder as your Winbar executable. *(If it doesn't exist, Winbar will automatically create it and populate it with the default themes the first time you run the app).*
2. Create a new `.json` file in this directory. The name of the file will be the name you use in your `config.yaml`. For example, if you create `mytheme.json`, you will set `theme: mytheme` in your config.
3. Open the file in any text editor and define your theme using the JSON format detailed below.
4. Save the file.
5. Apply your theme either by selecting it via the Theme Toggle widget on the bar, or by editing your `config.yaml` to set `theme: your_theme_name`, and then clicking **Reload** from the system tray.

## Theme Format

A theme JSON file requires a name, author, and a set of colors. You can use standard CSS color values (HEX, RGB, RGBA).

Here is an example of a custom theme:

```json
{
  "name": "My Custom Theme",
  "author": "Your Name",
  "colors": {
    "widget": "rgba(59, 66, 82, 0.7)",
    "widgetHover": "rgba(67, 76, 94, 0.8)",
    "widgetActive": "rgba(136, 192, 208, 0.8)",
    "widgetActiveHover": "rgba(129, 161, 193, 0.8)",
    "widgetText": "#eceff4",
    "background": "rgba(46, 52, 64, 1)"
  }
}
```

### Color Properties Explained

- `widget`: The default background color for widgets on the bar and module panels. Use RGBA if you want transparency.
- `widgetHover`: The background color when you hover your mouse over a widget or interactive element.
- `widgetActive`: The background color for active elements (e.g., active workspaces, toggled-on buttons).
- `widgetActiveHover`: The background color when hovering over an already active element.
- `widgetText`: The color of text and icons inside the widgets.
- `background`: The color of the main Winbar background and overlay background. It is highly recommended to use an RGBA value with an alpha channel of `1` (fully opaque) for the background to avoid visual glitches with Windows' transparency effects, but you can experiment with transparency if desired.

## Default Themes

If you want inspiration, check out the pre-installed themes in your `themes/` directory. Winbar comes bundled with themes like `default`, `dracula`, `nord`, `monokai`, and `solarized`.
