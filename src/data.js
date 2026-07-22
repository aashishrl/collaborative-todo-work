const files = [
  {
    id: "file-1",
    name: "Frontend",

    columns: [
      {
        id: "todo",
        title: "Todo",
        tasks: [
          {
            id: "task-1",
            title: "Create Navbar",
            description: "Responsive navigation",
            createdAt: "2026-07-21",
          },
          {
            id: "task-2",
            title: "Login Page",
          },
        ],
      },

      {
        id: "inprogress",
        title: "In Progress",
        tasks: [
          {
            id: "task-3",
            title: "Sidebar",
          },
        ],
      },

      {
        id: "done",
        title: "Done",
        tasks: [],
      },
    ],
  },

  {
    id: "file-2",
    name: "Backend",

    columns: [
      {
        id: "todo",
        title: "Todo",
        tasks: [],
      },
      {
        id: "inprogress",
        title: "In Progress",
        tasks: [],
      },
      {
        id: "done",
        title: "Done",
        tasks: [],
      },
    ],
  },
];