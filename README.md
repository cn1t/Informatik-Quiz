# Computer-Science quiz for kids
This is a simple quiz game for kids to learn about computer science through logic problems with multiple choice questions.
The game is written in Go and the front end is written in HTML, CSS, and JavaScript.

I made this project as a part of my effort to represent the IT-sector at our school's "Open House" day.
It is also beeing used in future computer science lessons at our school.
We had a couple PCs set up with this game running and the kids could play it and get a position on the leaderboard with their name, which was shown on the beamer, if they got a high score.

Be aware that players can easily cheat through pressing ```CTRL + SHIFT + I```, then changing the localStorage values or through the URL-path (simply press ```F11``` so they cannot see that and it looks nicer).
This is not a problem for me, as the main goal is to get the kids interested in computer science and not to have a fair competition.


## Setup guide

Either run the .exe once you downloaded and unzipped the project or build it from source.<br>
In that case Go is required to run this project on the host machine. You can download it [here](https://golang.org/dl/).

```sh
git clone https://github.com/cn1t/informatikquizbiber.git
cd informatikquizbiber
go build
./informatikquizbiber.exe
```

These are the websites you can visit (simply change ```localhost``` to the IP of the host machine if you want to access it from another device in the same network):

Scoreboard: `http://localhost:3000/scoreboard.html`
Quiz: `http://localhost:3000`



## TODO
- Sanitize input (only ascii and max. 20 chars)