# Companions Guide

The Companion module in Winbar brings an integrated AI chat assistant directly to your desktop. You can create your own custom companions with unique personalities, behaviors, and visual avatars.

## How to Create Your Own Companion

Companions are loaded from the `companions/` directory located next to your Winbar executable. Creating a new companion is as simple as creating a new folder with a configuration file and a profile picture.

1. Navigate to the `companions/` directory located next to your Winbar executable. *(If it doesn't exist, Winbar will automatically create it and populate it with the default companion the first time you run the app).*
2. Create a new folder for your companion. The name of the folder will be the internal ID of your companion.
3. Inside this folder, create a file named `config.json`. This file defines your companion's personality.
4. Add an image file named `normal.png`. This will be used as the avatar for your companion.
5. In your `config.yaml`, ensure the `companion` module is enabled under the `modules` list.
6. Reload Winbar from the system tray. Your new companion will now be available in the Companion module!

*(Advanced note: You can also include multiple emotion-based images like `happy.png`, `angry.png`, or `sad.png` in the companion folder if you are building dynamic expression support).*

## Configuration Format

The `config.json` file dictates how the AI should behave and what it should say when it first starts.

Here is the format based on the default companion:

```json
{
    "name": "Default",
    "system_prompt": "You are a desktop companion. Be concise and helpful.",
    "start_message": "Hello there! I'm your default system companion. How can I help you today?"
}
```

### Properties Explained

- `name`: The display name of your companion. This is the name you will see in the chat interface.
- `system_prompt`: This is the core instruction sent to the AI backend. It defines the character, rules, and personality. You can make this as detailed as you want (e.g., instructing it to act like a specific fictional character, a strict tutor, or a witty assistant).
- `start_message`: The initial greeting message the companion sends when you open the chat or reset the conversation.
