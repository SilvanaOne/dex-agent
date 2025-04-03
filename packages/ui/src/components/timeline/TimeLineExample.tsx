import { TimelineGroup } from "./TimeLine";

export const exampleItems: TimelineGroup[] = [
  {
    groupId: "1",
    status: "completed",
    title: "Project Kickoff",
    lines: [
      {
        lineId: "1-1",
        content: (
          <>
            Successfully launched the project. View the{" "}
            <a href="#" className="text-blue-500 hover:underline">
              kickoff document
            </a>
            .
          </>
        ),
        status: "success",
      },
    ],
  },
  {
    groupId: "2",
    status: "warning",
    title: "Design Review",
    lines: [
      {
        lineId: "2-1",
        content: (
          <>
            <ul className="list-disc pl-5">
              <li>Minor issues found during review.</li>
              <li>
                Check the{" "}
                <a href="#" className="text-accent hover:underline">
                  design feedback
                </a>
                .
              </li>
            </ul>
          </>
        ),
        status: "success",
      },
    ],
  },
  {
    groupId: "3",
    status: "error",
    title: "Backend Integration",
    lines: [
      {
        lineId: "3-1",
        content: (
          <>
            Critical error in API integration. See the{" "}
            <a href="#" className="text-blue-500 hover:underline">
              error log
            </a>
            .
          </>
        ),
        status: "error",
      },
    ],
  },
  {
    groupId: "4",
    status: "waiting",
    title: "User Testing",
    lines: [
      {
        lineId: "4-1",
        content: (
          <>
            Awaiting user feedback. Check the{" "}
            <a href="#" className="text-blue-500 hover:underline">
              testing schedule
            </a>
            .
          </>
        ),
        status: "waiting",
      },
    ],
  },
  {
    groupId: "5",
    status: "success",
    title: "Final Deployment",
    lines: [
      {
        lineId: "5-1",
        content: (
          <>
            Successfully deployed to production. View the{" "}
            <a href="#" className="text-blue-500 hover:underline">
              deployment report
            </a>
            .
          </>
        ),
        status: "success",
      },
    ],
  },
  {
    groupId: "6",
    status: "waiting",
    title: "Waiting for tx",
    lines: [
      {
        lineId: "6-1",
        content: (
          <>
            Awaiting the tx to be mined. Check the{" "}
            <a href="#" className="text-blue-500 hover:underline">
              tx status
            </a>
            .
          </>
        ),
        status: "waiting",
      },
    ],
  },
];
