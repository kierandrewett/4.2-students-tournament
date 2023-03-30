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
