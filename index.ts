import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

const auth = process.env.AUTH_TOKEN;

const api = axios.create({
  baseURL: "https://api.github.com/",
  headers: {
    Authorization: `token ${auth}`,
  },
});

async function unfollow(user: User) {
  try {
    const result = await api.delete(`/user/following/${user.login}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    console.log(`Not following ${user.login}`);
  } catch (error) {
    throw error;
  }
}

async function follow(user: User) {
  try {
    const result = await api.put(`/user/following/${user.login}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    console.log(`Following ${user.login}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
}

async function unfollowAllUsers() {
  const user = "gyroflaw";

  let page = 1;
  while (true) {
    const { data } = await api.get<User[]>(`/users/${user}/following`, {
      params: { page },
    });
    if (data.length === 0) break;
    else {
      const promises = data.map(async (u) => {
        await unfollow(u);
      });
      await Promise.all(promises);
    }
  }
}

async function followAllUsers() {
  const user = "gyroflaw";

  let page = 4;
  while (true) {
    const { data } = await api.get<User[]>(`/users/${user}/followers`, {
      params: { page },
    });
    if (data.length === 0) break;
    else {
      const promises = data.map(async (u) => {
        await follow(u);
      });
      await Promise.all(promises);
      page += 1;
    }
  }
}

function main() {
  try {
    // unfollowAllUsers();
    followAllUsers();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // console.error(error.response);
    }
  }
}

main();
