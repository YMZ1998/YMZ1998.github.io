#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""fetch-global-tech-news.py
每天自动抓取全球科技新闻并发布到博客
"""
import sys
import os
import re
import subprocess
from datetime import datetime, timedelta

try:
    import requests
except ImportError:
    print("ERROR: requests module not found. Run: pip install requests")
    sys.exit(1)

REPO_ROOT = r"D:\code\YMZ1998.github.io"
POSTS_DIR = os.path.join(REPO_ROOT, "_posts")
DRAFTS_DIR = os.path.join(REPO_ROOT, "_drafts")

TEST_MODE = "-Test" in sys.argv or "--test" in sys.argv

today = datetime.now()
date_str = today.strftime("%Y-%m-%d")
date_full = today.strftime("%Y-%m-%d 08:00:00 +0800")
day_num_cn = today.strftime("%Y年%m月%d日")

print(f"[{today}] Start fetching global tech news...")


def fetch_hackernews(tag="front_page", limit=15):
    since_ts = int((today - timedelta(days=1)).timestamp())
    url = f"https://hn.algolia.com/api/v1/search?tags={tag}&hitsPerPage={limit}&numericFilters=created_at_i%3e{since_ts}"
    try:
        r = requests.get(url, headers={"User-Agent": "YMZ-Blog-Bot/1.0"}, timeout=15)
        r.raise_for_status()
        return r.json().get("hits", [])
    except Exception as e:
        print(f"  HN API error: {e}")
        return []


def fetch_techcrunch(limit=10):
    url = "https://techcrunch.com/feed/"
    try:
        r = requests.get(url, headers={"User-Agent": "YMZ-Blog-Bot/1.0"}, timeout=15)
        r.raise_for_status()
        content = r.text
        items = []
        item_pattern = re.compile(r"<item>(.*?)</item>", re.DOTALL)
        for i, item_match in enumerate(item_pattern.finditer(content)):
            if i >= limit:
                break
            xml = item_match.group(1)
            title_m = re.search(r"<title>(.*?)</title>", xml, re.DOTALL)
            title = title_m.group(1).strip() if title_m else ""
            link_m = re.search(r"<link>(https?://[^<]+)</link>", xml)
            link = link_m.group(1).strip() if link_m else ""
            desc_m = re.search(r"<description>(.*?)</description>", xml, re.DOTALL)
            desc_raw = desc_m.group(1) if desc_m else ""
            desc = re.sub(r"<[^>]+>", "", desc_raw).strip()
            desc = re.sub(r"\s+", " ", desc)
            if title:
                items.append({"title": title, "url": link, "desc": desc})
        return items
    except Exception as e:
        print(f"  TechCrunch error: {e}")
        return []


def fetch_theverge(limit=10):
    url = "https://www.theverge.com/rss/index.xml"
    try:
        r = requests.get(url, headers={"User-Agent": "YMZ-Blog-Bot/1.0"}, timeout=15)
        r.raise_for_status()
        content = r.text
        items = []
        entry_pattern = re.compile(r"<entry>(.*?)</entry>", re.DOTALL)
        for i, entry_match in enumerate(entry_pattern.finditer(content)):
            if i >= limit:
                break
            xml = entry_match.group(1)
            title_m = re.search(r'<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</title>', xml, re.DOTALL)
            title = title_m.group(1).strip() if title_m else ""
            link_m = re.search(r'<link[^>]*rel="alternate"[^>]*href="([^"]+)"', xml)
            item_url = link_m.group(1).strip() if link_m else ""
            summary_m = re.search(r'<summary[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</summary>', xml, re.DOTALL)
            desc_raw = summary_m.group(1) if summary_m else ""
            desc = re.sub(r"<[^>]+>", "", desc_raw).strip()
            desc = re.sub(r"\s+", " ", desc)
            if title:
                items.append({"title": title, "url": item_url, "desc": desc})
        return items
    except Exception as e:
        print(f"  The Verge error: {e}")
        return []


# Fetch news
hn_hits = []
hn_hits += fetch_hackernews("front_page", 15)
hn_hits += fetch_hackernews("ask_hn", 5)
hn_hits += fetch_hackernews("show_hn", 5)

seen = set()
unique_hn = []
for h in hn_hits:
    u = h.get("url", "")
    if u and u not in seen:
        seen.add(u)
        unique_hn.append(h)
print(f"  HN: {len(unique_hn)} items")

tc_items = fetch_techcrunch(10)
print(f"  TC: {len(tc_items)} items")

verge_items = fetch_theverge(10)
print(f"  Verge: {len(verge_items)} items")

# Build summary
hn_top3 = unique_hn[:3]
summary_parts = []
for n in hn_top3:
    t = n.get("title", "")
    if len(t) > 80:
        t = t[:77] + "..."
    summary_parts.append(t)
summary = "\uff0c".join(summary_parts)
if len(summary) > 200:
    summary = summary[:197] + "..."


def fmt_title(t):
    if len(t) > 150:
        return t[:147] + "..."
    return t


def fmt_desc(d):
    if not d:
        return ""
    d = re.sub(r"<[^>]+>", "", d).strip()
    d = re.sub(r"\s+", " ", d)
    if len(d) > 150:
        return d[:147] + "..."
    return d


CRLF = "\r\n"

body = f"## \U0001f30d 全球科技日报 | {day_num_cn}{CRLF}---{CRLF}{CRLF}"

if unique_hn:
    body += f"### \U0001f525 HackerNews \u70ed\u95e8{CRLF}{CRLF}"
    for item in unique_hn:
        t = fmt_title(item.get("title", ""))
        pts = item.get("points", 0)
        auth = item.get("author", "")
        meta = f"**{pts} \u7968 @{auth}**" if pts or auth else ""
        body += f"**{t}**{CRLF}{CRLF}"
        if meta:
            body += f"{meta}{CRLF}{CRLF}"
        url = item.get("url", "")
        body += f"[\u539f\u6587\u94fe\u63a5]({url}){CRLF}{CRLF}"

if tc_items:
    body += f"---{CRLF}{CRLF}\U0001f4f0 TechCrunch{CRLF}{CRLF}"
    for item in tc_items:
        t = fmt_title(item.get("title", ""))
        d = fmt_desc(item.get("desc", ""))
        url = item.get("url", "")
        body += f"**{t}**{CRLF}{CRLF}"
        if d:
            body += f"> {d}...{CRLF}{CRLF}"
        body += f"[\u539f\u6587\u94fe\u63a5]({url}){CRLF}{CRLF}"

if verge_items:
    body += f"---{CRLF}{CRLF}\U0001f5de The Verge{CRLF}{CRLF}"
    for item in verge_items:
        t = fmt_title(item.get("title", ""))
        d = fmt_desc(item.get("desc", ""))
        url = item.get("url", "")
        body += f"**{t}**{CRLF}{CRLF}"
        if d:
            body += f"> {d}...{CRLF}{CRLF}"
        body += f"[\u539f\u6587\u94fe\u63a5]({url}){CRLF}{CRLF}"

body += f"---{CRLF}{CRLF}> \U0001f916 \u672c\u65e5\u8d44\u8baf\u7531\u81ea\u52a8\u5316\u811a\u672c\u62e8\u53d6\u6574\u7406\uff0c\u4fe1\u606f\u6765\u6e90\u4e8e HackerNews\u3001TechCrunch\u3001The Verge \u7b49\u516c\u5f00\u6e90\u3002\u5efa\u8bae\u8bfb\u8005\u81ea\u884c\u6838\u5b9e\u91cd\u8981\u4fe1\u606f\u3002{CRLF}"

# Generate file
slug = f"global-tech-daily-brief-{today.strftime('%Y%m%d')}"
file_name = f"{date_str}-{slug}.md"
file_path = os.path.join(POSTS_DIR, file_name)
draft_path = os.path.join(DRAFTS_DIR, f"{slug}.md")

if TEST_MODE:
    file_path = draft_path
    print(f"[Test mode] Save to: {file_path}")
else:
    if os.path.exists(file_path):
        print(f"Already exists: {file_path}")
        print("Skip.")
        sys.exit(0)

safe_summary = summary.replace("'", "''")

fm = f"""---
layout: post
title: '\U0001f30d \u5168\u7403\u79d1\u6280\u65e5\u62a5 {day_num_cn}'
date: {date_full}
topic: \u5168\u7403\u79d1\u6280
read_time: 5 \u5206\u949f
summary: '{safe_summary}'
description: '{safe_summary}'
---

"""

full_content = fm + body

with open(file_path, "w", encoding="utf-8") as f:
    f.write(full_content)
print(f"Written: {file_path}")

if TEST_MODE:
    print("[Test mode] No push.")
    sys.exit(0)

# Git push
os.chdir(REPO_ROOT)
try:
    result = subprocess.run(
        ["git", "status", "--short", f"_posts/{file_name}"],
        capture_output=True, text=True, encoding="utf-8"
    )
    if not result.stdout.strip():
        print("Nothing to commit.")
    else:
        subprocess.run(["git", "add", f"_posts/{file_name}"], check=True)
        commit_msg = f"\U0001f916 Auto: global tech {date_str}"
        subprocess.run(["git", "commit", "-m", commit_msg], check=True, text=True)
        print("Git commit OK")
        subprocess.run(["git", "push", "origin", "main"], check=True, text=True)
        print("\u2705 Pushed to GitHub")
except subprocess.CalledProcessError as e:
    print(f"Git error: {e}")
    sys.exit(1)

print("Done.")
