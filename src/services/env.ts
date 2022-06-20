const root_path = 'rest/api/2';

export const jiraUrl = {
  get_search: `${root_path}/search`,
  get_all_dashboard: `${root_path}/dashboard`,
  get_worklog: `${root_path}/issue/{{issueKey}}/worklog`,
  post_worklog: `${root_path}/issue/{{issueKey}}/worklog`,
  get_issue: `${root_path}/issue/{{issueKey}}`,
}
