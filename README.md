<img src="https://raw.githubusercontent.com/EnderDev/4.2-students-tournament/main/mockups/Reference%20Logo.png" width="100">

# 4.2 Students Tournament

Written using Tauri as the desktop framework and React for the frontend.

## Directory structure

| Directory              | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| [src](src)             | Frontend for Students Tournament made using React.                   |
| [src-tauri](src-tauri) | Backend for Students Tournament made using Rust/Tauri for windowing. |
| [mockups](mockups)     | Static mockup files used during in design process.                   |
| [pseudo](pseudo)       | Pseudocode and data structured used to aid development.              |

## Download

Check [the releases tab](https://github.com/EnderDev/4.2-students-tournament/releases/latest) for a list of compiled binaries to run.

### For Windows users

**Windows will warn you before launching the installer that it could "put your PC at risk".** 

This message only appears because we have not signed the binary using a security certificate (they cost a lot to own), you can safely ignore this message and continue to the installation if you follow these steps:

1. Click "More info" when the message box appears
2. Click "Run anyway" when it appears.

![Group 1](https://user-images.githubusercontent.com/42723993/228990849-66e5bc83-0c0b-44e4-8741-416244d1ee50.png)
![Group 2](https://user-images.githubusercontent.com/42723993/228990853-d6f7ca03-a296-4e7d-b1f5-0d0101b72f97.png)

If you're skeptical that this open-source application is in fact a virus, consider running the installer executable through something such as [VirusTotal](https://virustotal.com).

## Development

1.  Install Rust via [rustup](https://rustup.rs).
2.  Install Node.js via [nodejs.dev](https://nodejs.dev/en/).
3.  Install Git via [git-scm.org](https://git-scm.org)

4.  **On Windows, Microsoft Visual Studio 2022/Microsoft Visual Studio Build Tools 2022 will be required.**

        - Latest Windows SDK individual component in Visual Studio Installer required
        - Desktop Development for C++ package in Visual Studio Installer required

5.  Clone the repository to somewhere on your computer:

    ```
    $ git clone https://github.com/EnderDev/4.2-students-tournament
    ```

6.  Install the required frontend dependencies using npm:

    ```
    $ npm install
    ```

7.  Compile and boot up the application:

    ```
    $ npm run tauri dev
    ```

8.  If everything builds correctly, you should see the window open. Otherwise, [open a GitHub issue](https://github.com/EnderDev/4.2-students-tournament/issues/new) and report the problem.
