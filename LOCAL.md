# Run Rally Court locally

A playable tennis-inspired arcade game.

**[Download the ready-to-run ZIP](https://github.com/rishitpradhan-gif/rally-court/releases/download/local-v1/rally-court-local.zip)** · [All tools](https://github.com/rishitpradhan-gif/rishitpradhan-gif/blob/main/TOOLS.md)

## Three steps

1. Install Python 3.10+ if it is not already on your computer.
2. Download the ZIP above, **extract all files**, and open a terminal in the extracted folder (the one containing serve.py).
3. Run:

```sh
python3 serve.py
```

Open http://127.0.0.1:8000 in a modern browser.

Python 3.10+ and a modern browser. No Node.js, npm, or build step is needed for this prebuilt download.

Keep the terminal open while using a server. Press **Ctrl+C** to stop it. Research verifiers exit after finishing their checks.

## If you get stuck

- **Windows:** replace `python3` with `py -3` in Python commands. If neither works, install Python from [python.org](https://www.python.org/downloads/). For the APIs, install Node from [nodejs.org](https://nodejs.org/en/download).
- **“File not found”:** extract the ZIP first, then change into the inner folder containing the launcher. Do not run from inside the ZIP viewer.
- **“Command not found”:** check `python3 --version` / `py -3 --version`, or `node --version` for the APIs. Reopen the terminal after installing a runtime.
- **Port already in use:** run `python3 serve.py --port 8001` and open http://127.0.0.1:8001 instead.
- **Blank screen after double-clicking index.html:** use `serve.py` and the local URL instead.

## Editing the source

The prebuilt ZIP is for running the app. To change it, clone this repository, install Node.js 22.17+, then run `npm ci` and `npm run dev`.

These downloads run locally. The local servers bind to your own computer; they are not configured as public multi-user services.
