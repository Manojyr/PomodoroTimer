const display = document.getElementById("display");
      const beep = document.getElementById("beep");
      const app = document.getElementById("app");
      const modeButtons = document.querySelectorAll(".modes button");
      const durations = {
          pomodoro: 1500,
          short: 300,
          long: 900
      };
      let mode = "pomodoro",
          time = durations[mode],
          timer = null;

      function update() {
          const min = String(Math.floor(time / 60)).padStart(2, "0");
          const sec = String(time % 60).padStart(2, "0");
          display.textContent = `${min}:${sec}`;
          document.title = `${min}:${sec} — ${mode === "pomodoro" ? "Focus" : "Break!"}`;
      }

      function notify(msg) {
          if (Notification.permission === "granted") new Notification(msg);
          alert(msg);
      }

      function setMode(m) {
          mode = m;
          time = durations[m];
          clearInterval(timer);
          timer = null;
          document.body.className = `theme-${m}`;
          app.className = `container`;
          modeButtons.forEach(btn =>
              btn.classList.toggle("active", btn.textContent.toLowerCase().includes(m))
          );
          notify(m === "pomodoro" ? "Focus time!" : `Take a break! (${time / 60}:00)`);
          update();
          start();
      }

      function start() {
          if (timer) return;
          timer = setInterval(() => {
              if (time > 0) {
                  time--;
                  update();
              } else {
                  clearInterval(timer);
                  timer = null;
                  beep.play();
                  notify("Time’s up!");
              }
          }, 1000);
      }

      function stopTimer() {
          clearInterval(timer);
          timer = null;
      }

      if (Notification.permission !== "granted") Notification.requestPermission();
      update();