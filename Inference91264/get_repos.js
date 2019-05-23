const fetch = require('node-fetch');

const token = require('./token.js');

const delay = ms => new Promise(res => setTimeout(res, ms));

const authHeaders = {
  Authorization: `token ${token}`
};

const api = async path => {
  await delay(60*60*1000/5000);
  const res = await fetch(
    `https://api.github.com${path}`,
    { headers: authHeaders }
  );
  const data = await res.json();

  if (Array.isArray(data))
    return data;
  else
    console.error(data);
}

const fetchPage = (org, n) =>
  api(`/orgs/${org}/repos?page=${n}`);

const fetchRepos = async org => {
  for (let i = 0; true; i++) {
    let page = await fetchPage(org, i);
    while (!Array.isArray(page))
      page = await fetchPage(org, i);
    if (page.length <= 0) break;

    for (const repo of page)
      console.log(`${org}, ${repo.full_name}, ${repo.stargazers_count}`);
    console.error(`completed ${i}`);
  }
};

fetchRepos('google').then(() => fetchRepos('microsoft'));
