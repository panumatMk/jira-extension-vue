const root_path = "rest/api/2";

export const jiraUrl = {
  get_myself: `${root_path}/myself`,
  get_search: `${root_path}/search`,
  get_all_dashboard: `${root_path}/dashboard`,
  get_worklog: (issueKey: string) => `${root_path}/issue/${issueKey}/worklog`,
  post_worklog: (issueKey: string) => `${root_path}/issue/${issueKey}/worklog`,
  delete_worklog: (issueKey: string, id: string) => `${root_path}/issue/${issueKey}/worklog/${id}`,
  get_issue: (issueKey: string) => `${root_path}/issue/${issueKey}`
};
