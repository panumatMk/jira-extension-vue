const root_path = 'rest/api/2';

export const jiraUrl = {
  get_search: `${root_path}/search`,
  get_all_dashboard: `${root_path}/dashboard`,
  post_worklog: `${root_path}/issue/{{id}}/worklog`,
  get_issue: `${root_path}/issue/{{issueKey}}`
}
