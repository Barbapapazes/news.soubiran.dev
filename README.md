# news.soubiran.dev

Displays the latest quick news from [Estéban](https://soubiran.dev)'s technology monitoring. Each of them has been processed using AI to extract the most relevant information and to provide a critical analysis, available in the Discord discussion, where you can come and share your thoughts on the topic.

A RSS feed is also available at `/feed.rss` for readers who prefer to consume news in their feed reader.

## Development

```bash
pnpm install
```

Copy `.env.example` to `.env`.

```txt
DISCORD_GUILD_ID=your_discord_guild_id_here
QUICK_NEWS_CF_ACCESS_CLIENT_ID=your_cloudflare_access_client_id_here
QUICK_NEWS_CF_ACCESS_CLIENT_SECRET=your_cloudflare_access_client_secret_here
```

The app fetches Quick News articles from a Cloudflare Access-protected endpoint
at build time and in development through the Vite plugin in
`plugins/quick-news/`. Make sure the Access client credentials you provide can
read the Quick News API.

Run locally:

```bash
pnpm run dev
```

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/barbapapazes">
    <img src="https://cdn.jsdelivr.net/gh/barbapapazes/static/sponsors.svg" alt="Sponsors" />
  </a>
</p>
