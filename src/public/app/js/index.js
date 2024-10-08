// menu
function open_menu() {
  this.$refs.menu.showModal();
  this.$dispatch("update-free-room");
}

function close_menu({ clientX, clientY }) {
  const { left, right, top, bottom } = this.$refs.menu.getBoundingClientRect();

  if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
    this.$refs.menu.close();
  }
}

// planning
const search_params = new URLSearchParams(location.search);
let level = search_params.get("level") || localStorage.getItem("history-level");
let group = search_params.get("group") || localStorage.getItem("history-group");
const title_element = [
  document.getElementsByTagName("h1")[0],
  document.getElementsByTagName("h2")[0],
];

const in_favorites = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites"));

  return favorites.some((favorite) =>
    favorite.level == level && favorite.group == group
  );
};

const load_planning = debounce((planning_data) => {
  if (
    planning_resources_name[planning_data?.level]
      ?.name_list[planning_data?.group]
  ) {
    Alpine.store("planning_viewer").load(planning_data);
    title_element[0].textContent =
      planning_resources_name[planning_data?.level].name;
    title_element[1].textContent = planning_resources_name[planning_data?.level]
      ?.name_list[planning_data?.group];

    document.title = `${planning_resources_name[planning_data?.level].name} ${
      planning_resources_name[planning_data?.level]
        ?.name_list[planning_data?.group]
    }`;
  } else Alpine.store("planning_viewer").reset();
}, 150);

const add_empty_days = (planning_data) => {
  const end_date = new Date(planning_data.end_date);
  let date = new Date(planning_data.start_date);
  const date_list = new Set(
    planning_data.days.map((day) => day.date),
  );

  while (compare_date(date, end_date)) {
    const date_string = date.toISOString();

    if (
      !date_list.has(date_string)
    ) {
      planning_data.days.push({
        date: date_string,
        lessons: [],
      });
    }

    date = add_days(date, 1);
  }

  return planning_data;
};

const merge_new_planning = (current_planning_data, new_planning_data) => {
  // update start and end date of the planning
  if (
    compare_date(
      new_planning_data.start_date,
      current_planning_data.start_date,
    ) > 0
  ) {
    current_planning_data.start_date = new_planning_data.start_date;
  }
  if (
    compare_date(new_planning_data.end_date, current_planning_data.end_date) < 0
  ) {
    current_planning_data.end_date = new_planning_data.end_date;
  }

  const old_data_indexes = new Map(
    current_planning_data.days.map((day, index) => {
      return [day.date, index];
    }),
  );

  for (const new_day of new_planning_data.days) {
    const old_data_index = old_data_indexes.get(new_day.date);

    if (old_data_index) {
      current_planning_data.days[old_data_index] = new_day; // update old day data
    } else current_planning_data.days.push(new_day); // add new day data
  }

  current_planning_data.days.sort((day_a, day_b) =>
    -compare_date(day_a.date, day_b.date)
  );
};

const fetch_planning = async (level, group, start_date, end_date) => {
  if (!navigator.onLine) return null; // do nothing if there is no connection

  start_loader();

  try {
    const response = await fetch(
      `https://api.asimov-lemans.fr/v2/planning.json?level=${level}&group=${group}&start=${start_date.toISOString()}&end=${end_date.toISOString()}`,
    );

    end_loader();

    return add_empty_days(await response.json());
  } catch {
    console.error(`Failed to update level : ${level}, group : ${group}`);

    end_loader();

    return null;
  }
};

const update_favorites_planning = async (initial = false) => {
  if (!navigator.onLine) return; // do nothing if there is no connection

  start_loader();

  const favorites = JSON.parse(localStorage.getItem("favorites"));
  const favorites_planning_data = await Promise.all(
    favorites.map((favorite) =>
      fetch_planning(
        favorite.level,
        favorite.group,
        initial // if its not the initial request the 7 last are useless
          ? keep_only_date(add_days(new Date(), -7))
          : keep_only_date(new Date()),
        keep_only_date(Date.now() + new Date(0).setMonth(4)),
      )
    ),
  );

  for (const new_planning_data of favorites_planning_data) {
    if (new_planning_data) {
      const planning_id =
        `${new_planning_data.level}:${new_planning_data.group}`;
      const planning_data = JSON.parse(localStorage.getItem(planning_id)) ||
        { days: [], ...new_planning_data };

      merge_new_planning(planning_data, new_planning_data);

      localStorage.setItem(
        planning_id,
        JSON.stringify(planning_data),
      );
    }
  }

  end_loader();
};

const update_planning = async (initial = false) => {
  start_loader();

  if (!navigator.onLine) { // load only favorites if there is no connection
    load_planning(JSON.parse(localStorage.getItem(`${level}:${group}`)));
    end_loader();

    return;
  }
  if (
    typeof level !== "string" ||
    !(typeof group === "string" || typeof group === "number")
  ) { // if no level or group selected, only favorites can be updated
    update_favorites_planning();
    end_loader();

    return;
  }

  let planning_data;

  // if its the initial loading and the selected is a favorite load first from cache
  // then wait for favorites to be fetched and load new data
  if (in_favorites()) {
    const favorites_promise = update_favorites_planning();

    if (initial) {
      load_planning(JSON.parse(localStorage.getItem(`${level}:${group}`)));
    }

    await favorites_promise;

    planning_data = JSON.parse(localStorage.getItem(`${level}:${group}`));
  } else {
    planning_data = await fetch_planning(
      level,
      group,
      initial // if its not the initial request the 7 last are useless
        ? keep_only_date(add_days(new Date(), -7))
        : keep_only_date(new Date()),
      initial
        ? keep_only_date(add_days(new Date(), 7))
        : Alpine.store("planning_viewer").end_date,
    );

    if (!initial) {
      const new_planning_data = planning_data;

      planning_data = { ...Alpine.store("planning_viewer").data };

      merge_new_planning(planning_data, new_planning_data);
    }
  }

  load_planning(planning_data);
  end_loader();
};

const fetch_favorite_planning = async (level, group) => {
  if (!navigator.onLine) return; // do nothing if there is no connection

  start_loader();

  localStorage.setItem(
    `${level}:${group}`,
    JSON.stringify(
      await fetch_planning(
        level,
        group,
        keep_only_date(add_days(new Date(), -7)),
        keep_only_date(Date.now() + new Date(0).setMonth(4)),
      ),
    ),
  );

  end_loader();
};

const switch_planning = (level_, group_) => {
  start_loader();

  if (level != level_ || group != group_) {
    level = level_;
    group = group_;
    localStorage.setItem("history-level", level);
    localStorage.setItem("history-group", group);
    history.pushState(
      { level, group },
      "",
      location.origin + location.pathname + `?level=${level}&group=${group}`,
    );
  }

  if (!navigator.onLine && !in_favorites()) {
    title_element[0].textContent = "Pas d'internet";
    title_element[1].textContent = "rip... faut attendre";
  }

  update_planning(true);
  end_loader();
};

window.addEventListener("load", async () => {
  await planning_resources_loaded;

  // listen for planning fetch request
  window.addEventListener("planningfetch", async (event) => {
    if (!navigator.onLine) return; // do nothing if there is no connection

    start_loader();

    const planning_data = { ...Alpine.store("planning_viewer").data };
    let new_planning_data;

    if (event.request > 0) {
      new_planning_data = await fetch_planning(
        level,
        group,
        Alpine.store("planning_viewer").end_date,
        keep_only_date(add_days(Alpine.store("planning_viewer").end_date, 7)),
      );

      merge_new_planning(planning_data, new_planning_data);
    } else {
      new_planning_data = await fetch_planning(
        level,
        group,
        keep_only_date(
          add_days(Alpine.store("planning_viewer").start_date, -7),
        ),
        Alpine.store("planning_viewer").start_date,
      );

      merge_new_planning(planning_data, new_planning_data);
    }

    if (in_favorites()) {
      localStorage.setItem(`${level}:${group}`, JSON.stringify(planning_data));
    }

    load_planning(planning_data);
    end_loader();
  });

  // load the targeted planning
  if (typeof level === "string" && typeof group === "string") {
    switch_planning(level, group);
  } else update_planning();

  setInterval(update_planning, 1000 * 60 * 60);

  window.addEventListener(
    "popstate",
    (event) => {
      if (event.state) switch_planning(event.state.level, event.state.group);
    },
  );

  // install the service worker
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/sw.js",
      );

      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Service worker registration failed with ${error}`);
    }
  }
});
